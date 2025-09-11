import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
    ...authTables,

    reviews: defineTable({
        userId: v.id("users"),
        movieId: v.string(),
        rating: v.number(),
        content: v.optional(v.string()),
        createdAt: v.optional(v.string()),
        updatedAt: v.optional(v.string()),
    })
        .index("by_movie", ["movieId"])
        .index("by_user", ["userId"])
        .index("by_created", ["createdAt"]),

    users: defineTable({
        email: v.string(),
        role: v.optional(v.literal("admin")),
        createdAt: v.optional(v.string()),
        updatedAt: v.optional(v.string()),
    })
        .index("by_email", ["email"]),

    tags: defineTable({
        name: v.string(),
    }),

    movieTags: defineTable({
        movieId: v.id("movies"),
        tagId: v.id("tags"),
    })
        .index("by_movie", ["movieId"])
        .index("by_tag", ["tagId"]),
});
