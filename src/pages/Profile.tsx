import { ReviewCard } from "@/components/review-card";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api.js";
import { useAction, useQuery } from "convex/react";
import { Home } from "lucide-react";
import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import { Id } from "convex/_generated/dataModel.js";

export default function Profile() {
    const pathname = window.location.pathname.split("/").at(2)
    const user = useQuery(api.myFunctions.getProfile, { userId: pathname as Id<"users"> })
    if (!user) redirect("/login")
    const getUserReviewsWithMovies = useAction(api.myFunctions.getUserReviewsWithMovies)
    const [reviews, setReviews] = useState<any>()

    useEffect(() => {
        async function fetchReviews() {
            const data = await getUserReviewsWithMovies({ userId: pathname as Id<"users"> })
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
            <div className="w-full">
                {user?.role === "admin" &&
                    <Button
                        className="w-full"
                        onClick={() => { window.location.href = "/admin" }}
                    >
                        <span>Admin Panel</span>
                    </Button>
                }
            </div>
            <div className="flex flex-col w-full h-1/3 gap-4">
                {user && reviews?.map((r: any) => {
                    return <ReviewCard review={r} key={r._id} />
                })}
            </div>
        </div>
    )
}
