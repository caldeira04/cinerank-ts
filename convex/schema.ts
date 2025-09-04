import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
    ...authTables,

    movies: defineTable({
        title: v.string(),
        director: v.string(),
        year: v.number(),
        plot: v.optional(v.string()),
        posterUrl: v.optional(v.string()),
        imdbRating: v.optional(v.number()),
        createdAt: v.optional(v.string()),
        updatedAt: v.optional(v.string()),
    })
        .index("by_year", ["year"]),

    reviews: defineTable({
        movieId: v.id("movies"),
        userId: v.id("users"),
        rating: v.number(),
        title: v.string(),
        content: v.optional(v.string()),
        createdAt: v.optional(v.string()),
        updatedAt: v.optional(v.string()),
    })
        .index("by_movie", ["movieId"])
        .index("by_user", ["userId"])
        .index("by_created", ["createdAt"]),

    users: defineTable({
        username: v.string(),
        email: v.string(),
        passwordHash: v.string(),
        role: v.union(
            v.literal("user"),
            v.literal("admin"),
        ),
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
