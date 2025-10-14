import { Loader2 } from "lucide-react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Navigate } from "react-router-dom"

export function ProfileRoute() {
    const { isLoading, user } = useCurrentUser()

    if (isLoading) return <div className="w-full h-screen flex mx-auto"><Loader2 className="animate-spin" /></div>

    return <Navigate to={`/profile/${user?._id}`} />
}
