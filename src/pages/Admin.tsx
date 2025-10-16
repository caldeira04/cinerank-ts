import { AdminRoute } from "@/components/admin-route";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ArrowLeft, Search } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";


export default function Admin() {

    const { user } = useCurrentUser()
    const users = useQuery(api.myFunctions.getUsers)

    return (
        <AdminRoute>
            <div className="flex flex-col items-center justify-between w-full p-8">
                <div className="w-full">
                    <Button
                        className="self-start"
                        onClick={() => { window.location.href = "/profile" }}>
                        <ArrowLeft /> retornar
                    </Button>
                    <h1 className="w-full text-center font-bold text-3xl">Admin Panel</h1>
                </div>
                <p>User: {user?.email}</p>
               <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">e-mail</TableHead>
                            <TableHead>role</TableHead>
                            <TableHead>number of reviews</TableHead>
                            <TableHead>logged actions</TableHead>
                            <TableHead className="text-right">actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell className="font-medium">{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.reviews.length}</TableCell>
                                <TableCell>{user.logs.length}</TableCell>
                                <TableCell className="text-right">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="mr-2">Logs</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <h2>Logs for {user.email}</h2>
                                            <ul>
                                                {user.logs.map(log => (
                                                    <li key={log._id}>
                                                        {log.timestamp}: {log.action} - {log.details}
                                                    </li>
                                                ))}
                                            </ul>
                                        </DialogContent>
                                    </Dialog>
                                    <Button onClick={() => {
                                        window.location.href = `/profile/${user._id}`
                                    }}>
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