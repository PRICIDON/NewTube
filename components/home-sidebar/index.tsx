'use client'
import React from 'react'
import {Sidebar, SidebarContent} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {FlameIcon, HistoryIcon, HomeIcon, ListVideoIcon, PlaySquareIcon, ThumbsUpIcon} from "lucide-react";
import Section from "@/components/home-sidebar/section";

const items = [
    {
        title: "Home",
        url: "/",
        icon: HomeIcon
    },
    {
        title: "Subscriptions",
        url: "/feed/subscriptions",
        icon: PlaySquareIcon,
        auth: true
    },
    {
        title: "Trending",
        url: "/feed/trending",
        icon: FlameIcon,
    },
]

const itemsYou = [
    {
        title: "History",
        url: "/playlists/history",
        icon: HistoryIcon,
        auth: true
    },
    {
        title: "Liked videos",
        url: "/playlists/liked",
        icon: ThumbsUpIcon,
        auth: true
    },
    {
        title: "All playlists",
        url: "/playlists",
        icon: ListVideoIcon,
        auth: true
    },
]

export default function HomeSidebar() {
    return (
        <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
            <SidebarContent className="bg-background">
                <Section items={items} />
                <Separator />
                <Section items={itemsYou} label="You" />
            </SidebarContent>
        </Sidebar>
    )
}
