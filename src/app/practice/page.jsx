"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import CodeEditor from "./_components/Editor";
import { api } from "../../../convex/_generated/api";
import NavigationHeader from "@/components/NavigationHeader";
import { useUser } from "@clerk/nextjs";
import HeaderProfileBtn from "../(root)/_components/HeaderProfileBtn";
import Confetti from "react-confetti";
import LoadingSkeleton from "../snippets/[id]/_components/LoadingSkeleton";
import { Menu } from "lucide-react";
import toast from "react-hot-toast";

import { GoogleGenerativeAI } from "@google/generative-ai";

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
  const [drawerOpen, setDrawerOpen] = useState(false); // ✅ added for mobile drawer
  const createSubmission = useMutation(api.problemsubmissions.createSubmission);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const handleChat = async () => {
    if (!input.trim() || !selectedProblem) return;

    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Combine problem context + user conversation
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

        Problem Title: ${selectedProblem.title}
        Description: ${selectedProblem.description}
        User written code: ${code || "N/A"}
        User Question: ${input}
        `;

      console.log({ context });

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
  }
  // ✅ check for pro status
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/getUser");
        const data = await res.json();
        setUser(data.user);
      } catch {
      }
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
            "You've reached the daily submission limit for your plan. Please try again later."
          );
          break;
        }

        const output = (data.stdout || "").trim();
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

    // ✅ Store submission in Convex
    try {
      await createSubmission({
        userId: user._id,
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
      <div className="h-full bg-[#0a0a0f] flex items-center justify-center text-gray-400">
        <NavigationHeader />
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center text-gray-300">
        <NavigationHeader />
        <div className="mt-24 flex flex-col items-center gap-6 justify-center">
          <h1 className="text-3xl font-bold mb-4">
            You need to be logged in to access all code snippets.
          </h1>
          <HeaderProfileBtn />
        </div>
      </div>
    );
  }

  if (isLoadingProStatus) {
    return (
      <div className="h-full bg-[#0a0a0f] flex items-center justify-center text-gray-400">
        <NavigationHeader />
        Loading...
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

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0f] text-white overflow-hidden md:overflow-auto">
        {/* Left Panel (Visible only on Desktop) */}
        <div className="hidden md:block w-[15%] bg-[#111] border-r border-gray-800 p-2 overflow-y-auto">
          <h2 className="text-sm font-semibold mb-3 text-gray-300 text-center">
            Problems
          </h2>
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

        {/* Problem Description */}
        <div className="w-full md:w-[20%] p-4  border-b  md:border-b-0 md:border-r border-gray-800 flex-1 overflow-y-auto
">
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
                          {res.output || "No Output"}
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

        {/* Code Area */}
        <div className="w-full md:w-[40%] p-4 border-r md:border-b-0 md:border-r flex flex-col border-gray-800  h-[92vh]">
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

        {/* AI Chat Area */}
        <div className="w-full md:w-[25%] flex flex-col border-t md:border-t-0 md:border-l border-gray-800 bg-[#0c0c11] md:h-[90vh] h-[calc(100vh-64px)] max-h-[calc(100vh-64px)]">
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





      </div>
    </>
  );
}
