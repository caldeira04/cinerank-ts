import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAction, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api.js"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"

interface Movie {
    Title: string
    Released: number
    Poster: string
    imdbRating: string
    Director: string
    Plot: string
}

const formSchema = z.object({
    rating: z.number().min(1).max(5),
    content: z.string().optional(),
})

export function RateMovieCard({
    movieId
}: {
    movieId: string
}) {
    const [movie, setMovie] = useState<Movie>()
    const getMovieDetails = useAction(api.myFunctions.getMovieDetails)
    const rateMovie = useMutation(api.myFunctions.rateMovie)
    async function handleRateClick() {
        const movie = await getMovieDetails({ id: movieId })
        setMovie(movie)
        console.log(movie)
        if (!movie) return
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rating: 0,
            content: "",
        },
    })

    function onSubmitReview(data: z.infer<typeof formSchema>) {
        const values = {
            ...data,
            movieId,
        }

        rateMovie(values)
        console.log(values)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button onClick={() => void handleRateClick()}>Rate</Button>
            </DialogTrigger>
            <DialogContent className="min-w-1/3">
                <DialogHeader>
                    <DialogTitle>{movie?.Title}</DialogTitle>
                    <DialogDescription className="flex flex-col">
                        <span className="w-1/2">{movie?.Plot}</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-4">
                    <img className="w-full" src={movie?.Poster} alt={`Couldn't find poster for ${movie?.Title}`} />
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-col items-start">
                            <span>Directed by: {movie?.Director}</span>
                            <div className="flex gap-4">
                                <span>Released: {movie?.Released}</span>
                                <span>Rated: {movie?.imdbRating}</span>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-center">Rate this movie</h2>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmitReview)} className="w-full h-full space-y-8">
                                <FormField
                                    control={form.control}
                                    name="rating"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Rating</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={(val) => field.onChange(Number(val))}
                                                    defaultValue={String(field.value)}
                                                    className="flex"
                                                >
                                                    <FormItem className="flex items-center gap-3">
                                                        <FormControl>
                                                            <RadioGroupItem value="1" />
                                                        </FormControl>
                                                        <FormLabel>1</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center gap-3">
                                                        <FormControl>
                                                            <RadioGroupItem value="2" />
                                                        </FormControl>
                                                        <FormLabel>2</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center gap-3">
                                                        <FormControl>
                                                            <RadioGroupItem value="3" />
                                                        </FormControl>
                                                        <FormLabel>3</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center gap-3">
                                                        <FormControl>
                                                            <RadioGroupItem value="4" />
                                                        </FormControl>
                                                        <FormLabel>4</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center gap-3">
                                                        <FormControl>
                                                            <RadioGroupItem value="5" />
                                                        </FormControl>
                                                        <FormLabel>5</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Comment</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Leave a comment" rows={5} {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">Submit</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    )

}
