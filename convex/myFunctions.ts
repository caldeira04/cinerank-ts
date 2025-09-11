import { ConvexError, v } from "convex/values";
import { action, internalAction, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUser = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (userId === null) return null
        return await ctx.db.get(userId)
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
});

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
        const movie = await ctx.db.query("reviews").withIndex("by_user").collect()
        if (movie.length > 0) {
            throw new ConvexError("You have already rated this movie")
        }

        const review = await ctx.db.insert("reviews", {
            movieId,
            rating,
            content,
            userId,
            createdAt: new Date().toISOString()
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
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new ConvexError("User not authenticated")
        const reviews = ctx.db.query('reviews')
            .withIndex("by_user")
            .order("desc")
            .collect()

        return reviews
    }
})

export const getUserReviewsWithMovies = action({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new ConvexError("User not authenticated")

        const reviews: any = await ctx.runQuery(internal.myFunctions.getReviewsForUserInternal, {})

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
        if (!userId) throw new ConvexError("User not authenticated")
        await ctx.db.delete(id)
        return true
    }
})
