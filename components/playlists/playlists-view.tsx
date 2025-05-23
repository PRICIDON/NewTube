'use client'
import React, {useState} from 'react'
import {Button} from '@/components/ui/button'
import {PlusIcon} from 'lucide-react'
import PlaylistCreateModal from '@/components/playlists/playlist-create-modal'
import PlaylistsSection from '@/components/playlists/section/playlists-section'
import {useTranslations} from 'next-intl'

export default function PlaylistsView() {
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const t = useTranslations('playlists')
    return (
        <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
            <PlaylistCreateModal onOpenChange={setCreateModalOpen} open={createModalOpen}/>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{t('title')}</h1>
                    <p className="text-xs text-muted-foreground">{t('description')}</p>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setCreateModalOpen(true)}
                >
                    <PlusIcon/>
                </Button>
            </div>
            <PlaylistsSection />
        </div>
    )
}
