import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Fetch all problems
export const getAllProblems = query({
  handler: async (ctx) => {
    const problems = await ctx.db.query("problems").collect();
    return problems;
  },
});

// Add a new problem
export const addProblem = mutation({
  args: {
    problemId: v.optional(v.string()),
    title: v.string(),
    description: v.string(),
    difficulty: v.optional(v.string()),
    constraints: v.optional(v.string()),
    languageSupport: v.optional(v.array(v.string())),
    testCases: v.array(
      v.object({
        input: v.string(),
        expectedOutput: v.string(),
      })
    ),
    baseCode: v.optional(
      v.object({
        cpp: v.optional(v.string()),
        python: v.optional(v.string()),
        javascript: v.optional(v.string()),
        java: v.optional(v.string()),
      })
    ),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    // console.log({args});
    await ctx.db.insert("problems", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
export const updateProblem = mutation({
  args: {
    id: v.id("problems"),
    data: v.object({
      title: v.string(),
      description: v.string(),
      difficulty: v.optional(v.string()),
      problemId: v.optional(v.string()),
      languageSupport: v.optional(v.array(v.string())),
      testCases: v.array(
        v.object({ input: v.string(), expectedOutput: v.string() })
      ),
      constraints: v.optional(v.string()),
      baseCode: v.optional(
        v.object({
          cpp: v.optional(v.string()),
          python: v.optional(v.string()),
          javascript: v.optional(v.string()),
          java: v.optional(v.string()),
        })
      ),
      createdAt: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.data);
    return { success: true };
  },
});

// delete a problem
export const deleteProblemById = mutation({
  args: { id: v.id("problems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
