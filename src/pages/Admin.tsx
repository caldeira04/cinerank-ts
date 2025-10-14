import { AdminRoute } from "@/components/admin-route";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ArrowLeft } from "lucide-react";


export default function Admin() {
    const { user } = useCurrentUser()

    return (
        <AdminRoute>
            <div className="flex flex-col items-center justify-between w-full p-8">
                <div className="w-full">
                    <Button
                        className="self-start"
                        onClick={() => { window.location.href = "/profile" }}>
                        <ArrowLeft /> retornar
                    </Button>
                    <h1 className="w-full text-center font-bold text-3xl">Painel de Admin</h1>
                </div>
                <p>usuário: {user?.email}</p>
            </div>
        </AdminRoute>
    )
}
