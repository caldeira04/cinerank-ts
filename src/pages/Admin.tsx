import { AdminRoute } from "@/components/admin-route";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ArrowLeft, Search } from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { redirect } from "react-router-dom";


export default function Admin() {
    const { user } = useCurrentUser()

    const users = useQuery(api.myFunctions.getUsers)

    console.log(users)

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
                <Table>
                    <TableCaption>lista de usuários do cinerank</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">email</TableHead>
                            <TableHead>cargo</TableHead>
                            <TableHead>número de reviews</TableHead>
                            <TableHead className="text-right">ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell className="font-medium">{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.reviews.length}</TableCell>
                                <TableCell className="text-right">
                                    <Button onClick={() => {
                                        window.location.href = `/profile/${user._id}`
                                    }}
                                    >
                                        <Search />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AdminRoute>
    )
}
