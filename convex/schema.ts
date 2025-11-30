import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define the schema for the database
export default defineSchema({
  // Define the 'users' table with various fields
  users: defineTable({
    userId: v.string(), // Unique identifier for the user
    email: v.string(), // User's email address
    name: v.string(), // User's name
    isPro: v.boolean(), // Boolean indicating if the user is a pro member
    proSince: v.optional(v.number()), // Optional field for the date since the user became a pro member
    role: v.optional(v.string()),
    lemonSqueezyCustomerId: v.optional(v.string()), // Optional field for Lemon Squeezy customer ID
    lemonSqueezyOrderId: v.optional(v.string()), // Optional field for Lemon Squeezy order ID
    chatWithAdmin: v.optional(
      v.array(
        v.object({
          sender: v.string(), // "user" or "admin"
          senderId: v.string(), // ID of the sender
          senderName: v.string(), // Name of the sender
          message: v.string(), // Message content
          timestamp: v.number(), // Timestamp of the message
        })
      )
    ),
  }).index("by_user_id", ["userId"]), // Index the table by userId for quick lookup
  onlineUsers: defineTable({
    userId: v.string(),
    name: v.string(), // <-- NEW
    email: v.string(), // <-- NEW
    lastSeen: v.number(), // timestamp in ms
  })
    .index("by_userId", ["userId"])
    .index("by_lastSeen", ["lastSeen"]),
  // Define the 'codeExecutions' table to store code execution details
  codeExecutions: defineTable({
    userId: v.string(), // ID of the user who executed the code
    language: v.string(), // Programming language of the code
    code: v.string(), // The code that was executed
    output: v.optional(v.string()), // Optional field for the output of the code execution
    error: v.optional(v.string()), // Optional field for any error messages from the code execution
  }).index("by_user_id", ["userId"]), // Index the table by userId for quick lookup

  // Define the 'snippets' table to store code snippets
  snippets: defineTable({
    userId: v.string(), // ID of the user who created the snippet
    title: v.string(), // Title of the snippet
    language: v.string(), // Programming language of the snippet
    code: v.string(), // The code of the snippet
    userName: v.string(), // Store user's name for easy access
  }).index("by_user_id", ["userId"]), // Index the table by userId for quick lookup

  // Define the 'snippetComments' table to store comments on snippets
  snippetComments: defineTable({
    snippetId: v.id("snippets"), // ID of the snippet being commented on
    userId: v.string(), // ID of the user who made the comment
    userName: v.string(), // Name of the user who made the comment
    content: v.string(), // Store HTML content of the comment
  }).index("by_snippet_id", ["snippetId"]), // Index the table by snippetId for quick lookup

  // Define the 'stars' table to store user-starred snippets
  stars: defineTable({
    userId: v.string(), // ID of the user who starred the snippet
    snippetId: v.id("snippets"), // ID of the snippet that was starred
  })
    .index("by_user_id", ["userId"]) // Index the table by userId for quick lookup
    .index("by_snippet_id", ["snippetId"]) // Index the table by snippetId for quick lookup
    .index("by_user_id_and_snippet_id", ["userId", "snippetId"]), // Index by both userId and snippetId for quick lookup
  problems: defineTable({
    problemId: v.optional(v.string()), // optional custom id like "p1"
    title: v.string(), // "Sum of Two Numbers"
    description: v.string(), // problem statement
    difficulty: v.optional(v.string()), // "easy" | "medium" | "hard"
    languageSupport: v.optional(v.array(v.string())), // ["cpp", "python", "javascript", "java"]

    testCases: v.array(
      v.object({
        input: v.string(), // e.g. "1 2"
        expectedOutput: v.string(), // e.g. "3"
      })
    ),

    constraints: v.optional(v.string()), // e.g. "1 <= A, B <= 10^9"
    baseCode: v.optional(
      v.object({
        cpp: v.optional(v.string()), // C++ base code
        python: v.optional(v.string()), // Python base code
        javascript: v.optional(v.string()), // JavaScript base code
        java: v.optional(v.string()), // Java base code
      })
    ),

    createdAt: v.number(), // Date.now()
  }),
  problemsubmissions: defineTable({
    userId: v.string(), // ID of the user who submitted
    userName: v.optional(v.string()), // Name of the user who submitted
    problemId: v.string(), // reference to problems table
    problemTitle: v.optional(v.string()), // reference to problems table
    language: v.string(), // e.g. "cpp", "python"
    code: v.string(), // submitted source code
    output: v.optional(v.string()), // combined output (if needed)
    error: v.optional(v.string()), // combined error message
    status: v.optional(v.string()), // "Accepted", "Wrong Answer", etc.
    passedCount: v.optional(v.number()), // how many test cases passed
    totalCount: v.optional(v.number()), // total test cases run
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
    submittedAt: v.number(), // Date.now()
  })
    .index("by_user_id", ["userId"])
    .index("by_problem_id", ["problemId"])
    .index("by_user_and_problem", ["userId", "problemId"]),
});
