import React from 'react'
import UserAvatar from "@/components/avatar";
import {useClerk, useUser} from "@clerk/nextjs";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {commentInsertSchema} from "@/db/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {trpc} from "@/trpc/client";
import {toast} from "sonner";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";

interface CommentFormProps {
    videoId: string
    onSuccess?: () => void
}

export default function CommentForm({ videoId, onSuccess }: CommentFormProps) {
    const { user } = useUser()
    const clerk = useClerk();
    const utils = trpc.useUtils()
    const create = trpc.comments.create.useMutation({
        onSuccess(){
            utils.comments.getMany.invalidate({ videoId })
            form.reset()
            toast.success("Comment add")
            onSuccess?.()
        },
        onError(e) {
            toast.error("Error adding comment")
            if(e.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }

        }
    })


    const form = useForm<z.infer<typeof commentInsertSchema>>({
        // @ts-ignore
        resolver: zodResolver(commentInsertSchema.omit({ userId: true})),
        defaultValues: {
            videoId,
            value: "",
        }
    })
    const handleSubmit = (values: z.infer<typeof commentInsertSchema>) => {
        create.mutate(values)
    }
    return (
        <Form {...form}>
            {/* @ts-ignore */}
            <form className="flex gap-4 group" onSubmit={form.handleSubmit(handleSubmit)}>
                <UserAvatar size='lg' imageUrl={user?.imageUrl || "/user-placeholder.svg"} name={user?.username || "User"}  />
                <div className="flex-1">
                    <FormField
                        name="value"
                        // @ts-ignore
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea {...field} placeholder="Add a comment..." className="resize-none bg-transparent overflow-hidden min-h-0" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="justify-end gap-2 mt-2 flex">
                        <Button type="submit" size="sm" disabled={create.isPending}>
                            Comment
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}
