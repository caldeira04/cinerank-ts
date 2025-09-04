import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { RateMovieCard } from "./rate-movie-card"

interface Movie {
    Title: string
    Year: number
    Poster: string
    imdbID: string
}

export function MovieCard({
    movie
}: {
    movie: Movie
}) {
    return (
        <Card>
            <CardHeader className="flex flex-col items-center">
                <CardTitle>{movie.Title}</CardTitle>
                <CardDescription>{movie.Year}</CardDescription>
            </CardHeader>
            <CardContent>
                <img src={movie.Poster} alt={`Couldn't find poster for ${movie.Title}`} />
            </CardContent>
            <CardFooter>
                <CardAction>
                    <RateMovieCard movieId={movie.imdbID} />
                </CardAction>
            </CardFooter>
        </Card>
    )
}
