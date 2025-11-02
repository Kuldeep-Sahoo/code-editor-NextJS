"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import CodeEditor from "./_components/Editor";
import { api } from "../../../convex/_generated/api";
import NavigationHeader from "@/components/NavigationHeader";
import { useUser } from "@clerk/nextjs";
import ThreeSnippetsPreview from "../snippets/_components/ThreeSnippetsPreview";
import HeaderProfileBtn from "../(root)/_components/HeaderProfileBtn";

export default function PracticePage() {
      const { isSignedIn,  isLoaded } = useUser();
  
  const problems = useQuery(api.problems.getAllProblems) || [];
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (selectedProblem && selectedProblem.baseCode) {
      const base = selectedProblem.baseCode[selectedLanguage];
      setCode(base || "");
    }
  }, [selectedProblem, selectedLanguage]);

  const handleSubmit = async () => {
    if (!selectedProblem) return;

    const test = selectedProblem.testCases[0];
    const stdin = test.input;

    const languageMap = {
      cpp: 54,
      python: 71,
      javascript: 63,
      java: 62,
    };

    try {
      const res = await fetch("/api/judge0", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: code,
          language_id: languageMap[selectedLanguage],
          stdin,
        }),
      });

      const result = await res.json();

      if (result.stdout) {
        const output = result.stdout.trim();
        const expected = test.expectedOutput.trim();
        alert(
          output === expected
            ? "✅ Test Passed"
            : `❌ Test Failed\nExpected: ${expected}\nGot: ${output}`
        );
      } else {
        alert("❌ Error: " + (result.stderr || result.compile_output || "Unknown"));
      }
    } catch (err) {
      alert("Server Error");
      console.error(err);
    }
  };
  if(!isLoaded) {
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
            {" "}
            You need to be logged in to access all code snippets.
          </h1>
          <HeaderProfileBtn />
        </div>
      </div>
    );
  }

  return (
    <>
      <NavigationHeader />
      <div className="flex flex-col md:flex-row h-[90vh] bg-[#0a0a0f] text-white">
        {/* Left Panel - Problem List */}
        <div className="w-full md:w-[10%] bg-[#111] border-b md:border-b-0 md:border-r border-gray-800 p-2 overflow-y-auto">
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
              {p.title}
            </div>
          ))}
        </div>

        {/* Middle Panel - Problem Description */}
        <div className="w-full md:w-[40%] p-4 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-800">
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
              {selectedProblem.constraints && (
                <p className="text-gray-400 mb-2 text-sm">
                  <strong>Constraints:</strong> {selectedProblem.constraints}
                </p>
              )}
              {selectedProblem.testCases &&
                selectedProblem.testCases.length > 0 && (
                  <div className="mt-2">
                    <h3 className="font-semibold mb-3 text-gray-300">
                      Test Cases
                    </h3>
                    {selectedProblem.testCases.map((tc, index) => (
                      <div
                        key={index}
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
            </>
          ) : (
            <p className="text-gray-500 text-sm">
              Select a problem to view details.
            </p>
          )}
        </div>

        {/* Right Panel - Code Editor */}
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
            disabled={!selectedProblem}
            className={`mt-4 py-2 rounded-md font-medium transition text-sm md:text-base ${selectedProblem
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-700 cursor-not-allowed"
              }`}
          >
            Submit Code
          </button>
        </div>
      </div>
    </>
  );
}
