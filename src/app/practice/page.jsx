"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import CodeEditor from "./_components/Editor";
import { api } from "../../../convex/_generated/api";
import NavigationHeader from "@/components/NavigationHeader";
import { useUser } from "@clerk/nextjs";
import HeaderProfileBtn from "../(root)/_components/HeaderProfileBtn";
import Confetti from "react-confetti";
import LoadingSkeleton from "../snippets/[id]/_components/LoadingSkeleton";
import { Maximize, Menu, Minimize } from "lucide-react";
import toast from "react-hot-toast";
import Split from "react-split";

import { GoogleGenerativeAI } from "@google/generative-ai";
import Loader from "@/components/CubeLoader";

const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

export default function PracticePage() {
  const { isSignedIn, isLoaded } = useUser();
  const rawProblems = useQuery(api.problems.getAllProblems);
  const problems = useMemo(() => rawProblems || [], [rawProblems]);

  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [isLoadingProStatus, setIsLoadingProStatus] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const createSubmission = useMutation(api.problemsubmissions.createSubmission);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [isProblemListCollapsed, setIsProblemListCollapsed] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [isFullFocus, setIsFullFocus] = useState(false);

  const splitRef = useRef(null);

  const toggleProblemList = () => {
    if (splitRef.current) {
      const newProblemCollapsed = !isProblemListCollapsed;

      // Calculate new sizes based on both states
      const problemSize = newProblemCollapsed ? 0 : 20;
      const chatSize = isChatCollapsed ? 0 : 20;
      const remainingSpace = 100 - problemSize - chatSize;

      // Distribute remaining space between description and code
      const descSize = remainingSpace * 0.4; // 40% of remaining
      const codeSize = remainingSpace * 0.6;  // 60% of remaining

      splitRef.current.split.setSizes([problemSize, descSize, codeSize, chatSize]);
      setIsProblemListCollapsed(newProblemCollapsed);
    }
  };

  const toggleChat = () => {
    if (splitRef.current) {
      const newChatCollapsed = !isChatCollapsed;

      // Calculate new sizes based on both states
      const problemSize = isProblemListCollapsed ? 0 : 20;
      const chatSize = newChatCollapsed ? 0 : 20;
      const remainingSpace = 100 - problemSize - chatSize;

      // Distribute remaining space between description and code
      const descSize = remainingSpace * 0.4; // 40% of remaining
      const codeSize = remainingSpace * 0.6;  // 60% of remaining

      splitRef.current.split.setSizes([problemSize, descSize, codeSize, chatSize]);
      setIsChatCollapsed(newChatCollapsed);
    }
  };

  const fullFocusScreen = () => {
    if (splitRef.current) {
      if (isFullFocus) {
        // Expand: restore original sizes
        splitRef.current.split.setSizes([20, 25, 35, 20]);
      } else {
        // Collapse: set first panel to 0, redistribute space
        splitRef.current.split.setSizes([0, 50, 50, 0]);
      }
      setIsFullFocus(!isFullFocus);
    }
  };

  const handleChat = async () => {
    if (!input.trim() || !selectedProblem) return;

    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

      const context = `
        You are an expert coding assistant.
        Provide clear, simple, and concise explanations or hints related to the coding problem below.
        Avoid full solutions unless the user clearly asks for them.
        Always give responses in plain text — no markdown, no **bold**, no code blocks.
        Keep answers short, around 2-4 easy sentences.
        Break complex ideas into simple parts using natural language.
        If necessary, include only minimal code with proper indentation and no markdown.
        Use the language ${selectedLanguage} for examples or explanations.
        try to give hints instead of solutions.
        try to give answer in bulleted format if possible.Dont use * fro that but use points. like 1. next line 2. next line 3.next line
        if you provide code then provide the time and space complexity of the code simply.
        if user ask for complexity directly in 2 word give response only with time and space complexity.
        Pro User have access to practice problem, ai chat, view all snippets, and share snippets, can run all type of languages (normal user have only run javascript code) 
        Pro plane is 399 rupees for life time 
        User Status :${isPro ? "User is a Pro Member" : "User is not a Pro member"}
        Problem Title: ${selectedProblem.title}
        Description: ${selectedProblem.description}
        User written code: ${code || "N/A"}

        Most of the the time give code responses or hints
        -------------------
        The above is the context for you the important is user Question which is bellow this
        User Question(important): ${input}
        `;

      const result = await model.generateContent(context);
      const text = await result.response.text();

      setMessages([...newMessages, { role: "assistant", content: text }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "⚠️ Error: Unable to fetch AI response." },
      ]);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/getUser");
        const data = await res.json();
        setUser(data.user);
      } catch { }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setIsLoadingProStatus(true);
        const res = await fetch("/api/getProStatus");
        const data = await res.json();
        setIsPro(data.isPro);
      } catch {
        setIsPro(false);
      } finally {
        setIsLoadingProStatus(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (problems && problems.length > 0 && !selectedProblem) {
      setSelectedProblem(problems[0]);
    }
  }, [problems, selectedProblem]);

  useEffect(() => {
    if (selectedProblem && selectedProblem.baseCode) {
      const base = selectedProblem.baseCode[selectedLanguage];
      setCode(base || "");
      setTestResults([]);
      setShowConfetti(false);
    }
  }, [selectedProblem, selectedLanguage]);

  const handleSubmit = async () => {
    if (!selectedProblem) return;
    setIsSubmitting(true);
    setTestResults([]);
    setShowConfetti(false);

    const languageMap = { cpp: 54, python: 71, javascript: 63, java: 62 };
    const results = [];
    let passedCount = 0;
    const totalCount = selectedProblem.testCases.length;

    for (const test of selectedProblem.testCases) {
      try {
        const res = await fetch("/api/judge0", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source_code: code,
            language_id: languageMap[selectedLanguage],
            stdin: test.input,
          }),
        });

        const data = await res.json();
        if (data.message?.includes("exceeded the DAILY quota")) {
          toast.error(
            "Our daily submission limit exceeded. Please try again Yesterday."
          );
          break;
        }

        const output = data.stdout.trim();
        const expected = (test.expectedOutput || "").trim();
        const passed = output === expected;
        if (passed) passedCount++;

        results.push({
          input: test.input,
          expected,
          actual: output,
          passed,
        });
      } catch (err) {
        results.push({
          input: test.input,
          expected: test.expectedOutput,
          actual: "Error executing code",
          passed: false,
        });
        console.error(err);
      }
    }

    try {
      await createSubmission({
        userId: user._id,
        userName: user.name,
        problemId: selectedProblem.problemId,
        problemTitle: selectedProblem.title,
        language: selectedLanguage,
        code,
        passedCount,
        totalCount,
        status: passedCount === totalCount ? "Accepted" : "Failed",
        results,
      });
    } catch (err) {
      console.error("Error saving submission:", err);
    }

    setTestResults(results);
    setIsSubmitting(false);

    if (passedCount === totalCount) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 15000);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-full text-gray-400">
        <NavigationHeader />
        <div>
          <Loader />
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center text-gray-300">
        <NavigationHeader />
        <div className="mt-24 flex flex-col items-center gap-6 justify-center">
          <h1 className="text-3xl font-bold mb-4">
            You need to be logged in to access practice problems
          </h1>
          <HeaderProfileBtn />
        </div>
      </div>
    );
  }

  if (isLoadingProStatus) {
    return (
      <div className="h-full  text-gray-400">
        <NavigationHeader />
        <Loader/>
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-center text-gray-300">
        <NavigationHeader />
        <LoadingSkeleton showProOverlay={true} />
      </div>
    );
  }

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <Confetti
            width={typeof window !== "undefined" ? window.innerWidth : 0}
            height={typeof window !== "undefined" ? window.innerHeight : 0}
            numberOfPieces={1500}
            recycle={false}
          />
        </div>
      )}
      <NavigationHeader />

      {/* Mobile Drawer Toggle */}
      <div className="md:hidden flex items-center justify-between p-3 bg-[#111] border-b border-gray-800">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 text-sm text-gray-300"
        >
          <Menu size={18} /> Problems
        </button>
        <span className="text-sm text-gray-400">
          {selectedProblem?.problemId?.toUpperCase()}. {selectedProblem?.title}
        </span>
      </div>

      {/* Drawer Overlay (Mobile) */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        ></div>
      )}

      {/* Drawer Panel (Mobile) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#111] border-r border-gray-800 z-40 transform transition-transform duration-300 md:hidden ${drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-3 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-300">Problems</h2>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="p-2 overflow-y-auto h-[calc(100%-40px)]">
          {problems.map((p) => (
            <div
              key={p._id}
              onClick={() => {
                setSelectedProblem(p);
                setDrawerOpen(false);
              }}
              className={`cursor-pointer p-2 rounded-md mb-2 text-sm ${selectedProblem?._id === p._id
                ? "bg-blue-700"
                : "bg-[#1a1a1a] hover:bg-[#222]"
                }`}
            >
              {p?.problemId?.toUpperCase()}. {p.title}
            </div>
          ))}
        </div>
      </div>

      {/* Main Layout - Desktop */}
      <div className="hidden md:flex bg-[#0a0a0f] text-white h-[92vh] overflow-hidden relative">
        {/* Toggle Button - Positioned absolutely */}
        <button
          onClick={toggleProblemList}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-transparent hover:bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg transition-all duration-300"

          title={isProblemListCollapsed ? "Show Problems" : "Hide Problems"}
        >
          {isProblemListCollapsed ? '›' : '‹'}
        </button>
        <button
          onClick={toggleChat}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-50 hover:bg-blue-600 bg-transparent text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg transition-all duration-300"

          title={toggleChat ? "Show Chats" : "Hide Chats"}
        >
          {toggleChat ? '›' : '‹'}
        </button>
        <button
          onClick={fullFocusScreen}
          className="absolute left-0 top-1 -translate-y-1/2 z-50 hover:bg-blue-600 bg-transparent text-white rounded-sm m-1 p-1 w-6 h-6 flex items-center justify-center shadow-lg transition-all duration-300"

          title={isFullFocus ? "fullfocus" : "notfullfocus"}
        >
          {isFullFocus ? <Maximize /> : <Minimize />}
        </button>

        <Split
          ref={splitRef}
          className="flex w-full h-full"
          sizes={[20, 25, 35, 20]} // percentage for [problems list, description, code, chat]
          minSize={[0, 0, 0, 0]} // minimum px width - first is 0 to allow collapse
          gutterSize={6}
          gutterAlign="center"
          snapOffset={0}
          direction="horizontal"
          cursor="col-resize"
        >
          {/* Panel 1: Problems List */}
          <div className={`h-full p-4 border-r border-gray-800 overflow-y-auto bg-[#0a0a0f] transition-opacity duration-300 ${isProblemListCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}>
            <h2 className="text-sm font-semibold mb-3 text-gray-300 text-center">
              Problems
            </h2>
            {problems.map((p) => (
              <div
                key={p._id}
                onClick={() => setSelectedProblem(p)}
                className={`cursor-pointer p-2 rounded-md mb-2 text-sm ${selectedProblem?._id === p._id
                  ? "bg-blue-700"
                  : "bg-[#1a1a1a] hover:bg-[#222]"
                  }`}
              >
                {p?.problemId?.toUpperCase()}. {p.title}
              </div>
            ))}
          </div>

          {/* Panel 2: Problem Description */}
          <div className="h-full p-4 border-r border-gray-800 overflow-y-auto">
            {selectedProblem ? (
              <>
                <h1 className="text-lg md:text-xl font-semibold mb-2">
                  {selectedProblem.title}
                </h1>
                <p className="text-gray-300 mb-4 text-sm md:text-base">
                  {selectedProblem.description}
                </p>
                <p className="text-gray-400 mb-2 text-sm">
                  <strong>Difficulty:</strong> {selectedProblem.difficulty}
                </p>

                {selectedProblem.testCases?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2 text-gray-300">
                      Sample Test Cases
                    </h3>
                    {selectedProblem.testCases.map((tc, i) => (
                      <div
                        key={i}
                        className="bg-gray-900 p-3 m-1 rounded-lg border border-gray-700"
                      >
                        <p className="text-gray-400 text-sm mb-1">
                          <strong>Input:</strong> {tc.input}
                        </p>
                        <p className="text-gray-400 text-sm">
                          <strong>Expected Output:</strong> {tc.expectedOutput}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {testResults.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-gray-300">
                      Test Case Results
                    </h3>
                    {testResults.map((res, i) => (
                      <div
                        key={i}
                        className={`p-3 m-1 rounded-lg border ${res.passed
                          ? "border-green-600 bg-green-900/20"
                          : "border-red-600 bg-red-900/20"
                          }`}
                      >
                        <p className="text-sm text-gray-300">
                          <strong>Input:</strong> {res.input}
                        </p>
                        <p className="text-sm text-gray-300">
                          <strong>Expected:</strong> {res.expected}
                        </p>
                        <p className="text-sm text-gray-300">
                          <strong>Output:</strong>{" "}
                          <span
                            className={
                              res.passed ? "text-green-400" : "text-red-400"
                            }
                          >
                            {res.actual || "No Output"}
                          </span>
                        </p>
                        {res.error && (
                          <p className="text-red-400 text-xs mt-1">
                            Error: {res.error}
                          </p>
                        )}
                        <p
                          className={`text-xs mt-2 font-semibold ${res.passed ? "text-green-400" : "text-red-400"
                            }`}
                        >
                          {res.passed ? "✅ Passed" : "❌ Failed"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-sm">
                Select a problem to view details.
              </p>
            )}
          </div>

          {/* Panel 3: Code Editor */}
          <div className="h-full p-4 border-r border-gray-800 flex flex-col bg-[#0a0a0f]">
            <div className="flex justify-between mb-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-[#1a1a1a] border border-gray-700 rounded-md px-3 py-1 text-sm w-full md:w-auto"
              >
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
              </select>
            </div>

            <div className="flex-1 min-h-[300px] md:min-h-0">
              <CodeEditor code={code} setCode={setCode} language={selectedLanguage} />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedProblem || isSubmitting}
              className={`mt-4 py-2 rounded-md font-medium transition text-sm md:text-base ${selectedProblem
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-700 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? "Running..." : "Submit Code"}
            </button>
          </div>

          {/* Panel 4: AI Chat */}
          <div className="h-full flex flex-col bg-[#0c0c11]">
            {/* Header */}
            <div className="p-3 md:p-4 border-b border-gray-800 shrink-0">
              <h3 className="text-gray-200 font-semibold text-base">💬 Assistant</h3>
            </div>

            {/* Scrollable Messages */}
            <div className="flex-1 overflow-y-auto px-3 md:px-4 py-2 md:py-3 text-sm bg-[#111] border-b border-gray-800">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center mt-12 text-sm">
                  Ask for hints, explanations, or guidance about this problem.
                </p>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={`mb-3 whitespace-pre-wrap ${m.role === "user" ? "text-blue-400" : "text-gray-300"
                      }`}
                  >
                    <span className="font-bold text-green-700">
                      {m.role === "user" ? "You: " : "AI: "}
                    </span>
                    {m.content}
                  </div>
                ))
              )}
            </div>

            {/* Fixed Input Area */}
            <div className="p-3 md:p-4 flex items-center gap-2 border-t border-gray-800 bg-[#0c0c11] shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChat()}
                placeholder="Ask something..."
                className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <button
                onClick={handleChat}
                disabled={!input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm px-3 md:px-4 py-2 rounded-lg transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </Split>
      </div>


    </>
  )
}