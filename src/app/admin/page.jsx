"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Code2, Users, Sparkles, ProjectorIcon, User } from "lucide-react";
import { useRouter } from "next/navigation";
import NavigationHeader from "@/components/NavigationHeader";
import Loader from "@/components/CubeLoader";

const cards = [
    {
        title: "Manage Problems",
        desc: "View, edit, and add coding problems.",
        icon: <Code2 className="w-8 h-8 text-blue-400" />,
        href: "/admin/problem",
        color:
            "from-blue-500/20 to-blue-800/30 hover:from-blue-500/40 hover:to-blue-800/50",
    },
    {
        title: "Manage Users",
        desc: "Monitor and manage user accounts.",
        icon: <Users className="w-8 h-8 text-green-400" />,
        href: "/admin/users",
        color:
            "from-green-500/20 to-green-800/30 hover:from-green-500/40 hover:to-green-800/50",
    },
    {
        title: "Code Execution Data",
        desc: "Manage the code execution Data",
        icon: <Sparkles className="w-8 h-8 text-purple-400" />,
        href: "/admin/code-execution",
        color:
            "from-blue-500/20 to-purple-800/30 hover:from-purple-500/40 hover:to-purple-800/50",
    },
    {
        title: "Problem Submissions Data",
        desc: "Manage the problem submissions Data",
        icon: <ProjectorIcon className="w-8 h-8 text-purple-400" />,
        href: "/admin/submissions",
        color:
            "from-blue-500/20 to-purple-800/30 hover:from-purple-500/40 hover:to-purple-800/50",
    },
    {
        title: "Active Online Users",
        desc: "See all active users now present in your website",
        icon: <Users className="w-8 h-8 text-purple-400" />,
        href: "/admin/online-users",
        color:
            "from-blue-500/20 to-purple-800/30 hover:from-purple-500/40 hover:to-purple-800/50",
    },
    {
        title: "Upcoming Features",
        desc: "Preview upcoming tools and updates.",
        icon: <Sparkles className="w-8 h-8 text-purple-400" />,
        href: "/admin/upcoming",
        color:
            "from-purple-500/20 to-purple-800/30 hover:from-purple-500/40 hover:to-purple-800/50",
    },
];

const AdminPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [, setUser] = useState(null);

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
                setLoading(false);
            }
        })();
    }, [router]);

    if (loading) {
        return (
            <div className="  text-gray-400">
                <NavigationHeader />
                <Loader/>
            </div>
        );
    }

    return (
        <div className="  text-white flex flex-col items-center">
            <NavigationHeader />
            <h1 className="mt-4 text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Admin Dashboard
            </h1>
            <p className="text-gray-400 mb-10 text-center max-w-md">
                Manage problems, users, and future features — all from one place.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {cards.map((card, i) => (
                    <Link
                        key={i}
                        href={card.href}
                        className={`group relative rounded-2xl p-6 flex flex-col items-start justify-between bg-gradient-to-br ${card.color} border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.02]`}
                    >
                        <div className="mb-4">{card.icon}</div>
                        <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                        <p className="text-gray-400 text-sm">{card.desc}</p>
                        <div className="absolute bottom-4 right-4 text-sm text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            View →
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminPage;
