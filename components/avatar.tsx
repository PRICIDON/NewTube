import {cva, type VariantProps} from "class-variance-authority";

const avatarVariants = cva("", {
    variants: {
        size: {
            default: "size-9",
            xs: "size-4",
            sm: "size-6",
            lg: "size-10",
            xl: "size-[160px]",
        }
    },
    defaultVariants: {
        size: "default"
    }
})

interface AvatarProps extends VariantProps<typeof avatarVariants>  {
    imageUrl: string
    name: string
    className?: string
    onClick?: () => void
}

import React from 'react'
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";

export default function UserAvatar({ imageUrl, name, onClick, className, size }: AvatarProps) {
    return (
        <Avatar className={cn(avatarVariants({ size, className}))} onClick={onClick}>
            <AvatarImage src={imageUrl} alt={name}></AvatarImage>
        </Avatar>
    )
}
