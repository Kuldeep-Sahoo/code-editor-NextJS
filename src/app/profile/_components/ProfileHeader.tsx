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
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px] " />
      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 w-full m-4">
        {/* Profile Image */}
        <div className="relative group shrink-0">
          {/* Neon Green-Pink Gradient Glow */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-500 to-pink-500 
      rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-all duration-500"
          />

          {/* Animated Border Ring */}
          <div
            className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-pink-500 
      rounded-full opacity-75 group-hover:opacity-100 blur-sm animate-pulse"
          />

          <Image
            src={user.imageUrl}
            alt="Profile"
            width={96}
            height={96}
            className="rounded-full border-4 border-gray-900/80 relative z-10 
      group-hover:scale-105 transition-transform duration-300 shadow-2xl"
          />

          {/* Pro Badge with Green-Pink Gradient */}
          {userData.isPro && (
            <div
              className="absolute -top-2 -right-2 bg-gradient-to-br from-green-400 via-emerald-500 to-pink-500 
        p-2 rounded-full z-20 shadow-lg shadow-pink-500/50 animate-pulse"
            >
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="text-center sm:text-left">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mb-2">
            {/* Name with Gradient Text */}
            <h1
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-300 
        to-pink-400 bg-clip-text text-transparent break-words"
            >
              {userData.name}
            </h1>

            {/* Pro Member Badge */}
            {userData?.isPro && (
              <>
                <span className="relative px-4 py-1.5 rounded-full text-sm font-semibold overflow-hidden">
                  {/* Gradient Background */}
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 
              to-pink-500/20 backdrop-blur-sm"
                  />
                  {/* Border */}
                  <span className="absolute inset-0 rounded-full border border-green-400/50" />
                  {/* Text */}
                  <span
                    className="relative bg-gradient-to-r from-green-400 to-pink-400 bg-clip-text 
              text-transparent"
                  >
                    Pro Member
                  </span>
                </span>

                <button
                  onClick={updateUserData}
                  className="group relative px-4 py-1.5 rounded-full text-sm font-medium 
            overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  {/* Animated Background */}
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-pink-500/10 
              group-hover:from-green-500/20 group-hover:to-pink-500/20 transition-all duration-300"
                  />
                  {/* Border */}
                  <span
                    className="absolute inset-0 rounded-full border border-green-400/30 
              group-hover:border-pink-400/50 transition-colors duration-300"
                  />
                  {/* Text */}
                  <span
                    className="relative text-green-400 group-hover:text-pink-400 transition-colors 
              duration-300"
                  >
                    Toggle Pro
                  </span>
                </button>
              </>
            )}

            {/* Upgrade to Pro Button */}
            {user && !userData?.isPro && (
              <Link
                href="/pricing"
                className="group relative flex items-center gap-2 px-4 py-2 rounded-xl 
          overflow-hidden transition-all duration-300 hover:scale-105"
              >
                {/* Animated Gradient Background */}
                <span
                  className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 
            to-pink-500 opacity-90 group-hover:opacity-100 transition-opacity"
                />

                {/* Glow Effect */}
                <span
                  className="absolute inset-0 bg-gradient-to-r from-green-400 to-pink-400 
            blur-lg opacity-50 group-hover:opacity-75 transition-opacity"
                />

                {/* Shine Effect */}
                <span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 
            to-transparent -translate-x-full group-hover:translate-x-full transition-transform 
            duration-1000"
                />

                {/* Content */}
                <Sparkles
                  className="w-4 h-4 text-white relative z-10 group-hover:rotate-12 
            transition-transform"
                />
                <span className="text-white font-semibold relative z-10">
                  Upgrade to Pro
                </span>
              </Link>
            )}
          </div>

          {/* Email with Modern Styling */}
          <p className="flex justify-center sm:justify-start items-center gap-2 text-sm sm:text-base">
            <span
              className="p-1.5 rounded-lg bg-gradient-to-r from-green-500/10 to-pink-500/10 
        border border-green-400/20"
            >
              <UserIcon className="w-4 h-4 text-green-400" />
            </span>
            <span className="text-gray-300">{userData.email}</span>
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
