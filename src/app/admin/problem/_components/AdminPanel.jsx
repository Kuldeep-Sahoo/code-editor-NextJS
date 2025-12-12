"use client";
import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import NavigationHeader from "@/components/NavigationHeader";
import { api } from "../../../../../convex/_generated/api";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const AdminPanel = () => {
    const addProblem = useMutation(api.problems.addProblem);
    const updateProblem = useMutation(api.problems.updateProblem);
    const problems = useQuery(api.problems.getAllProblems);
    const deleteProblemById = useMutation(api.problems.deleteProblemById);

    const emptyProblem = {
        problemId: "",
        title: "",
        description: "",
        difficulty: "easy",
        constraints: "",
        languageSupport: ["cpp", "python", "javascript", "java"],
        testCases: [{ input: "", expectedOutput: "" }],
        baseCode: { cpp: "", python: "", javascript: "", java: "" },
    };

    const [problemData, setProblemData] = useState(emptyProblem);
    const [editingId, setEditingId] = useState(null);

    // ------------------------------------
    // BULK JSON IMPORT STATES
    // ------------------------------------
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkJson, setBulkJson] = useState("");
    const [isBulkLoading, setIsBulkLoading] = useState(false);

    const handleBulkImport = async () => {
        try {
            setIsBulkLoading(true);

            const parsed = JSON.parse(bulkJson);
            if (!Array.isArray(parsed)) {
                toast.error("JSON must be an array of problems");
                return;
            }

            for (const p of parsed) {
                await addProblem({
                    problemId: p.problemId || "",
                    title: p.title || "",
                    description: p.description || "",
                    difficulty: p.difficulty || "easy",
                    constraints: p.constraints || "",
                    languageSupport: p.languageSupport || ["cpp", "python", "javascript", "java"],
                    testCases: p.testCases?.length ? p.testCases : [{ input: "", expectedOutput: "" }],
                    baseCode: p.baseCode || { cpp: "", python: "", javascript: "", java: "" },
                    createdAt: Date.now(),
                });
            }

            toast.success("All problems imported successfully!");
            setShowBulkModal(false);
            setBulkJson("");

        } catch (err) {
            console.log(err);
            toast.error("Invalid JSON format");
        } finally {
            setIsBulkLoading(false);
        }
    };

    // ------------------------------------
    // NORMAL HANDLERS
    // ------------------------------------

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProblemData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTestCaseChange = (index, field, value) => {
        const updated = [...problemData.testCases];
        updated[index][field] = value;
        setProblemData((prev) => ({ ...prev, testCases: updated }));
    };

    const handleBaseCodeChange = (lang, value) => {
        setProblemData((prev) => ({
            ...prev,
            baseCode: { ...prev.baseCode, [lang]: value },
        }));
    };

    const handleSubmit = async () => {
        if (!problemData.title || !problemData.description) {
            toast.error("⚠️ Please fill in the title and description.");
            return;
        }

        if (editingId) {
            await updateProblem({
                id: editingId,
                data: {
                    title: problemData.title,
                    description: problemData.description,
                    difficulty: problemData.difficulty,
                    problemId: problemData.problemId,
                    languageSupport: problemData.languageSupport,
                    testCases: problemData.testCases,
                    constraints: problemData.constraints,
                    baseCode: problemData.baseCode,
                },
            });
            toast.success("Snippet updated successfully");
        } else {
            await addProblem({ ...problemData, createdAt: Date.now() });
            toast.success("Snippet added successfully");
        }

        setProblemData(emptyProblem);
        setEditingId(null);
    };

    const handleEdit = (p) => {
        setEditingId(p._id);
        setProblemData({
            problemId: p.problemId || "",
            title: p.title || "",
            description: p.description || "",
            difficulty: p.difficulty || "easy",
            constraints: p.constraints || "",
            languageSupport: p.languageSupport || ["cpp", "python", "javascript", "java"],
            testCases: p.testCases?.length
                ? p.testCases
                : [{ input: "", expectedOutput: "" }],
            baseCode: p.baseCode || {
                cpp: "",
                python: "",
                javascript: "",
                java: "",
            },
        });
    };

    const deleteProblem = async (id) => {
        try {
            await deleteProblemById({ id });
            toast.success("Problem deleted Successfully");
        } catch (e) {
            console.log(e);
            toast.error("Some error occurred");
        }
    };

    return (
        <>
            <NavigationHeader />
            <div className="min-h-[90vh] bg-[#0a0a0f] text-white flex flex-col md:flex-row">

                {/* LEFT: Problem Form */}
                <div className="w-full md:w-[60%] p-4 md:p-6 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-700">

                    {/* BULK JSON IMPORT BUTTON */}
                    <button
                        onClick={() => setShowBulkModal(true)}
                        className="mb-4 w-full bg-green-600 hover:bg-green-700 py-2 rounded-md font-semibold"
                    >
                        📥 Bulk Add Problems (JSON)
                    </button>

                    <h3 className="text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
                        {editingId ? "✏️ Edit Problem" : "➕ Add New Problem"}
                    </h3>

                    <div className="space-y-3">
                        {/* Problem ID + Title */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                name="problemId"
                                placeholder="Problem ID (optional)"
                                value={problemData.problemId}
                                onChange={handleChange}
                                className="w-full sm:w-1/3 p-2 bg-gray-900 border border-gray-700 rounded-md"
                            />
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={problemData.title}
                                onChange={handleChange}
                                className="w-full sm:w-2/3 p-2 bg-gray-900 border border-gray-700 rounded-md"
                            />
                        </div>

                        {/* Description */}
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={problemData.description}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md h-24"
                        />

                        {/* Difficulty + Constraints */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                name="difficulty"
                                value={problemData.difficulty}
                                onChange={handleChange}
                                className="w-full sm:w-1/3 h-12 p-2 bg-gray-900 border border-gray-700 rounded-md"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                            <textarea
                                name="constraints"
                                placeholder="Constraints"
                                value={problemData.constraints}
                                onChange={handleChange}
                                className="w-full sm:w-2/3 h-12 p-2 bg-gray-900 border border-gray-700 rounded-md"
                            />
                        </div>

                        {/* TEST CASES */}
                        <h3 className="text-lg mt-2 font-semibold">🧪 Test Cases</h3>
                        {problemData.testCases.map((tc, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-2 mb-1">
                                <input
                                    type="text"
                                    placeholder="Input"
                                    value={tc.input}
                                    onChange={(e) =>
                                        handleTestCaseChange(index, "input", e.target.value)
                                    }
                                    className="w-full sm:w-1/2 p-2 bg-gray-900 border border-gray-700 rounded-md"
                                />
                                <input
                                    type="text"
                                    placeholder="Expected Output"
                                    value={tc.expectedOutput}
                                    onChange={(e) =>
                                        handleTestCaseChange(index, "expectedOutput", e.target.value)
                                    }
                                    className="w-full sm:w-1/2 p-2 bg-gray-900 border border-gray-700 rounded-md"
                                />
                            </div>
                        ))}
                        <button
                            onClick={() =>
                                setProblemData((prev) => ({
                                    ...prev,
                                    testCases: [
                                        ...prev.testCases,
                                        { input: "", expectedOutput: "" },
                                    ],
                                }))
                            }
                            className="mt-1 text-blue-400 hover:underline text-sm"
                        >
                            + Add Test Case
                        </button>

                        {/* BASE CODE */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            {["cpp", "python", "javascript", "java"].map((lang) => (
                                <div key={lang}>
                                    <label className="block text-sm font-medium text-gray-400 capitalize mb-1">
                                        {lang}
                                    </label>
                                    <textarea
                                        value={problemData.baseCode[lang]}
                                        onChange={(e) => handleBaseCodeChange(lang, e.target.value)}
                                        placeholder={`Base code for ${lang}`}
                                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md h-24"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* BUTTONS */}
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                            <button
                                onClick={handleSubmit}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-semibold"
                            >
                                {editingId ? "Update Problem" : "Submit Problem"}
                            </button>
                            {editingId && (
                                <button
                                    onClick={() => {
                                        setProblemData(emptyProblem);
                                        setEditingId(null);
                                    }}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-md font-semibold"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Problem List */}
                <div className="w-full md:w-[40%] p-4 md:p-6 overflow-y-auto">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center md:text-left">
                        📘 Problem List
                    </h2>
                    <div className="space-y-3">
                        {problems?.length ? (
                            problems.map((p) => (
                                <div
                                    key={p._id}
                                    onClick={() => handleEdit(p)}
                                    className={`p-3 rounded-md transition cursor-pointer ${editingId === p._id
                                        ? "bg-blue-700"
                                        : "bg-gray-800 hover:bg-gray-700"
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold text-base md:text-lg">
                                                {p.problemId?.toString().toUpperCase()}. {p.title}
                                            </h3>
                                            <p className="text-sm text-gray-400 capitalize">
                                                {p.difficulty || "N/A"}
                                            </p>
                                        </div>
                                        <div
                                            className="text-yellow-400 hover:text-red-800"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteProblem(p._id);
                                            }}
                                        >
                                            <Trash2 />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center md:text-left">
                                No problems yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ------------------- BULK IMPORT MODAL ---------------------- */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 w-full max-w-2xl p-6 rounded-lg border border-gray-700">
                        <h2 className="text-xl font-semibold mb-4">📥 Bulk JSON Problem Import</h2>

                        <textarea
                            value={bulkJson}
                            onChange={(e) => setBulkJson(e.target.value)}
                            placeholder={`Paste JSON array here...\n\n[\n  {\n    "problemId": "p1",\n    "title": "Two Sum",\n    "description": "Find two numbers...",\n    "difficulty": "easy"\n  }\n]`}
                            className="w-full h-64 p-3 bg-black border border-gray-700 rounded-md text-sm"
                        />

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setShowBulkModal(false)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={isBulkLoading}
                                onClick={handleBulkImport}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-semibold disabled:opacity-40"
                            >
                                {isBulkLoading ? "Importing..." : "Import JSON"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminPanel;
