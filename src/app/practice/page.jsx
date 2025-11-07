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
import { Maximize, Menu, Minimize, X } from "lucide-react";
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
  const [isThinking, setIsThinking] = useState(false);

  const [isProblemListCollapsed, setIsProblemListCollapsed] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [isFullFocus, setIsFullFocus] = useState(false);

  // Mobile tab state
  const [mobileActiveTab, setMobileActiveTab] = useState("description"); // description, code, chat

  const splitRef = useRef(null);

  const toggleProblemList = () => {
    if (splitRef.current) {
      const newProblemCollapsed = !isProblemListCollapsed;
      const problemSize = newProblemCollapsed ? 0 : 20;
      const chatSize = isChatCollapsed ? 0 : 20;
      const remainingSpace = 100 - problemSize - chatSize;
      const descSize = remainingSpace * 0.4;
      const codeSize = remainingSpace * 0.6;

      splitRef.current.split.setSizes([problemSize, descSize, codeSize, chatSize]);
      setIsProblemListCollapsed(newProblemCollapsed);
    }
  };

  const toggleChat = () => {
    if (splitRef.current) {
      const newChatCollapsed = !isChatCollapsed;
      const problemSize = isProblemListCollapsed ? 0 : 20;
      const chatSize = newChatCollapsed ? 0 : 20;
      const remainingSpace = 100 - problemSize - chatSize;
      const descSize = remainingSpace * 0.4;
      const codeSize = remainingSpace * 0.6;

      splitRef.current.split.setSizes([problemSize, descSize, codeSize, chatSize]);
      setIsChatCollapsed(newChatCollapsed);
    }
  };

  const fullFocusScreen = () => {
    if (splitRef.current) {
      if (isFullFocus) {
        // Exit full screen and reset layout
        document.exitFullscreen?.();
        splitRef.current.split.setSizes([20, 25, 35, 20]);
      } else {
        // Enter full screen and expand layout
        document.documentElement.requestFullscreen?.();
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
    setIsThinking(true);

    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

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
        try to give answer in bulleted format if possible. Dont use * for that but use points. like 1. next line 2. next line 3.next line
        if you provide code then provide the time and space complexity of the code simply.
        if user ask for complexity directly in 2 word give response only with time and space complexity.
        Pro User have access to practice problem, ai chat, view all snippets, and share snippets, can run all type of languages (normal user have only run javascript code) 
        Pro plane is 399 rupees for life time 
        User Status: ${isPro ? "User is a Pro Member" : "User is not a Pro member"}
        Problem Title: ${selectedProblem.title}
        Description: ${selectedProblem.description}
        User written code: ${code || "N/A"}

        Most of the the time give code responses or hints
        -------------------
        The above is the context for you the important is user Question which is below this
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
    } finally {
      setIsThinking(false);

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
            "Our daily submission limit exceeded. Please try again tomorrow."
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
      <div className="h-full text-gray-400">
        <NavigationHeader />
        <Loader />
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

      {/* ========== MOBILE LAYOUT ========== */}
      <div className="md:hidden flex flex-col h-[calc(100vh-64px)] bg-[#0a0a0f] text-white">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-3 bg-[#111] border-b border-gray-800 shrink-0">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 text-sm text-gray-300"
          >
            <Menu size={18} /> Problems
          </button>
          <span className="text-xs text-gray-400 truncate max-w-[180px]">
            {selectedProblem?.problemId?.toUpperCase()}. {selectedProblem?.title}
          </span>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="flex border-b border-gray-800 bg-[#111] shrink-0">
          <button
            onClick={() => setMobileActiveTab("description")}
            className={`flex-1 py-3 text-sm font-medium ${mobileActiveTab === "description"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
              }`}
          >
            Problem
          </button>
          <button
            onClick={() => setMobileActiveTab("code")}
            className={`flex-1 py-3 text-sm font-medium ${mobileActiveTab === "code"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
              }`}
          >
            Code
          </button>
          <button
            onClick={() => setMobileActiveTab("chat")}
            className={`flex-1 py-3 text-sm font-medium ${mobileActiveTab === "chat"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
              }`}
          >
            AI Chat
          </button>
        </div>

        {/* Mobile Content Area */}
        <div className="flex-1 overflow-hidden">
          {/* Description Tab */}
          {mobileActiveTab === "description" && (
            <div className="h-full p-4 overflow-y-auto">
              {selectedProblem ? (
                <>
                  <h1 className="text-lg font-semibold mb-2">
                    {selectedProblem.title}
                  </h1>
                  <p className="text-gray-300 mb-4 text-sm">
                    {selectedProblem.description}
                  </p>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-gray-400 text-sm font-medium">Difficulty:</span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm
      transition-all duration-300 hover:scale-105 border
      ${selectedProblem.difficulty === "easy"
                          ? "text-[#00b8a3] bg-[#00b8a3]/10 border-[#00b8a3]/20"
                          : selectedProblem.difficulty === "medium"
                            ? "text-[#ffc01e] bg-[#ffc01e]/10 border-[#ffc01e]/20"
                            : "text-[#ef4743] bg-[#ef4743]/10 border-[#ef4743]/20"
                        }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full
        ${selectedProblem.difficulty === "easy"
                            ? "bg-[#00b8a3]"
                            : selectedProblem.difficulty === "medium"
                              ? "bg-[#ffc01e]"
                              : "bg-[#ef4743]"
                          }`}
                      />
                      {selectedProblem.difficulty?.charAt(0).toUpperCase() +
                        selectedProblem.difficulty?.slice(1)}
                    </span>
                  </div>


                  {selectedProblem.testCases?.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2 text-gray-300">
                        Sample Test Cases
                      </h3>
                      {selectedProblem.testCases.map((tc, i) => (
                        <div
                          key={i}
                          className="bg-gray-900 p-3 mb-2 rounded-lg border border-gray-700"
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
                          className={`p-3 mb-2 rounded-lg border ${res.passed
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
          )}

          {/* Code Tab */}
          {mobileActiveTab === "code" && (
            <div className="h-full flex flex-col p-4">
              <div className="flex justify-between items-center mb-3 shrink-0">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-[#1a1a1a] border border-gray-700 rounded-md px-3 py-2 text-sm"
                >
                  <option value="cpp">C++</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div className="flex-1 min-h-0 mb-3">
                <CodeEditor
                  code={code}
                  setCode={setCode}
                  language={selectedLanguage}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selectedProblem || isSubmitting}
                className={`py-3 rounded-md font-medium transition text-sm shrink-0 ${selectedProblem
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 cursor-not-allowed"
                  }`}
              >
                {isSubmitting ? "Running..." : "Submit Code"}
              </button>
            </div>
          )}

          {/* Chat Tab */}
          {mobileActiveTab === "chat" && (
            <div className="h-full flex flex-col bg-[#0c0c11]">
              <div className="p-3 border-b border-gray-800 shrink-0">
                <h3 className="text-gray-200 font-semibold text-sm">
                  💬 AI Assistant
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 text-sm">
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

              <div className="p-3 flex items-center gap-2 border-t border-gray-800 shrink-0">
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
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-lg transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Drawer for Problems List */}
        {drawerOpen && (
          <>
            <div
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 z-40"
            ></div>
            <div className="fixed top-0 left-0 h-full w-72 bg-[#111] border-r border-gray-800 z-50 transform transition-transform duration-300">
              <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-sm font-semibold text-gray-300">Problems</h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-2 overflow-y-auto h-[calc(100%-56px)]">
                {problems.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => {
                      setSelectedProblem(p);
                      setDrawerOpen(false);
                    }}
                    className={`cursor-pointer p-3 rounded-md mb-2 text-sm ${selectedProblem?._id === p._id
                      ? "bg-blue-700"
                      : "bg-[#1a1a1a] hover:bg-[#222]"
                      }`}
                  >
                    {p?.problemId?.toUpperCase()}. {p.title}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ========== DESKTOP LAYOUT ========== */}
      <div className="hidden md:flex bg-[#0a0a0f] text-white h-[92vh] overflow-hidden relative">
        {/* Toggle Buttons */}
        <button
          onClick={toggleProblemList}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-transparent hover:bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg transition-all duration-300"
          title={isProblemListCollapsed ? "Show Problems" : "Hide Problems"}
        >
          {isProblemListCollapsed ? "›" : "‹"}
        </button>
        <button
          onClick={toggleChat}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-50 hover:bg-blue-600 bg-transparent text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg transition-all duration-300"
          title={isChatCollapsed ? "Show Chat" : "Hide Chat"}
        >
          {isChatCollapsed ? "‹" : "›"}
        </button>
        <button
          onClick={fullFocusScreen}
          className="absolute left-0 top-1 -translate-y-1/2 z-50 hover:bg-blue-600 bg-transparent text-white rounded-sm m-1 p-1 w-6 h-6 flex items-center justify-center shadow-lg transition-all duration-300"
          title={isFullFocus ? "Exit Full Focus" : "Full Focus"}
        >
          {isFullFocus ? <Maximize size={16} /> : <Minimize size={16} />}
        </button>

        <Split
          ref={splitRef}
          className="flex w-full h-full"
          sizes={[20, 25, 35, 20]}
          minSize={[0, 0, 0, 0]}
          gutterSize={6}
          gutterAlign="center"
          snapOffset={0}
          direction="horizontal"
          cursor="col-resize"
        >
          {/* Panel 1: Problems List */}
          <div
            className={`h-full p-4 border-gray-800 overflow-y-auto bg-gradient-to-br from-[#0a0a0f] 
    via-[#0f0a14] to-[#0a0a0f] transition-opacity duration-300 ${isProblemListCollapsed
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
              }`}
          >
            {/* Header with gradient accent */}
            <div className="mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 
      to-orange-500/10 blur-xl rounded-lg" />
              <h2 className="relative text-sm font-bold text-center bg-gradient-to-r from-purple-400 
      via-pink-400 to-orange-400 bg-clip-text text-transparent py-2">
                Problems
              </h2>
              <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            </div>

            {/* Problems List */}
            <div className="space-y-2">
              {problems.map((p) => {
                const isSelected = selectedProblem?._id === p._id;

                // Get difficulty color
                const getDifficultyColor = () => {
                  if (p.difficulty === "easy") return "from-[#00b8a3]/20 to-[#00b8a3]/5";
                  if (p.difficulty === "medium") return "from-[#ffc01e]/20 to-[#ffc01e]/5";
                  if (p.difficulty === "hard") return "from-[#ef4743]/20 to-[#ef4743]/5";
                  return "from-gray-500/20 to-gray-500/5";
                };

                const getDifficultyBorder = () => {
                  if (p.difficulty === "easy") return "border-[#00b8a3]/30";
                  if (p.difficulty === "medium") return "border-[#ffc01e]/30";
                  if (p.difficulty === "hard") return "border-[#ef4743]/30";
                  return "border-gray-500/30";
                };

                const getDifficultyDot = () => {
                  if (p.difficulty === "easy") return "bg-[#00b8a3]";
                  if (p.difficulty === "medium") return "bg-[#ffc01e]";
                  if (p.difficulty === "hard") return "bg-[#ef4743]";
                  return "bg-gray-500";
                };

                return (
                  <div
                    key={p._id}
                    onClick={() => setSelectedProblem(p)}
                    className={`group relative cursor-pointer rounded-xl transition-all duration-300 
            hover:scale-[1.02] ${isSelected ? "scale-[1.02]" : ""
                      }`}
                  >
                    {/* Glow effect on hover */}
                    <div className={`absolute inset-0 rounded-xl blur-md opacity-0 
            group-hover:opacity-100 transition-opacity duration-300
            ${isSelected ? "opacity-100" : ""}
            bg-gradient-to-r ${getDifficultyColor()}`}
                    />

                    {/* Card content */}
                    <div className={`relative backdrop-blur-sm rounded-xl p-3 border transition-all duration-300
            ${isSelected
                        ? `bg-gradient-to-r ${getDifficultyColor()} ${getDifficultyBorder()} shadow-lg`
                        : `bg-[#1a1a1a]/80 border-gray-700/50 hover:border-gray-600/80 
                   hover:bg-gradient-to-r ${getDifficultyColor()}`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Difficulty indicator dot */}
                        <div className={`w-2 h-2 rounded-full ${getDifficultyDot()} 
                ${isSelected ? "animate-pulse" : ""}`}
                        />

                        {/* Problem info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {/* Problem ID badge */}
                            <span className={`px-2 py-0.5 rounded-md text-xs font-bold transition-colors
                    ${isSelected
                                ? "bg-white/20 text-white"
                                : "bg-gray-800/80 text-gray-400 group-hover:text-gray-300"
                              }`}
                            >
                              {p?.problemId?.toUpperCase()}
                            </span>

                            {/* Problem title */}
                            <span className={`text-sm font-medium truncate transition-colors
                    ${isSelected
                                ? "text-white"
                                : "text-gray-300 group-hover:text-white"
                              }`}
                            >
                              {p.title.toString().concat(5,"...")}
                            </span>
                          </div>
                        </div>

                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="shrink-0">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
              transition-transform duration-1000 bg-gradient-to-r from-transparent 
              via-white/5 to-transparent rounded-xl"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          {/* Panel 2: Problem Description */}
          <div className="h-full p-4 border-gray-800 overflow-y-auto">
            {selectedProblem ? (
              <>
                {/* Title with Gradient */}
                <div className="relative mb-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 
          blur-xl rounded-lg" />
                  <h1 className="relative text-lg md:text-xl font-bold bg-gradient-to-r from-purple-400 
          via-pink-400 to-orange-400 bg-clip-text text-transparent p-2">
                    {selectedProblem.title}
                  </h1>
                </div>

                {/* Description Card */}
                <div className="relative mb-2 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 
          rounded-xl blur-md group-hover:blur-lg transition-all duration-300" />
                  <div className="relative backdrop-blur-sm bg-gradient-to-br from-blue-500/5 to-cyan-500/5 
          p-4 rounded-xl border border-blue-400/20">
                    <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                      {selectedProblem.description}
                    </p>
                  </div>
                </div>

                {/* Difficulty Badge */}
                <div className="mb-2 inline-block">
                  <div className={`relative px-4 py-2 rounded-full font-semibold text-sm
          ${selectedProblem.difficulty === 'easy'
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/40 text-green-300'
                      : selectedProblem.difficulty === 'medium'
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/40 text-yellow-300'
                        : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/40 text-red-300'
                    }`}>
                    <span className="relative z-10 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full animate-pulse
              ${selectedProblem.difficulty === 'easy' ? 'bg-green-400'
                          : selectedProblem.difficulty === 'medium' ? 'bg-yellow-400'
                            : 'bg-red-400'}`}
                      />
                      Difficulty: {selectedProblem.difficulty}
                    </span>
                  </div>
                </div>

                {/* Sample Test Cases */}
                {selectedProblem.testCases?.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full" />
                      <h3 className="font-bold text-gray-100 text-base">
                        Sample Test Cases
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {selectedProblem.testCases.map((tc, i) => (
                        <div
                          key={i}
                          className="relative group overflow-hidden"
                        >
                          {/* Gradient Glow */}
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 
                  to-pink-500/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Card Content */}
                          <div className="relative backdrop-blur-sm bg-gradient-to-br from-indigo-900/30 to-purple-900/30 
                  p-4 rounded-xl border border-indigo-400/30 group-hover:border-purple-400/50 
                  transition-all duration-300">
                            <div className="flex items-start gap-2 mb-2">
                              <div className="px-2 py-0.5 bg-indigo-500/20 rounded text-indigo-300 text-xs font-semibold">
                                Case {i + 1}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <p className="text-gray-300 text-sm">
                                <span className="text-indigo-400 font-semibold">Input:</span>{" "}
                                <span className="font-mono bg-black/30 px-2 py-1 rounded">{tc.input}</span>
                              </p>
                              <p className="text-gray-300 text-sm">
                                <span className="text-purple-400 font-semibold">Expected Output:</span>{" "}
                                <span className="font-mono bg-black/30 px-2 py-1 rounded">{tc.expectedOutput}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Test Case Results */}
                {testResults.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 rounded-full" />
                      <h3 className="font-bold text-gray-100 text-base">
                        Test Case Results
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {testResults.map((res, i) => (
                        <div
                          key={i}
                          className="relative group overflow-hidden"
                        >
                          {/* Dynamic Gradient Glow based on pass/fail */}
                          <div className={`absolute inset-0 blur-xl opacity-0 group-hover:opacity-100 
                  transition-opacity duration-500
                  ${res.passed
                              ? 'bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-teal-500/20'
                              : 'bg-gradient-to-r from-red-500/20 via-pink-500/20 to-rose-500/20'
                            }`}
                          />

                          {/* Card with Dynamic Gradient Border */}
                          <div className={`relative backdrop-blur-sm rounded-xl p-1 
                  ${res.passed
                              ? 'bg-gradient-to-br from-emerald-500/30 to-teal-500/30'
                              : 'bg-gradient-to-br from-red-500/30 to-pink-500/30'
                            }`}>

                            <div className="bg-gray-900/90 p-4 rounded-lg">
                              {/* Status Badge */}
                              <div className="flex items-center justify-between mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold
                        ${res.passed
                                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                                    : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                                  }`}>
                                  {res.passed ? "✅ Test Passed" : "❌ Test Failed"}
                                </span>

                                <div className={`px-2 py-1 rounded text-xs font-semibold
                        ${res.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                                  #{i + 1}
                                </div>
                              </div>

                              {/* Test Data */}
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <span className="text-cyan-400 font-semibold text-sm min-w-[80px]">Input:</span>
                                  <span className="text-gray-200 font-mono text-sm bg-black/40 px-2 py-1 
                          rounded flex-1">
                                    {res.input}
                                  </span>
                                </div>

                                <div className="flex items-start gap-2">
                                  <span className="text-blue-400 font-semibold text-sm min-w-[80px]">Expected:</span>
                                  <span className="text-gray-200 font-mono text-sm bg-black/40 px-2 py-1 
                          rounded flex-1">
                                    {res.expected}
                                  </span>
                                </div>

                                <div className="flex items-start gap-2">
                                  <span className="text-purple-400 font-semibold text-sm min-w-[80px]">Output:</span>
                                  <span className={`font-mono text-sm px-2 py-1 rounded flex-1 font-semibold
                          ${res.passed
                                      ? 'text-emerald-300 bg-emerald-500/10'
                                      : 'text-red-300 bg-red-500/10'
                                    }`}>
                                    {res.actual || "No Output"}
                                  </span>
                                </div>

                                {/* Error Message */}
                                {res.error && (
                                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-red-300 text-xs font-mono">
                                      <span className="text-red-400 font-bold">Error:</span> {res.error}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 
          to-pink-500/20 flex items-center justify-center border border-purple-400/30">
                    <span className="text-3xl">📝</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Select a problem to view details
                  </p>
                </div>
              </div>
            )}
          </div>


          {/* Panel 3: Code Editor */}
          <div className="h-full p-4  border-gray-800 flex flex-col bg-[#0a0a0f]">
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
              <CodeEditor
                code={code}
                setCode={setCode}
                language={selectedLanguage}
              />
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
          <div
            className={`h-full flex flex-col bg-gradient-to-br from-[#0c0c11] via-[#110c14] 
    to-[#0c0c11] transition-opacity duration-300 ${isChatCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
          >
            {/* Header with gradient */}
            <div className="relative p-3 md:p-4 border-b border-gray-800/50 shrink-0 overflow-hidden">
              {/* Gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 
      to-purple-500/10 blur-xl" />

              <div className="relative flex items-center gap-3">
                {/* AI Icon with gradient */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 
        flex items-center justify-center border border-cyan-500/30">
                  <span className="text-lg">💬</span>
                </div>

                <h3 className="text-gray-100 font-bold text-base bg-gradient-to-r from-cyan-400 
        via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI Assistant
                </h3>

                {/* Status indicator */}
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-green-400 font-medium">Online</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-3 md:px-4 py-2 md:py-3 text-sm 
    bg-gradient-to-b from-[#0a0a0f] to-[#111] border-b border-gray-800/50 
    scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {messages.length === 0 && !isThinking ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-xs">
                    {/* Empty state icon */}
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 
              to-purple-500/20 rounded-2xl blur-xl animate-pulse" />
                      <div className="relative w-full h-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 
              rounded-2xl border border-cyan-500/20 flex items-center justify-center">
                        <span className="text-6xl">🤖</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-2">
                      Ask for hints, explanations, or guidance
                    </p>
                    <p className="text-gray-500 text-xs">
                      I am here to help you solve this problem!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`group flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`relative max-w-[85%] ${m.role === "user" ? "" : ""}`}>
                        {/* Message bubble */}
                        <div
                          className={`relative rounded-2xl p-3 ${m.role === "user"
                              ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 ml-auto"
                              : "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                            }`}
                        >
                          {/* Glow effect */}
                          <div
                            className={`absolute inset-0 rounded-2xl blur-md opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300 
                    ${m.role === "user"
                                ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20"
                                : "bg-gradient-to-br from-purple-500/10 to-pink-500/10"
                              }`}
                          />

                          {/* Role label */}
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${m.role === "user"
                                  ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white"
                                  : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                                }`}
                            >
                              {m.role === "user" ? "👤" : "🤖"}
                            </span>
                            <span
                              className={`text-xs font-bold
                      ${m.role === "user"
                                  ? "text-cyan-400"
                                  : "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                                }`}
                            >
                              {m.role === "user" ? "You" : "AI Assistant"}
                            </span>
                          </div>

                          {/* Message content */}
                          <p
                            className={`relative text-sm whitespace-pre-wrap leading-relaxed
                    ${m.role === "user" ? "text-gray-200" : "text-gray-300"}`}
                          >
                            {m.content}
                          </p>
                        </div>

                        {/* Timestamp */}
                        <span className="text-[10px] text-gray-500 mt-1 block px-1">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* AI Thinking Loader */}
                  {isThinking && (
                    <div className="group flex justify-start">
                      <div className="relative max-w-[85%]">
                        {/* Loading message bubble */}
                        <div className="relative rounded-2xl p-4 bg-gradient-to-br from-purple-500/10 
                to-pink-500/10 border border-purple-500/20">
                          {/* Glow effect */}
                          <div className="absolute inset-0 rounded-2xl blur-md opacity-100 
                  bg-gradient-to-br from-purple-500/10 to-pink-500/10" />

                          {/* Role label */}
                          <div className="flex items-center gap-2 mb-3 relative z-10">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center 
                    text-xs font-bold bg-gradient-to-br from-purple-500 to-pink-500 
                    text-white animate-pulse">
                              🤖
                            </span>
                            <span className="text-xs font-bold bg-gradient-to-r from-purple-400 
                    to-pink-400 bg-clip-text text-transparent">
                              AI Assistant
                            </span>
                            <span className="text-xs text-purple-400 ml-2 animate-pulse">
                              Thinking...
                            </span>
                          </div>

                          {/* Animated loader */}
                          <div className="flex items-center gap-2 relative z-10">
                            {/* Typing indicator dots */}
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 
                      rounded-full animate-bounce"
                                style={{ animationDelay: "0ms" }} />
                              <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 
                      rounded-full animate-bounce"
                                style={{ animationDelay: "150ms" }} />
                              <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 
                      rounded-full animate-bounce"
                                style={{ animationDelay: "300ms" }} />
                            </div>

                            <span className="text-xs text-gray-400 ml-2">
                              Generating response...
                            </span>
                          </div>

                          {/* Optional: Animated gradient bar */}
                          <div className="mt-3 w-full h-1 bg-gray-800 rounded-full overflow-hidden relative z-10">
                            <div className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 
                    rounded-full animate-pulse"
                              style={{
                                width: "100%",
                                animation: "shimmer 2s infinite"
                              }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="relative p-3 md:p-4 border-t border-gray-800/50 bg-[#0c0c11] shrink-0">
              {/* Gradient accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent 
      via-cyan-500/50 to-transparent" />

              <div className="flex items-center gap-2">
                {/* Input field */}
                <div className="relative flex-1 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 
          rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />

                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !isThinking && handleChat()}
                    placeholder="Ask something..."
                    disabled={isThinking}
                    className="relative w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-2.5 
            text-sm text-gray-200 placeholder-gray-500 
            focus:outline-none focus:border-cyan-500/50 focus:bg-[#1f1f1f] 
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300"
                  />
                </div>

                {/* Send button */}
                <button
                  onClick={handleChat}
                  disabled={!input.trim() || isThinking}
                  className="group relative overflow-hidden rounded-xl px-4 md:px-5 py-2.5 
          font-semibold text-sm transition-all duration-300 
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:scale-105 active:scale-95"
                >
                  {/* Gradient background */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-300
            ${input.trim() && !isThinking
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 opacity-100"
                        : "bg-gray-700 opacity-100"
                      }`}
                  />

                  {/* Glow effect */}
                  {input.trim() && !isThinking && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 
            blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                  )}

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 
          to-transparent -translate-x-full group-hover:translate-x-full 
          transition-transform duration-1000" />

                  {/* Button text */}
                  <span className="relative text-white flex items-center gap-1.5">
                    {isThinking ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Waiting
                      </>
                    ) : (
                      <>
                        Send
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>


        </Split>
      </div>
    </>
  );
}
