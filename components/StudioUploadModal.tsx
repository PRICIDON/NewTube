'use client'
import React from 'react'
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";

export default function StudioUploadModal() {
    return (
        <Button variant="secondary" onClick={() => {}}>
            <PlusIcon className=""/>
            Create
        </Button>
    )
}
