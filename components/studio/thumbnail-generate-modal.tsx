'use client'
import React from 'react'
import ResponsiveDialog from '@/components/responsive-dialog'
import {trpc} from '@/trpc/client'
import {z} from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Textarea} from '@/components/ui/textarea'
import {Button} from '@/components/ui/button'
import {toast} from 'sonner'
import {useTranslations} from 'next-intl'

interface Props {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    prompt: z.string().min(10),
})

export default function ThumbnailGenerateModal({ videoId, open, onOpenChange }: Props) {
    const t = useTranslations('studio.thumbnailGenerateModal')
    const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
        onSuccess() {
            toast.success(t('success'),{ description: t('successDesc')})
            form.reset()
            onOpenChange(false)
        },
        onError(e) {
            toast.error(t('error'))
            console.log(e)
        }
    })
    const onSubmit = (value: z.infer<typeof formSchema>) => {
        generateThumbnail.mutate({
            prompt: value.prompt,
            id: videoId
        })
        onOpenChange(false);
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });
    return (
        <ResponsiveDialog onOpenChange={onOpenChange} open={open} title={t('title')}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <FormField control={form.control} name="prompt" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('label')}</FormLabel>
                            <FormControl>
                                <Textarea {...field} className="resize-none" cols={30} rows={5} placeholder={t('placeholder')}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={generateThumbnail.isPending}
                        >
                            {t('button')}
                        </Button>
                    </div>
                </form>
            </Form>
        </ResponsiveDialog>
    )
}
