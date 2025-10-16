import { ConvexError, v } from "convex/values";
import { action, internalAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUser = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (userId === null) return null
        return await ctx.db.get(userId)
    }
})

export const getProfile = query({
    args: {
        userId: v.id("users")
    },
    handler: async (ctx, args) => {
        const { userId } = args

        const user = await ctx.db.query("users")
            .withIndex("by_id", (q) => q.eq("_id", userId))
            .first()

        return user
    }
})

export const getUsers = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new ConvexError("Not authenticated")
        const user = await ctx.db.query("users")
            .withIndex("by_id", (q) => q.eq("_id", userId))
            .first()

        if (user?.role !== "admin") throw new ConvexError("Unauthorized")

        const users = await ctx.db.query("users")
            .collect()

        const usersWithData = await Promise.all(
            users.map(async (user) => {
                const reviews = await ctx.db.query("reviews")
                    .withIndex("by_user", (q) => q.eq("userId", user._id))
                    .collect()
                const logs = await ctx.db.query("logs")
                    .withIndex("by_user", (q) => q.eq("userId", user._id))
                    .order("desc")
                    .collect()
                return {
                    ...user,
                    reviews,
                    logs
                }
            }))

        return usersWithData
    }
})

export const setAdmin = internalMutation({
    args: {
        userId: v.id("users")
    },
    handler: async (ctx, args) => {
        const { userId } = args
        await ctx.db.patch(userId, {
            role: "admin"
        })

        return "success"
    }
})

export const searchMovies = action({
    args: {
        query: v.string(),
        year: v.optional(v.string()),
        page: v.optional(v.number())
    },
    handler: async (ctx, args) => {
        let url = `http://www.omdbapi.com/?s=${encodeURIComponent(args.query)}&apikey=23b16659&type=movie`;
        if (args.year) url += `&y=${args.year}`;
        if (args.page) url += `&page=${args.page}`;

        const response = await fetch(url);
        const data = await response.json();
        return data;
    },
})

export const getMovieDetails = internalAction({
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

export const getMoviePublic = action({
    args: { id: v.string() },
    handler: async (ctx, args) => {
        const data: any = await ctx.runAction(internal.myFunctions.getMovieDetails, args)
        return data
    }
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

        const existing = await ctx.db.query("reviews")
            .withIndex("by_userId_movieId", q =>
                q.eq("userId", userId).eq("movieId", movieId)
            ).first()

        if (existing) throw new ConvexError("You already have a review for this movie")

        const review = await ctx.db.insert("reviews", {
            movieId,
            rating,
            content,
            userId,
            createdAt: new Date().toISOString()
        })

        await ctx.db.insert("logs", {
            userId,
            action: "rate_movie",
            details: JSON.stringify({ movieId, rating, content }),
            timestamp: new Date().toISOString()
        })

        return review
    }
})

export const getReviewsForUser = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new ConvexError("User not authenticated")
        const reviews = await ctx.db.query('reviews')
            .withIndex("by_user")
            .order("desc")
            .collect()

        return reviews
    }
})

export const getReviewsForUserInternal = internalQuery({
    args: {
        userId: v.optional(v.id("users"))
    },
    handler: async (ctx, args) => {
        const { userId } = args
        if (!userId) throw new ConvexError("User not authenticated")
        const reviews = ctx.db.query('reviews')
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect()

        return reviews
    }
})

export const getLogsForUserInternal = internalQuery({
    args: {
        userId: v.optional(v.id("users"))
    },
    handler: async (ctx, args) => {
        const { userId } = args
        if (!userId) throw new ConvexError("User not authenticated")
        const logs = ctx.db.query('logs')
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect()

        return logs
    }
})

export const getUserReviewsWithMovies = action({
    args: {
        userId: v.optional(v.id("users"))
    },
    handler: async (ctx, args) => {
        const { userId } = args

        const reviews: any = await ctx.runQuery(internal.myFunctions.getReviewsForUserInternal, { userId })

        const reviewsWithMovies = await Promise.all(
            reviews.map(async (r: any) => {
                const movie = await ctx.runAction(internal.myFunctions.getMovieDetails, { id: r.movieId })
                return {
                    ...r,
                    movie
                }
            })
        )
        return reviewsWithMovies
    }
})

export const deleteReview = mutation({
    args: {
        id: v.id("reviews"),
    },
    handler: async (ctx, args) => {
        const { id } = args
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new ConvexError("Usuário não autenticado")

        const review = await ctx.db.query("reviews")
            .withIndex("by_id", (q) => q.eq("_id", id))
            .first()

        const user = await ctx.db.query("users")
            .withIndex("by_id", (q) => q.eq("_id", userId))
            .first()

        const canDelete = review?.userId === user?._id || user?.role === "admin"

        if (!canDelete) throw new ConvexError("Não permitido")

        await ctx.db.delete(id)

        await ctx.db.insert("logs", {
            userId,
            action: "delete_review",
            details: JSON.stringify({
                reviewId: id,
                movieId: review?.movieId,
                performedBy: userId
            }),
            timestamp: new Date().toISOString()
        })

        return true
    }
})