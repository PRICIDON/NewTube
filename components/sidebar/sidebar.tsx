'use client'
import React from 'react'
import {Sidebar, SidebarContent} from "./../ui/sidebar";
import {Separator} from "@/components/ui/separator";
import Section from "@/components/sidebar/section";
import {cn} from "@/lib/utils";
import {items} from "@/lib/ItemsLists";


export default function SSidebar({studio}: {studio?: boolean}) {
    return (
        <Sidebar className={cn("pt-16 z-40", !studio && "border-none")} collapsible="icon">
            <SidebarContent className="bg-background">
                {studio ?
                    (
                        <Section items={items.studio} studio/>
                    )
                    :
                    (
                        <>
                            <Section items={items.home} />
                            <Separator />
                            <Section items={items.homeYou} label="You" />
                        </>
                    )
                }
            </SidebarContent>
        </Sidebar>
    )
}
