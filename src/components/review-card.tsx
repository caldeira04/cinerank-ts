import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "convex/_generated/dataModel"
import { useCurrentUser } from "@/hooks/use-current-user"

export interface Review {
    _id: string,
    rating: number,
    content?: string
    createdAt: string
    userId: string
    movie: {
        Title: string
        Year: number
        Poster: string
        imdbID: string
    }
}

export function ReviewCard({ review }: { review: Review }) {
    const deleteReview = useMutation(api.myFunctions.deleteReview)
    const { user } = useCurrentUser()

    const canDelete = user?.role === "admin" || user?._id === review.userId

    return (
        <Card className="w-full">
            <CardHeader className="flex w-full justify-between">
                <div className="flex flex-col items-start gap-2">
                    <CardTitle>{review.movie.Title}</CardTitle>
                    <CardDescription>{review.movie.Year}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span>ID IMDB: {review.movie.imdbID}</span>
                    <span>Created at: {new Date(review.createdAt).toLocaleString()}</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="gap-4 flex items-start justify-start">
                    <img
                        src={review.movie.Poster}
                        alt={`Couldn't find poster for ${review.movie.Title}`}
                        className="w-1/4"
                    />
                    <div className="flex flex-col gap-2">
                        <h2 className="font-bold">User Review</h2>
                        <span>Rating: {review.rating}</span>
                        <p>{review.content}</p>
                    </div>

                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                {canDelete &&
                    <CardAction>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                void deleteReview({ id: review._id as Id<'reviews'> })
                                    .then(() => window.location.reload())
                            }}

                        >Delete</Button>
                    </CardAction>
                }
            </CardFooter>
        </Card>
    )

}
