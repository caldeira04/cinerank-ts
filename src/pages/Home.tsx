import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api.js"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { MovieCard } from "@/components/movie-card.js";
import { User } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Home() {
    const searchMovies = useAction(api.myFunctions.searchMovies)
    const user = useQuery(api.myFunctions.getUser)
    const { signOut } = useAuthActions()

    const [query, setQuery] = useState("")
    const [movies, setMovies] = useState<any[]>([])
    const [topMovies, setTopMovies] = useState<any[]>([])

    async function handleSearch() {
        try {
            const result = await searchMovies({ query })
            if (!result.Response) return
            setMovies(result.Search)
        } catch (error) {
            console.error(error)
        }
    }

    function handleClear() {
        setQuery("")
        setMovies([])
    }
    useEffect(() => {
    async function fetchTopOfYear() {
        const currentYear = new Date().getFullYear();
        const titles = [
        "Superman",
        "F1 The Movie",
        "Sinners",
        "Weapons",
        "Ballerina",
        "Thunderbolts"
        ];

        const allResults = await Promise.all(
        titles.map(title =>
            searchMovies({ query: title })
            .then(res => res?.Search || [])
            .catch(() => [])
        )
        );


        const flatResults = allResults.flat();

        if (!flatResults.length) return;


        const detailed = await Promise.all(
        flatResults.map((m: any) =>
            fetch(`http://www.omdbapi.com/?i=${m.imdbID}&apikey=23b16659`)
            .then(res => res.json())
            .catch(() => null)
        )
        );

        const top = detailed
        .filter(m => {
            if (!m) return false;
            if (!m.Released || m.Released === "N/A") return false;
            if (!m.imdbRating || m.imdbRating === "N/A") return false;
            if (!m.imdbVotes || m.imdbVotes === "N/A") return false;

            const releaseDate = new Date(m.Released);
            const releaseYear = releaseDate.getFullYear();
            const votes = Number(m.imdbVotes.replace(/,/g, ""));

            return releaseYear === currentYear && votes >= 0;
        })
        .sort((a, b) => Number(b.imdbRating) - Number(a.imdbRating))
        .slice(0, 6);

        setTopMovies(top);
    }

    fetchTopOfYear();
    }, [searchMovies]);


    if (user === null) return window.location.href = "/login"

    return (
        <div className="flex flex-col gap-4 w-1/2 mx-auto p-4">
            <div className="flex items-center w-full justify-between">
                <h1 className="text-xl font-bold">Home</h1>
                {user ?
                    <div className="flex items-center justify-between gap-2">
                        <Button variant="outline" onClick={() => { window.location.href = `/profile/${user._id}` }}>
                            <User />
                            <span>Profile</span>
                        </Button>
                        <Button variant="outline" onClick={() => void signOut()}>
                            <span>Logout</span>
                        </Button>
                    </div>
                    :
                    <Button onClick={() => { window.location.href = "/login" }}>Login</Button>
                }
            </div>

            <div className="flex items-center gap-4">
                <Input
                    placeholder="Search movies"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button onClick={() => { void handleSearch() }}>Search</Button>
                {movies.length > 0 && (
                    <Button variant="outline" onClick={handleClear}>
                        Clear
                    </Button>
                )}
            </div>

            {movies.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                    {movies.map((m) => <MovieCard key={m.imdbID} movie={m} />)}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold mb-2">
                        Top rated movies of {new Date().getFullYear()}
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        {topMovies.map((m) => <MovieCard key={m.imdbID} movie={m} />)}
                    </div>
                </div>
            )}
        </div>
    );
}
