import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api.js"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MovieCard } from "@/components/movie-card.js";

export default function Home() {
    const searchMovies = useAction(api.myFunctions.searchMovies)
    const [query, setQuery] = useState("")
    const [movies, setMovies] = useState([])


    async function handleSearch() {
        try {
            const result = await searchMovies({ query })
            if (!result.Response) return
            setMovies(result.Search)
            console.log(result.Search)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <h1>Home</h1>
            <Input
                placeholder="Search movies"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={() => { void handleSearch() }}>Search</Button>
            <div className="grid grid-cols-3 gap-4">

                {movies.map((m) => {
                    return <MovieCard movie={m} />
                })}
            </div>

        </div>
    );
}
