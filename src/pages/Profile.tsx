import { ReviewCard } from "@/components/review-card";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api.js";
import { useAction, useQuery } from "convex/react";
import { Home } from "lucide-react";
import { useEffect, useState } from "react";

export default function Profile() {
    const user = useQuery(api.myFunctions.getUser)
    const getUserReviewsWithMovies = useAction(api.myFunctions.getUserReviewsWithMovies)
    const [reviews, setReviews] = useState<any>()

    useEffect(() => {
        async function fetchReviews() {
            const data = await getUserReviewsWithMovies({})
            setReviews(data)
        }
        fetchReviews()
    }, [getUserReviewsWithMovies])

    return (
        <div className="flex flex-col items-center justify-between gap-2 w-1/2 mx-auto p-4">
            <div className="flex items-center justify-between w-full gap-2">
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                    <Home />
                    <span>Home</span>
                </Button>
                <div>
                    {user && <h1>Reviews for {user.email}</h1>}
                </div>
            </div>
            <div className="flex flex-col w-full h-1/3 gap-4">
                {user && reviews?.map((r: any) => {
                    return <ReviewCard review={r} key={r._id} />
                })}
            </div>
        </div>
    )
}
