"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function AdminSubmissionsPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isChecking, setIsChecking] = useState(true);
    const [selected, setSelected] = useState(null);

    // Verify admin from your custom /api/getUser route
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/getUser");
                const data = await res.json();
                setUser(data?.user);

                if (!data?.user || data?.user?.role !== "admin") {
                    router.push("/");
                }
            } catch {
                router.push("/");
            } finally {
                setIsChecking(false);
            }
        })();
    }, [router]);

    // Fetch all submissions (no pagination)
    const submissions = useQuery(api.problemsubmissions.getAllSubmissions);

    if (isChecking || !user) return <p className="text-center mt-10">Checking admin...</p>;

    return (
        <div className="p-6 bg-gray-950 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-4">All Problem Submissions</h1>

            <div className="overflow-x-auto border border-gray-800 rounded-xl">
                <table className="w-full text-sm">
                    <thead className="bg-gray-900 text-gray-300">
                        <tr>
                            <th className="p-3 text-left">User ID</th>
                            <th className="p-3 text-left">Problem</th>
                            <th className="p-3 text-left">Language</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Submitted At</th>
                            <th className="p-3 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions?.map((s) => (
                            <tr key={s._id} className="border-t border-gray-800 hover:bg-gray-900">
                                <td className="p-3">{s.userId}</td>
                                <td className="p-3">{s.problemTitle || s.problemId}</td>
                                <td className="p-3">{s.language}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${s.status === "Accepted" ? "bg-green-700" : "bg-red-700"
                                            }`}
                                    >
                                        {s.status}
                                    </span>
                                </td>
                                <td className="p-3">{new Date(s.submittedAt).toLocaleString()}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => setSelected(s)}
                                        className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500 text-xs"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selected && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
                    <div className="bg-gray-900 rounded-xl p-6 w-[90%] md:w-[600px] max-h-[80vh] overflow-y-auto border border-gray-700">
                        <h2 className="text-lg font-bold mb-3">{selected.problemTitle}</h2>
                        <p className="text-sm mb-2 text-gray-400">Language: {selected.language}</p>
                        <pre className="bg-gray-800 p-3 rounded text-xs overflow-x-auto mb-4">
                            {selected.code}
                        </pre>
                        {selected.error && (
                            <p className="text-red-400 text-sm mb-2">Error: {selected.error}</p>
                        )}
                        <p className="text-green-400 text-sm mb-2">
                            Output: {selected.output || "N/A"}
                        </p>
                        <p className="text-gray-400 text-xs mb-2">
                            Submitted: {new Date(selected.submittedAt).toLocaleString()}
                        </p>
                        <button
                            onClick={() => setSelected(null)}
                            className="mt-3 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
