import { Loader2 } from "lucide-react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Navigate } from "react-router-dom"

interface Props {
    children: React.ReactNode
}

export function AdminRoute({ children }: Props) {
    const { isLoading, isAuthenticated, user } = useCurrentUser()

    if (isLoading) return <div className="w-full h-screen flex mx-auto"><Loader2 className="animate-spin" /></div>

    if (!isAuthenticated || user?.role !== "admin") <Navigate to="/login" />

    return children
}
