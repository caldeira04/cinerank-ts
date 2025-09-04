import { ConvexError, v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const searchMovies = action({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        const data = await fetch(`http://www.omdbapi.com/?s=${encodeURIComponent(args.query)}&apikey=23b16659`)
            .then(res => res.json())
            .catch(err => {
                console.log(err)
                return []
            })

        return data

    },
})

export const getMovieDetails = action({
    args: { id: v.string() },
    handler: async (ctx, args) => {
        const data = await fetch(`http://www.omdbapi.com/?i=${encodeURIComponent(args.id)}&apikey=23b16659`)
            .then(res => res.json())
            .catch(err => {
                console.log(err)
                return []
            })

        return data
    },
})

export const rateMovie = mutation({
    args: {
        movieId: v.string(),
        rating: v.number(),
        content: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { movieId, rating, content } = args
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new ConvexError("User not authenticated")

        const review = await ctx.db.insert("reviews", {
            movieId,
            rating,
            content,
            userId,
        })

        return review
    }
})
