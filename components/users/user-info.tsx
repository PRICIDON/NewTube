import React from 'react'
import {cva, VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

const userInfoVariants = cva("flex items-center gap-1", {
    variants: {
        size: {
            default: "[&_p]:text-sm [&_svg]:size-4",
            lg: "[&_p]:text-base [&_svg]:size-5 [&_p]:font-medium [&_p]:text-black",
            sm: "[&_p]:text-xs [&_svg]:size-3.5",
        }
    },
    defaultVariants: {
        size: "default"
    }
})

interface UserInfo extends VariantProps<typeof userInfoVariants>{
    name: string
    className?: string
}

export default function UserInfo({ name, className, size }: UserInfo) {

    return (
        <div className={cn(userInfoVariants({ size, className}))}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <p className="text-gray-500 hover:text-gray-800 dark:text-muted-foreground dark:hover:text-white line-clamp-1">
                        {name}
                    </p>
                </TooltipTrigger>
                <TooltipContent align="center" className="bg-black/70 dark:bg-white">
                    <p>
                        {name}
                    </p>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}
