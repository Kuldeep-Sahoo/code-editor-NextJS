import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const syncUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!existingUser) {
      await ctx.db.insert("users", {
        userId: args.userId,
        name: args.name,
        email: args.email,
        isPro: false,
      });
    }
  },
});

export const getUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return null;
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    if (!user) return null;
    return user;
  },
});

export const updateUserProStatus = mutation({
  args: { userId: v.string(), isPro: v.boolean(), proSince: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      isPro: args.isPro,
      proSince: args.proSince,
    });
    // console.log("done updating user pro status");
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    data: v.object({
      isPro: v.optional(v.boolean()),
      role: v.optional(v.string()),
      proSince: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.data);
  },
});