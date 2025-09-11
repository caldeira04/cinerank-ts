import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api.js"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { MovieCard } from "@/components/movie-card.js";
import { User } from "lucide-react";

export default function Home() {
    const searchMovies = useAction(api.myFunctions.searchMovies)
    const user = useQuery(api.myFunctions.getUser)
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

    if (user === null) return window.location.href = "/login"

    return (
        <div className="flex flex-col w-1/2 mx-auto p-4">
            <div className="pb-4 flex items-center w-full justify-between">
                <h1 className="text-xl font-bold">Home</h1>
                {user ?
                    <Button variant="outline" onClick={() => { window.location.href = `/profile/${user._id}` }}>
                        <User />
                        <span>Profile</span>
                    </Button>
                    :
                    <Button onClick={() => { window.location.href = "/login" }}>Login</Button>
                }
            </div>
            <div className="flex items-center flex-between gap-4">
                <Input
                    placeholder="Search movies"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button onClick={() => { void handleSearch() }}>Search</Button>
            </div>
            <div className="grid grid-cols-3 gap-4">

                {movies.map((m) => {
                    return <MovieCard movie={m} />
                })}
            </div>
        </div >
    );
}
