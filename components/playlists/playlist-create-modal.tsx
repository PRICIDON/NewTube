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
import {Button} from '@/components/ui/button'
import {toast} from 'sonner'
import {Input} from '@/components/ui/input'
import {useTranslations} from 'next-intl'

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    name: z.string().min(1),
})

export default function PlaylistCreateModal({ open, onOpenChange }: Props) {
    const t = useTranslations('playlists.createModal')
    const utils = trpc.useUtils()
    const create = trpc.playlists.create.useMutation({
        onSuccess() {
            utils.playlists.getMany.invalidate()
            toast.success(t('success'))
            form.reset()
            onOpenChange(false)
        },
        onError(e) {
            toast.error(t('error'))
            console.log(e)
        }
    })
    const onSubmit = (value: z.infer<typeof formSchema>) => {
        create.mutate({
            name: value.name
        })
        onOpenChange(false);
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    });
    return (
        <ResponsiveDialog onOpenChange={onOpenChange} open={open} title={t('title')}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('label')}</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder={t('placeholder')}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={create.isPending}
                        >
                            {t('create')}
                        </Button>
                    </div>
                </form>
            </Form>
        </ResponsiveDialog>
    )
}
