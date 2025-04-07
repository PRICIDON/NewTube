"use client"

import React, {Suspense, useState} from 'react'
import {trpc} from "@/trpc/client";
import {ErrorBoundary} from "react-error-boundary";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {
    CopyCheckIcon,
    CopyIcon,
    Globe2Icon,
    ImagePlusIcon, Loader2Icon,
    LockIcon,
    MoreVerticalIcon, RotateCcwIcon,
    SparklesIcon,
    TrashIcon
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod"
import {videoUpdateSchema} from "@/db/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import VideoPlayer from "@/components/videos/player/dynamic-mux-player";
import Link from "next/link";
import {snakeCaseToTitle} from "@/lib/utils";
import Image from "next/image";
import ThumbnailUploadModal from "@/components/studio/thumbnail-upload-modal";
import { Skeleton } from '../ui/skeleton';
import ThumbnailGenerateModal from "@/components/studio/thumbnail-generate-modal";

interface FormSectionProps {
    videoId: string
}

function FormSectionSuspense({ videoId }: FormSectionProps) {
    const fullUrl = `${process.env.VERCEL_URL || "http://localhost:3000"}/videos/${videoId}`;
    const [isCopied, setIsCopied] = useState(false)
    const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false)
    const [thumbnailGenerateModalOpen, setThumbnailGenerateModalOpen] = useState(false)
    const onCopy = async () => {
        await navigator.clipboard.writeText(fullUrl);
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }
    const router = useRouter();
    const utils = trpc.useUtils()
    const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId })
    const [categories] = trpc.categories.getMany.useSuspenseQuery()
    const update = trpc.videos.update.useMutation({
        onSuccess() {
            utils.studio.getMany.invalidate()
            utils.studio.getOne.invalidate({ id: videoId })
            router.push("/studio")
            toast.success("Video updated successfully.")
        },
        onError(e) {
            toast.error("Something went wrong")
            console.log(e)
        }
    })
    const remove = trpc.videos.remove.useMutation({
        onSuccess() {
            utils.studio.getMany.invalidate()
            router.push("/studio")
            toast.success("Video removed successfully.")
        },
        onError(e) {
            toast.error("Something went wrong")
            console.log(e)
        }
    })
    const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
        onSuccess() {
            utils.studio.getMany.invalidate()
            utils.studio.getOne.invalidate({ id: videoId })
            toast.success("Thumbnail restored successfully.")
        },
        onError(e) {
            toast.error("Something went wrong")
            console.log(e)
        }
    })
    const generateTitle = trpc.videos.generateTitle.useMutation({
        onSuccess() {
            toast.success("Background job started",{ description: "This may take some time" ,})
        },
        onError(e) {
            toast.error("Something went wrong")
            console.log(e)
        }
    })
    const generateDescription = trpc.videos.generateDescription.useMutation({
        onSuccess() {
            toast.success("Background job started",{ description: "This may take some time" ,})
        },
        onError(e) {
            toast.error("Something went wrong")
            console.log(e)
        }
    })
    const form = useForm<z.infer<typeof videoUpdateSchema>>({
        defaultValues: video,
        resolver: zodResolver(videoUpdateSchema),
    })

    const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
       await update.mutateAsync(data)
    }

    return (
        <>
            <ThumbnailUploadModal open={thumbnailModalOpen} onOpenChange={setThumbnailModalOpen} videoId={videoId} />
            <ThumbnailGenerateModal open={thumbnailGenerateModalOpen} onOpenChange={setThumbnailGenerateModalOpen} videoId={videoId} />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="">
                            <h1 className="text-2xl font-bold">Video details</h1>
                            <p className="text-xs text-muted-foreground">Manage your video details</p>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <Button type="submit" disabled={update.isPending || !form.formState.isDirty}>Save</Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVerticalIcon />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => remove.mutate({id: videoId})}>
                                        <TrashIcon className="size-4 mr-2"/>
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="space-y-8 lg:col-span-3">
                            <FormField control={form.control} name="title" render={({field}) => (
                                <FormItem >
                                    <FormLabel>
                                        <div className="flex gap-x-2 items-center">
                                            Title
                                            <Button
                                                size="icon"
                                                type="button"
                                                variant="outline"
                                                className="rounded-full size-6 [&_svg]:size-3"
                                                onClick={() => generateTitle.mutate({ id: videoId })}
                                                disabled={generateTitle.isPending || !video.muxTrackId}
                                            >
                                                {generateTitle.isPending
                                                    ? <Loader2Icon className="animate-spin"/>
                                                    : <SparklesIcon />

                                                }
                                            </Button>
                                        </div>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Add a title to your video" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="description" render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                       <div className="flex gap-x-2 items-center">
                                            Description
                                            <Button
                                                size="icon"
                                                type="button"
                                                variant="outline"
                                                className="rounded-full size-6 [&_svg]:size-3"
                                                onClick={() => generateDescription.mutate({ id: videoId })}
                                                disabled={generateDescription.isPending || !video.muxTrackId}
                                            >
                                                {generateDescription.isPending
                                                    ? <Loader2Icon className="animate-spin"/>
                                                    : <SparklesIcon />

                                                }
                                            </Button>
                                        </div>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea {...field} value={field.value ?? ""} rows={10} className="resize-none pr-10" placeholder="Add a description to your video" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="thumbnailUrl" render={() => (
                                <FormItem>
                                    <FormLabel>Thumbnail</FormLabel>
                                    <FormControl>
                                        <div className="p-.5 border border-dashed border-neutral-400 relative h-[84px] w-[153px] group">
                                            <Image src={video.thumbnailUrl ?? "/placeholder.svg"} fill alt="thumbnail" className="object-cover"/>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        className="bg-black/50 hover:bg-black/50 absolute top-1 right-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 size-7"
                                                    >
                                                        <MoreVerticalIcon className="text-white" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start" side="right">
                                                    <DropdownMenuItem onClick={() => setThumbnailModalOpen(true)}>
                                                        <ImagePlusIcon className="size-4 mr-1"/>
                                                        Change
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setThumbnailGenerateModalOpen(true)}>
                                                        <SparklesIcon className="size-4 mr-1"/>
                                                        AI-generated
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => restoreThumbnail.mutate({ id: videoId })}>
                                                        <RotateCcwIcon className="size-4 mr-1"/>
                                                        Restore
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="categoryId" render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Category
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map(category => (
                                                <SelectItem value={category.id} key={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <div className="flex flex-col lg:col-span-2">
                            <div className="flex flex-col gap-4 bg-[#f9f9f9] rounded-xl overflow-hidden h-fit">
                                <div className="aspect-video overflow-hidden relative">
                                    <VideoPlayer playbackId={video.muxPlaybackId!} thumbnailUrl={video.thumbnailUrl!}/>
                                </div>
                                <div className="p-4 flex flex-col gap-y-6">
                                    <div className="flex justify-between items-center gap-x-2">
                                        <div className="flex flex-col gap-y-1">
                                            <p className="text-xs text-muted-foreground">
                                                Video link
                                            </p>
                                            <div className="flex items-center gap-x-2">
                                                <Link href={`/videos/${videoId}`}>
                                                    <p className="line-clamp-1 text-sm text-blue-500">
                                                        {fullUrl}
                                                    </p>
                                                </Link>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="shrink-0"
                                                    onClick={onCopy}
                                                    disabled={isCopied}
                                                >
                                                    {isCopied ? <CopyCheckIcon/> : <CopyIcon />}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-y-1">
                                            <p className="text-muted-foreground text-xs">
                                                Video status
                                            </p>
                                            <p className="text-sm">
                                                {snakeCaseToTitle(video.muxStatus || "preparing")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-y-1">
                                            <p className="text-muted-foreground text-xs">
                                                Subtitles status
                                            </p>
                                            <p className="text-sm">
                                                {snakeCaseToTitle(video.muxTrackStatus || "no_subtitles")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <FormField control={form.control} name="visibility" render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Visibility
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a visibility" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="public">
                                                <div className="flex items-center">
                                                    <Globe2Icon className="size-4 mr-2"/>
                                                    Public
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="private">
                                                <div className="flex items-center">
                                                    <LockIcon className="size-4 mr-2"/>
                                                    Private
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default function FormSection({ videoId }: FormSectionProps) {
    return (
        <Suspense fallback={<FormSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <FormSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}

function FormSectionSkeleton() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-32"/>
                    <Skeleton className="h-4 w-40"/>
                </div>
                <Skeleton className="h-9 w-24"/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="space-y-8 lg:col-span-3">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-16"/>
                        <Skeleton className="h-10 w-full"/>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24"/>
                        <Skeleton className="h-[220px] w-full"/>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20"/>
                        <Skeleton className="h-[84px] w-[153px]"/>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20"/>
                        <Skeleton className="h-10 w-full"/>
                    </div>
                </div>
                <div className="flex flex-col gap-y-8 lg:col-span-2">
                    <div className="flex flex-col gap-4 bg-[#f9f9f9] rounded-xl overflow-hidden h-fit">
                        <Skeleton className="aspect-video"/>
                        <div className="p-4 space-y-6">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24"/>
                                <Skeleton className="h-5 w-full"/>
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24"/>
                                <Skeleton className="h-5 w-32"/>
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24"/>
                                <Skeleton className="h-5 w-32"/>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                                <Skeleton className="h-5 w-20"/>
                                <Skeleton className="h-10 w-full"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

