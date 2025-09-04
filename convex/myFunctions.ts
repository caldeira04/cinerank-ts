import { v } from "convex/values";
import { action } from "./_generated/server";

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
