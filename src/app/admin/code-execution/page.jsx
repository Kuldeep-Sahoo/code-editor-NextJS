"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import NavigationHeader from "@/components/NavigationHeader";

export default function CodeExecutionsPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    const convexUser = useQuery(api.users.getUser, {
        userId: user?.id || "",
    });

    useEffect(() => {
        if (!isLoaded) return;
        if (!user) {
            router.push("/");
            return;
        }

        if (convexUser && convexUser.role !== "admin") {
            router.push("/");
            return;
        }

        if (convexUser) {
            setIsChecking(false);
        }
    }, [isLoaded, user, convexUser, router]);

    const executions = useQuery(api.codeExecutions.getAllExecutions);

    if (isChecking || executions === undefined) {
        return (
            <div className="">
                <NavigationHeader />
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[90vh] bg-[#0a0a0f] text-gray-200">
            <NavigationHeader />
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">Code Executions</h1>

                {executions.length === 0 ? (
                    <p className="text-gray-400">No executions found.</p>
                ) : (
                    <div className="space-y-4">
                        {executions.map((e) => (
                            <div
                                key={e._id}
                                className="p-4 rounded-lg bg-[#1e1e2e] border border-gray-700"
                            >
                                <h2 className="text-lg font-medium">{e.userId || "Unknown User"}</h2>
                                <p className="text-sm text-gray-400 mt-1">{e.language}</p>
                                <pre className="bg-[#111] mt-3 p-3 rounded text-gray-300 text-sm overflow-x-auto">
                                    {e.code}
                                </pre>
                                {e.output && (
                                    <div className="mt-3 text-sm text-green-400">
                                        Output: {e.output}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
