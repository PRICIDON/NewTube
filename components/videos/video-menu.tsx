import React, {useState} from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
    ListPlusIcon,
    MoreVerticalIcon,
    ShareIcon,
    Trash2Icon
} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {toast} from 'sonner'
import {APP_URL} from '@/lib/constants'
import PlaylistAddModal from '@/components/playlists/playlist-add-modal'
import {useTranslations} from 'next-intl'

interface VideoMenuProps {
    videoId: string;
    variant?: 'ghost' | 'secondary'
    onRemove?: () => void;
}

export default function VideoMenu({ videoId, variant = "ghost", onRemove }: VideoMenuProps) {
    const t = useTranslations('video')
    const [openPlaylistAddModal, setOpenPlaylistAddModal] = useState(false)
    const onShare = () => {
        const fullUrl = `${APP_URL}/videos/${videoId}`
        navigator.clipboard.writeText(fullUrl)
        toast.success(t('success'))
    }

    return (
        <>
            <PlaylistAddModal open={openPlaylistAddModal} onOpenChange={setOpenPlaylistAddModal} videoId={videoId} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={variant} size="icon" className="rounded-full">
                        <MoreVerticalIcon/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={e=>e.stopPropagation()}>
                    <DropdownMenuItem onClick={onShare}>
                        <ShareIcon className="mr-2 size-4" />
                        {t('share')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenPlaylistAddModal(true)}>
                        <ListPlusIcon className="mr-2 size-4" />
                        {t('playlist')}
                    </DropdownMenuItem>
                    {onRemove && (
                    <DropdownMenuItem onClick={onRemove}>
                        <Trash2Icon className="mr-2 size-4" />
                        {t('remove')}
                    </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
