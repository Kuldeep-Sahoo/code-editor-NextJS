import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const saveExecution = mutation({
  args: {
    language: v.string(),
    code: v.string(),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not Authenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();
    if (!user?.isPro && args.language !== "javascript") {
      throw new ConvexError("Pro subscription is needed to run this languge ");
    }
    await ctx.db.insert("codeExecutions", {
      ...args,
      userId: identity.subject,
    });
  },
});

export const getUserExecutions = query({
  args: {
    userId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("codeExecutions")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getUserExecutionsById = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    if (!args.userId) return [];

    return await ctx.db
      .query("codeExecutions")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});

export const getUserStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const executions = await ctx.db
      .query("codeExecutions")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Get starred snippets
    const starredSnippets = await ctx.db
      .query("stars")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Get all starred snippet details to analyze languages
    const snippetIds = starredSnippets.map((star) => star.snippetId);
    const snippetDetails = await Promise.all(
      snippetIds.map((id) => ctx.db.get(id))
    );

    // Calculate most starred language
    const starredLanguages = snippetDetails.filter(Boolean).reduce(
      (acc, curr) => {
        if (curr?.language) {
          acc[curr.language] = (acc[curr.language] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    const mostStarredLanguage =
      Object.entries(starredLanguages).sort(([, a], [, b]) => b - a)[0]?.[0] ??
      "N/A";

    // Calculate execution stats
    const last24Hours = executions.filter(
      (e) => e._creationTime > Date.now() - 24 * 60 * 60 * 1000
    ).length;

    const languageStats = executions.reduce(
      (acc, curr) => {
        acc[curr.language] = (acc[curr.language] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const languages = Object.keys(languageStats);
    const favoriteLanguage = languages.length
      ? languages.reduce((a, b) =>
          languageStats[a] > languageStats[b] ? a : b
        )
      : "N/A";

    return {
      totalExecutions: executions.length,
      languagesCount: languages.length,
      languages: languages,
      last24Hours,
      favoriteLanguage,
      languageStats,
      mostStarredLanguage,
    };
  },
});

export const getExecutionHistory = query({
  args: {
    userId: v.string(), // expect userId as argument
  },
  handler: async ({ db }, { userId }) => {
    const executions = await db
      .query("codeExecutions")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    // Aggregate executions by date
    const historyMap: Record<string, { success: number; error: number }> = {};

    executions.forEach((execution) => {
      const date = new Date(execution._creationTime)
        .toISOString()
        .split("T")[0]; // YYYY-MM-DD

      if (!historyMap[date]) {
        historyMap[date] = { success: 0, error: 0 };
      }

      if (execution.error) {
        historyMap[date].error += 1;
      } else {
        historyMap[date].success += 1;
      }
    });

    // Convert to array format
    return Object.entries(historyMap).map(([date, { success, error }]) => ({
      date,
      success,
      error,
    }));
  },
});


export const getAllExecutions = query({
  handler: async (ctx) => {
    return await ctx.db.query("codeExecutions").order("desc").collect();
  },
});

