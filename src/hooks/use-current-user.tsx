import { useConvexAuth, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

export function useCurrentUser() {
    const { isLoading, isAuthenticated } = useConvexAuth()
    const user = useQuery(api.myFunctions.getUser)

    return {
        isLoading: isLoading || (isAuthenticated && user === null),
        isAuthenticated: isAuthenticated && user !== null,
        user
    }
}
