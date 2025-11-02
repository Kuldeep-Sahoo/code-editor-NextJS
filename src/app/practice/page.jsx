"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import CodeEditor from "./_components/Editor";
import { api } from "../../../convex/_generated/api";
import NavigationHeader from "@/components/NavigationHeader";
import { useUser } from "@clerk/nextjs";
import HeaderProfileBtn from "../(root)/_components/HeaderProfileBtn";
import Confetti from "react-confetti";
import LoadingSkeleton from "./_components/LoadingSkeleton";
import { Menu } from "lucide-react";

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

  // ✅ check for pro status
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
        const output = (data.stdout || "").trim();
        const expected = (test.expectedOutput || "").trim();

        results.push({
          input: test.input,
          expected,
          output,
          passed: output === expected,
          error: data.stderr || data.compile_output || null,
        });
      } catch (err) {
        results.push({
          input: test.input,
          expected: test.expectedOutput,
          output: "Error executing code",
          passed: false,
        });
        console.log(err);
      }
    }

    setTestResults(results);
    setIsSubmitting(false);

    if (results.every((r) => r.passed)) {
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
      <div className="flex flex-col md:flex-row h-[90vh] bg-[#0a0a0f] text-white">
        {/* Left Panel (Visible only on Desktop) */}
        <div className="hidden md:block w-[20%] bg-[#111] border-r border-gray-800 p-2 overflow-y-auto">
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

        {/* Middle Panel */}
        <div className="w-full md:w-[30%] p-4 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-800">
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

        {/* Right Panel */}
        <div className="w-full md:w-[50%] p-4 flex flex-col">
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
      </div>
    </>
  );
}
