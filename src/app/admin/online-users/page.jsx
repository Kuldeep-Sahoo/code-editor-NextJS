"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import NavigationHeader from "@/components/NavigationHeader";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminOnlineUsersPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isChecking, setIsChecking] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/getUser");
                const data = await res.json();
                if (!data?.user || data?.user?.role !== "admin") {
                    router.replace("/");
                } else {
                    setUser(data.user);
                }
            } catch {
                router.replace("/");
            } finally {
                setIsChecking(false);
            }
        })();
    }, [router]);

    const activeUsers = useQuery(
        api.onlineUsers.getActiveUsers,
        {},
        { enabled: !!user }
    );

    // Filter and search logic
    const filteredUsers = useMemo(() => {
        if (!activeUsers) return [];

        let filtered = activeUsers;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter((u) =>
                u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (filterStatus !== "all") {
            filtered = filtered.filter((u) => {
                const timeSince = Date.now() - u.lastSeen;
                const isActive = timeSince < 5000;
                return filterStatus === "active" ? isActive : !isActive;
            });
        }

        return filtered;
    }, [activeUsers, searchQuery, filterStatus]);

    // Stats calculations
    const stats = useMemo(() => {
        if (!activeUsers) return { total: 0, active: 0, idle: 0 };

        const active = activeUsers.filter(
            (u) => Date.now() - u.lastSeen < 5000
        ).length;

        return {
            total: activeUsers.length,
            active,
            idle: activeUsers.length - active,
        };
    }, [activeUsers]);

    if (isChecking) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 text-lg">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== "admin") return null;

    return (
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen text-white">
            <NavigationHeader />

            <div className="px-4 md:px-8 lg:px-12 py-6 max-w-[1800px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                        Live User Dashboard
                    </h1>
                    <p className="text-gray-400 text-sm">Real-time monitoring and analytics</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Total Users</p>
                                <p className="text-3xl font-bold text-blue-400">{stats.total.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/5 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Active Now</p>
                                <p className="text-3xl font-bold text-green-400">{stats.active.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <div className="relative flex h-6 w-6">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/5 border border-gray-500/20 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Idle Users</p>
                                <p className="text-3xl font-bold text-gray-400">{stats.idle.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                        <svg className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex gap-2">
                        {["all", "active", "idle"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-5 py-3 rounded-lg font-medium capitalize transition-all ${filterStatus === status
                                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                                        : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700/50"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* User Grid */}
                {filteredUsers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredUsers.map((u) => {
                                const timeSince = Date.now() - u.lastSeen;
                                const isActive = timeSince < 5000;

                                return (
                                    <motion.div
                                        key={u.userId}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        layout
                                        transition={{ duration: 0.2 }}
                                        className={`relative p-5 rounded-xl border backdrop-blur-sm transition-all duration-300 ${isActive
                                                ? "bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-400/50 shadow-lg shadow-green-500/20"
                                                : "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-gray-600/50"
                                            }`}
                                    >
                                        {/* Status indicator */}
                                        <div className="absolute -top-2 -right-2">
                                            <span
                                                className={`relative flex h-4 w-4 ${isActive ? "animate-pulse" : ""
                                                    }`}
                                            >
                                                <span
                                                    className={`absolute inline-flex h-full w-full rounded-full ${isActive ? "bg-green-400" : "bg-gray-500"
                                                        } opacity-75`}
                                                />
                                                <span
                                                    className={`relative inline-flex rounded-full h-4 w-4 ${isActive ? "bg-green-500" : "bg-gray-600"
                                                        }`}
                                                />
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                                                    {u.name?.[0]?.toUpperCase() || "?"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-semibold truncate text-sm">
                                                        {u.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 truncate" title={u.email}>
                                                        {u.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-700/50">
                                                <span className={`px-2.5 py-1 rounded-full font-medium ${isActive
                                                        ? "bg-green-500/20 text-green-300"
                                                        : "bg-gray-600/20 text-gray-400"
                                                    }`}>
                                                    {isActive ? "● Active" : "○ Idle"}
                                                </span>
                                                <span className="text-gray-500">
                                                    {new Date(u.lastSeen).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-500 bg-gray-900/30 rounded-xl border border-gray-800/50 backdrop-blur-sm">
                        <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">Try adjusting your search or filter</p>
                    </div>
                )}
            </div>
        </div>
    );
}
