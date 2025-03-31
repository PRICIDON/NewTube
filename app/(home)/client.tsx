"use client"

import { trpc } from "@/trpc/client";

import React from 'react'

export default function Client() {
    const [data] = trpc.hello.useSuspenseQuery({
        text: "Antonio"
    })
    return (
        <div>
            Page client says: {data.greeting}
        </div>
    )
}
