"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Image from "next/image";
import { Input } from "../ui/input";
import { usePathname, useRouter } from "next/navigation";

import { CommentValidation } from "@/lib/validations/thread";
import { addCommentToThread } from "@/lib/actions/thread.actions";
// import { writeComment } from "@/lib/actions/thread.actions";


interface Props {
    threadId: string,
    currentUserImage: string,
    currentUserId: string,
}
const Comment = ({
    threadId,
    currentUserImage,
    currentUserId,
}: Props) => {

    const pathname = usePathname();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread({
            threadId,
            commentText: values.thread,
            userId: JSON.parse(currentUserId),
            path: pathname,
        })

        form.reset();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form"
            >
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex items-center w-full gap-3">
                            <FormLabel>
                                <Image
                                    src={currentUserImage}
                                    alt={"Profile image"}
                                    width={100}
                                    height={100}
                                    className="rounded-full object-cover !w-12 !h-12"
                                />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input
                                    type="text"
                                    placeholder={"Comment..."}
                                    className="no-focus text-light-1 outline-none"
                                    {
                                    ...field
                                    }
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="comment-form_btn">
                    Reply
                </Button>
            </form>
        </Form>
    )
}

export default Comment