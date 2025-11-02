"use client";
import NavigationHeader from "@/components/NavigationHeader";
import { useUser } from "@clerk/nextjs";
import { usePaginatedQuery, useQuery } from "convex/react";
import {
  ChevronRight,
  Clock,
  Code,
  Code2,
  Eye,
  ListVideo,
  Loader2,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../../convex/_generated/api";
import ProfileHeaderSkeleton from "./_components/ProfileHeaderSkeleton";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import StarButton from "@/components/StarButton";
import CodeBlock from "./_components/CodeBlock";
import ProfileHeader from "./_components/ProfileHeader";
import Editor from "@monaco-editor/react";


const TABS = [
  {
    id: "ProblemSubmissions",
    label: "Problem Submissions",
    icon: Code2,
  },
  {
    id: "executions",
    label: "Code Executions",
    icon: ListVideo,
  },
  {
    id: "starred",
    label: "Starred Snippets",
    icon: Star,
  },
];

const Page = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "executions" | "starred" | "ProblemSubmissions"
  >("ProblemSubmissions");
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);



  const userStats = useQuery(api.codeExecutions.getUserStats, {
    userId: user?.id ?? "",
  });
  const starredSnippets = useQuery(api.snippets.getStarredSnippets);

  const {
    results: executions,
    status: executionStatus,
    isLoading: isLoadingExecutions,
    loadMore,
  } = usePaginatedQuery(
    api.codeExecutions.getUserExecutions,
    {
      userId: user?.id ?? "",
    },
    { initialNumItems: 5 }
  );

  const [convexUser, setConvexUser] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/getUser");
        const data = await res.json();
        setConvexUser(data.user);
      } catch {}
    })();
  }, []);

  const rawSubmissions = useQuery(
    api.problemsubmissions.getSubmissionsByUserId,
    {
      userId: (convexUser as any)?._id ?? "",
    }
  );

  // Always returns [] if Convex hasn’t loaded yet
  const submissions = React.useMemo(
    () => rawSubmissions ?? [],
    [rawSubmissions]
  );
    const memoizedSubs = useMemo(() => submissions ?? [], [submissions]);



  const userData = useQuery(api.users.getUser, { userId: user?.id ?? "" });
  // console.log({userData});

  const handleLoadMore = () => {
    if (executionStatus === "CanLoadMore") loadMore(5);
  };

  if (!user && isLoaded) return router.push("/");

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {userStats && userData && (
          <ProfileHeader
            userStats={userStats}
            userData={userData}
            user={user!}
            submissions={submissions}
          />
        )}

        {(userStats === undefined || !isLoaded) && <ProfileHeaderSkeleton />}
        <div
          className="bg-gradient-to-br from-[#12121a] to-[#1a1a2e] rounded-3xl shadow-2xl 
        shadow-black/50 border border-gray-800/50 backdrop-blur-xl overflow-hidden"
        >
          {/* Tabs */}
          <div className="border-b border-gray-800/50">
            <div className="flex space-x-1 p-4">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "executions" | "starred")
                  }
                  className={`group flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-200 relative overflow-hidden ${
                    activeTab === tab.id
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-500/10 rounded-lg"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <tab.icon className="w-4 h-4 relative z-10" />
                  <span className="text-sm font-medium relative z-10">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              {activeTab === "ProblemSubmissions" && (
                <div className="space-y-6">
                  {!submissions ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 text-gray-600 mx-auto mb-4 animate-spin" />
                      <h3 className="text-lg font-medium text-gray-400 mb-2">
                        Loading submissions...
                      </h3>
                    </div>
                  ) : memoizedSubs.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border border-gray-800/40 rounded-lg overflow-hidden">
                        <thead className="bg-black/40 text-gray-400 text-sm uppercase">
                          <tr>
                            <th className="px-4 py-3">Problem ID</th>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Language</th>
                            <th className="px-4 py-3 text-center">Passed</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Submitted</th>
                            <th className="px-4 py-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                          {memoizedSubs.map((s: any) => (
                            <tr
                              key={s._id}
                              className="hover:bg-black/30 transition"
                            >
                              {/* Problem ID */}
                              <td
                                className="px-4 py-3 text-gray-300 max-w-[120px] truncate"
                                title={s.problemId?.toString()}
                              >
                                {s.problemId
                                  ? `${s.problemId.toString().slice(0, 8)}`
                                  : "—"}
                              </td>

                              {/* Problem Title */}
                              <td
                                className="px-4 py-3 text-gray-300 max-w-[200px] truncate"
                                title={s.problemTitle || "Untitled"}
                              >
                                {s.problemTitle
                                  ? `${s.problemTitle.slice(0, 20)}...`
                                  : "Untitled"}
                              </td>

                              <td className="px-4 py-3 text-gray-400">
                                {s.language}
                              </td>
                              <td className="px-4 py-3 text-center text-gray-300">
                                {s.passedCount}/{s.totalCount}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    s.status === "Accepted"
                                      ? "bg-green-500/10 text-green-400"
                                      : "bg-red-500/10 text-red-400"
                                  }`}
                                >
                                  {s.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center text-gray-500 text-sm">
                                {new Date(s.submittedAt).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => {
                                    setSelectedCode(s.code);
                                    setSelectedTitle(
                                      s.problemTitle || "Untitled"
                                    );
                                    setIsDialogOpen(true);
                                  }}
                                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
                                >
                                  <Eye className="w-4 h-4" /> View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Code className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-400 mb-2">
                        No submissions yet
                      </h3>
                      <p className="text-gray-500">
                        Solve problems to see your submission history!
                      </p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "executions" && (
                <div className="space-y-6">
                  {executions?.map((execution) => (
                    <div
                      key={execution._id}
                      className="group rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-md hover:shadow-blue-500/50"
                    >
                      <div className="flex items-center justify-between p-4 bg-black/30 border border-gray-800/50 rounded-t-xl">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
                            <Image
                              src={"/" + execution.language + ".png"}
                              alt=""
                              className="rounded-lg relative z-10 object-cover"
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white">
                                {execution.language.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-400">
                                {new Date(
                                  execution._creationTime
                                ).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  execution.error
                                    ? "bg-red-500/10 text-red-400"
                                    : "bg-green-500/10 text-green-400"
                                }`}
                              >
                                {execution.error ? "Error" : "Success"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-black/20 rounded-b-xl border border-t-0 border-gray-800/50">
                        <CodeBlock
                          code={execution.code}
                          language={execution.language}
                        />

                        {(execution.output || execution.error) && (
                          <div className="mt-4 p-4 rounded-lg bg-black/40">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">
                              Output
                            </h4>
                            <pre
                              className={`text-sm ${
                                execution.error
                                  ? "text-red-400"
                                  : "text-green-400"
                              }`}
                            >
                              {execution.error || execution.output}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoadingExecutions ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 text-gray-600 mx-auto mb-4 animate-spin" />
                      <h3 className="text-lg font-medium text-gray-400 mb-2">
                        Loading code executions...
                      </h3>
                    </div>
                  ) : (
                    executions.length === 0 && (
                      <div className="text-center py-12">
                        <Code className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-400 mb-2">
                          No code executions yet
                        </h3>
                        <p className="text-gray-500">
                          Start coding to see your execution history!
                        </p>
                      </div>
                    )
                  )}

                  {/* Load More Button */}
                  {executionStatus === "CanLoadMore" && (
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={handleLoadMore}
                        className="px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg flex items-center gap-2 
                        transition-colors"
                      >
                        Load More
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ACTIVE TAB IS STARS: */}
              {activeTab === "starred" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {starredSnippets?.map((snippet) => (
                    <div key={snippet._id} className="group relative">
                      <Link href={`/snippets/${snippet._id}`}>
                        <div
                          className="bg-black/20 rounded-xl border border-gray-800/50 hover:border-gray-700/50 
                          transition-all duration-300 overflow-hidden h-full group-hover:transform
                        group-hover:scale-[1.02]"
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
                                  <Image
                                    src={`/${snippet.language}.png`}
                                    alt={`${snippet.language} logo`}
                                    className="relative z-10"
                                    width={40}
                                    height={40}
                                  />
                                </div>
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm">
                                  {snippet.language}
                                </span>
                              </div>
                              <div
                                className="absolute top-6 right-6 z-10"
                                onClick={(e) => e.preventDefault()}
                              >
                                <StarButton snippetId={snippet._id} />
                              </div>
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-3 line-clamp-1 group-hover:text-blue-400 transition-colors">
                              {snippet.title}
                            </h2>
                            <div className="flex items-center justify-between text-sm text-gray-400">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {new Date(
                                    snippet._creationTime
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                          <div className="px-6 pb-6">
                            <div className="bg-black/30 rounded-lg p-4 overflow-hidden">
                              <pre className="text-sm text-gray-300 font-mono line-clamp-3">
                                {snippet.code}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}

                  {(!starredSnippets || starredSnippets.length === 0) && (
                    <div className="col-span-full text-center py-12">
                      <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-400 mb-2">
                        No starred snippets yet
                      </h3>
                      <p className="text-gray-500">
                        Start exploring and star the snippets you find useful!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {isDialogOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-[90%] max-w-4xl bg-[#0a0a0a] border border-gray-800 rounded-xl shadow-lg p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2">
              <h2 className="text-gray-200 text-lg font-medium">
                {selectedTitle}- View Submitted Code
              </h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-400 hover:text-white transition text-xl"
              >
                ✕
              </button>
            </div>

            {/* Monaco Editor */}
            <div className="overflow-hidden rounded-md">
              <Editor
                height="60vh"
                theme="vs-dark"
                defaultLanguage="cpp"
                value={selectedCode || ""}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
