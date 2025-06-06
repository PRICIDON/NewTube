import React from 'react'
import {SidebarProvider} from "@/components/ui/sidebar";
import {Navbar} from "@/components/navbar/navbar";
import SSidebar from "@/components/sidebar/sidebar";

interface LayoutProps {
    children: React.ReactNode;
}

export const dynamic = "force-dynamic";

export default function HomeLayout({ children }: LayoutProps) {
    return (
        <SidebarProvider>
            <div className="w-full">
                <Navbar/>
                <div className="flex min-h-screen pt-[4rem]">
                    <SSidebar/>
                    <main className="flex-1 overflow-y-auto">{children}</main>
                </div>
            </div>
        </SidebarProvider>
    )
}
