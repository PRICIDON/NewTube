import React, {useEffect} from 'react'
import {useIntersectionObserver} from '@/hooks/useIntersectionObserver'
import {Button} from '@/components/ui/button'
import {useTranslations} from 'next-intl'

interface InfiniteScrollProps {
    isManual?: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
}

export default function InfiniteScroll({ isManual, fetchNextPage, isFetchingNextPage, hasNextPage }: InfiniteScrollProps) {
    const t = useTranslations("components.infiniteScroll")
    const {targetRef, isIntersecting } = useIntersectionObserver({
        threshold: 0.5,
        rootMargin: "100px"
    })
    
    useEffect(() => {
        if(isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
            fetchNextPage()
        }
    }, [isIntersecting, hasNextPage, isFetchingNextPage, isManual, fetchNextPage])

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <div ref={targetRef} className="h-1"/>
            {hasNextPage ? (
                <Button variant="secondary" disabled={!hasNextPage || isFetchingNextPage} onClick={fetchNextPage}>
                    {isFetchingNextPage ? t('loading') : t('next')}
                </Button>
            ): (
                <p className="text-xs text-muted-foreground">{t('end')}</p>
            )}
        </div>
    )
}
