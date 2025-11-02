import { useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import {
  Activity,
  Code2,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  Trophy,
  UserIcon,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Id } from "../../../../convex/_generated/dataModel";
import { ConvexHttpClient } from "convex/browser";
import { UserResource } from "@clerk/types";
import Image from "next/image";
import Heatmap from "./Heatmap";
import Link from "next/link";

interface ProfileHeaderProps {
  userStats: {
    totalExecutions: number;
    languagesCount: number;
    languages: string[];
    last24Hours: number;
    favoriteLanguage: string;
    languageStats: Record<string, number>;
    mostStarredLanguage: string;
  };
  userData: {
    _id: Id<"users">;
    _creationTime: number;
    proSince?: number | undefined;
    lemonSqueezyCustomerId?: string | undefined;
    lemonSqueezyOrderId?: string | undefined;
    name: string;
    userId: string;
    email: string;
    isPro: boolean;
  };
  user: UserResource;
  submissions: any[];
}

function ProfileHeader({
  userStats,
  userData,
  user,
  submissions,
}: ProfileHeaderProps) {
const [submissionsHistory, setSubmissionsHistory] = useState<
  { date: string; success: number; error: number }[]
>([]);

useEffect(() => {
  if (!submissions || submissions.length === 0) return;

  const history = submissions.reduce(
    (
      acc: { date: string; success: number; error: number }[],
      s: {
        submittedAt: number;
        status?: string;
      }
    ) => {
      const dateObj = new Date(s.submittedAt);
      const date = `${dateObj.getFullYear()}-${String(
        dateObj.getMonth() + 1
      ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;

      const existing = acc.find((x) => x.date === date);
      const isSuccess =
        s.status?.toLowerCase() === "accepted" ||
        s.status?.toLowerCase() === "success";

      if (existing) {
        if (isSuccess) existing.success += 1;
        else existing.error += 1;
      } else {
        acc.push({
          date,
          success: isSuccess ? 1 : 0,
          error: isSuccess ? 0 : 1,
        });
      }

      return acc;
    },
    []
  );

  setSubmissionsHistory(history);
}, [submissions]);

  const starredSnippets = useQuery(api.snippets.getStarredSnippets);
  const STATS = [
    {
      label: "Code Executions",
      value: userStats?.totalExecutions ?? 0,
      icon: Activity,
      color: "from-blue-500 to-cyan-500",
      gradient: "group-hover:via-blue-400",
      description: "Total code runs",
      metric: {
        label: "Last 24h",
        value: userStats?.last24Hours ?? 0,
        icon: Timer,
      },
    },
    {
      label: "Starred Snippets",
      value: starredSnippets?.length ?? 0,
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      gradient: "group-hover:via-yellow-400",
      description: "Saved for later",
      metric: {
        label: "Most starred",
        value: userStats?.mostStarredLanguage ?? "N/A",
        icon: Trophy,
      },
    },
    {
      label: "Languages Used",
      value: userStats?.languagesCount ?? 0,
      icon: Code2,
      color: "from-purple-500 to-pink-500",
      gradient: "group-hover:via-purple-400",
      description: "Different languages",
      metric: {
        label: "Most used",
        value: userStats?.favoriteLanguage ?? "N/A",
        icon: TrendingUp,
      },
    },
  ];

  const executionHistory =
    useQuery(api.codeExecutions.getExecutionHistory, {
      userId: userData?.userId,
    }) ?? [];

  const updateUserData = async () => {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const answer = confirm("Toggling Pro Status cannot be undone!");
    if (answer) {
      await convex.mutation(api.users.updateUserProStatus, {
        userId: userData.userId,
        isPro: false,
        proSince: 0,
      });
    }
  };

  return (
    <div
      className="relative m-2 bg-gradient-to-br from-[#12121a] to-[#1a1a2e] rounded-2xl p-2 border
     border-gray-800/50 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 w-full mb-2">
        {/* Profile Image */}
        <div className="relative group shrink-0">
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 
      rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity"
          />
          <Image
            src={user.imageUrl}
            alt="Profile"
            width={96}
            height={96}
            className="rounded-full border-4 border-gray-800/60 relative z-10 
      group-hover:scale-105 transition-transform duration-300"
          />
          {userData.isPro && (
            <div
              className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-purple-600 
        p-2 rounded-full z-20 shadow-md animate-pulse"
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="text-center sm:text-left">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">
              {userData.name}
            </h1>

            {userData?.isPro && (
              <>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium">
                  Pro Member
                </span>
                <button
                  onClick={updateUserData}
                  className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full 
            text-sm font-medium hover:bg-purple-500/20 transition-colors"
                >
                  Toggle Pro
                </button>
              </>
            )}

            {user && !userData?.isPro && (
              <Link
                href="/pricing"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 
          hover:border-amber-500/50 bg-gradient-to-r from-amber-500/10 to-orange-500/10 
          hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300 text-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-medium">Pro</span>
              </Link>
            )}
          </div>

          <p className="text-gray-400 flex justify-center sm:justify-start items-center gap-2 text-sm sm:text-base">
            <UserIcon className="w-4 h-4" />
            {userData.email}
          </p>
        </div>
      </div>

      {/* Heatmap */}
      <h2 className="text-lg font-semibold text-white mb-4 mt-6">
        Execution History
      </h2>
      <Heatmap data={executionHistory} />
      <h2 className="text-lg font-semibold text-white mb-4 mt-6">
        Submissions History
      </h2>
      <Heatmap data={submissionsHistory} />
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {STATS.map((stat, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={index}
            className="group relative bg-gradient-to-br from-black/40 to-black/20 rounded-2xl overflow-hidden"
          >
            {/* Glow effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-all 
              duration-500 ${stat.gradient}`}
            />

            {/* Content */}
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-400">
                      {stat.description}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {typeof stat.value === "number"
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Additional metric */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-800/50">
                <stat.metric.icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-400">
                  {stat.metric.label}:
                </span>
                <span className="text-sm font-medium text-white">
                  {stat.metric.value}
                </span>
              </div>
            </div>

            {/* Interactive hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
export default ProfileHeader;
