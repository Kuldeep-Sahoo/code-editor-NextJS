import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const goOnline = mutation({
  args: {
    userId: v.string(),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    name: v.optional(v.string()), // optional
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("onlineUsers")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { lastSeen: now });
      return;
    }

    await ctx.db.insert("onlineUsers", {
      userId: args.userId,
      name: args.name ?? "Anonymous",
      email: args.email ?? "Anonymous mail",
      imageUrl: args.imageUrl ?? "Not available",
      lastSeen: now,
    });
  },
});

export const getActiveUserCount = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const activeThreshold = now - 15000; // 15 sec

    const activeUsers = await ctx.db
      .query("onlineUsers")
      .withIndex("by_lastSeen")
      .filter((q) => q.gte(q.field("lastSeen"), activeThreshold))
      .collect();

    return { count: activeUsers.length };
  },
});

export const getActiveUsers = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const activeThreshold = now - 15000; // 15 sec

    return await ctx.db
      .query("onlineUsers")
      .withIndex("by_lastSeen")
      .filter((q) => q.gte(q.field("lastSeen"), activeThreshold))
      .collect();
  },
});

export const cleanupInactiveUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const threshold = now - 15000; // inactive for 15 sec

    const inactiveUsers = await ctx.db
      .query("onlineUsers")
      .withIndex("by_lastSeen")
      .filter((q) => q.lt(q.field("lastSeen"), threshold))
      .collect();

    for (const user of inactiveUsers) {
      await ctx.db.delete(user._id);
    }
  },
});
