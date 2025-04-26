'use client'
import {SidebarTrigger} from '@/components/ui/sidebar'
import Link from 'next/link'
import Image from 'next/image'
import SearchInput from './search-input'
import AuthButton from '@/components/auth/auth-button'
import StudioUploadModal from '@/components/studio/StudioUploadModal'
import ThemeButton from '@/components/theme-button'

export const Navbar = ({ studio} : { studio?: boolean}) => {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-background flex items-center px-2 pr-5 z-50">
            <div className="flex items-center gap-4 w-full">
                {/* Menu and Logo */}
                <div className="flex items-center flex-shrink-0">
                    <SidebarTrigger/>
                    
                        <Link href={studio ? "/studio" : "/"} className="hidden md:block">
                            <div className="p-4 flex items-center gap-1">
                                <Image src="/logo.svg" alt="logo" width={32} height={32} />
                                <p className="text-xl font-semibold tracking-tight">{studio ? "Studio" : "NewTube"}</p>
                            </div>
                        </Link>
                </div>
                {studio ? (
                  <div className="flex-1"/>
                ) : (
                  <div className="flex-1 flex justify-center max-w-[720px] mx-auto">
                      <SearchInput/>
                  </div>
                )}
                <div className="flex-shrink-0 items-center flex gap-4">
                    {studio ? <StudioUploadModal/> : <ThemeButton />}
                    <AuthButton />
                </div>
            </div>
        </nav>
    )
}
