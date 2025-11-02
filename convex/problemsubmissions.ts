import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createSubmission = mutation({
  args: {
    userId: v.string(),
    problemId: v.string(),
    problemTitle: v.string(),
    language: v.string(),
    code: v.string(),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
    status: v.optional(v.string()),
    passedCount: v.optional(v.number()),
    totalCount: v.optional(v.number()),
    results: v.optional(
      v.array(
        v.object({
          input: v.string(),
          expected: v.string(),
          actual: v.string(),
          passed: v.boolean(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("problemsubmissions", {
      ...args,
      problemId: args.problemId,
      problemTitle: args.problemTitle,
      output: args.output ?? "",
      error: args.error ?? "",
      status: args.status ?? "Pending",
      passedCount: args.passedCount ?? 0,
      totalCount: args.totalCount ?? 0,
      submittedAt: Date.now(),
    });
  },
});

export const getSubmissionsByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    console.log({userId});
    const allSubs = await ctx.db.query("problemsubmissions").collect();

    const userSubs = allSubs
      .filter((sub) => sub.userId === userId)
      .sort((a, b) => b.submittedAt - a.submittedAt);

    return userSubs ?? [];
  },
});


export const getAllSubmissions = query({
  handler: async (ctx) => {
    return await ctx.db.query("problemsubmissions").order("desc").collect();
  },
});
