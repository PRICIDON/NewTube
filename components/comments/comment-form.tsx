import React from 'react'
import UserAvatar from '@/components/users/avatar'
import {useClerk, useUser} from '@clerk/nextjs'
import {Textarea} from '@/components/ui/textarea'
import {Button} from '@/components/ui/button'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {commentInsertSchema} from '@/db/schema'
import {zodResolver} from '@hookform/resolvers/zod'
import {trpc} from '@/trpc/client'
import {toast} from 'sonner'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form'
import {useTranslations} from 'next-intl'

interface CommentFormProps {
    videoId: string
    onSuccess?: () => void
    variant?: "reply" | "comment"
    parentId?: string
    onCancel?: () => void
}

export default function CommentForm({ videoId, onSuccess, variant = "comment", onCancel, parentId }: CommentFormProps) {
    const t = useTranslations('comments')
    const { user } = useUser()
    const clerk = useClerk();
    const utils = trpc.useUtils()
    const create = trpc.comments.create.useMutation({
        onSuccess(){
            utils.comments.getMany.invalidate({ videoId })
            utils.comments.getMany.invalidate({ videoId, parentId })
            form.reset()
            toast.success(t('success'))
            onSuccess?.()
        },
        onError(e) {
            toast.error(t('error'))
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
            parentId
        }
    })
    const handleSubmit = (values: z.infer<typeof commentInsertSchema>) => {
        create.mutate(values)
    }
    const handleCancel = () => {
        form.reset()
        onCancel?.()
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
                                    <Textarea {...field} placeholder={variant === "reply" ? t('reply') : t('add')} className="resize-none bg-transparent overflow-hidden min-h-0" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="justify-end gap-2 mt-2 flex">
                        {onCancel && (
                            <Button variant='ghost' type="button" onClick={handleCancel}>
                                {t('cancel')}
                            </Button>
                        )}
                        <Button type="submit" size="sm" disabled={create.isPending}>
                            {variant === "reply" ? t('titleReply') : t('title')}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}
