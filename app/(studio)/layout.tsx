import React from 'react'
import {SidebarProvider} from '@/components/ui/sidebar'
import {Navbar} from '@/components/navbar/navbar'
import type {Metadata} from 'next'
import Sidebar from '@/components/sidebar/sidebar'
import {getTranslations} from 'next-intl/server'

interface LayoutProps {
    children: React.ReactNode;
}

export function generateMetadata(): Metadata {
  const t = getTranslations("studio")
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function HomeLayout({ children }: LayoutProps) {
    return (
        <SidebarProvider>
            <div className="w-full">
                <Navbar studio/>
                <div className="flex min-h-screen pt-[4rem]">
                    <Sidebar studio/>
                    <main className="flex-1 overflow-y-auto">{children}</main>
                </div>
            </div>
        </SidebarProvider>
    )
}
