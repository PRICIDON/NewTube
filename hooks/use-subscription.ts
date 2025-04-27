import {trpc} from '@/trpc/client'
import {useClerk} from '@clerk/nextjs'
import {toast} from 'sonner'
import {useTranslations} from 'next-intl'

interface UseSubscription {
    userId: string
    isSubscribed: boolean
    fromVideoId?: string
}

export const useSubscriptions = ({ userId, fromVideoId, isSubscribed }: UseSubscription) => {
    const t = useTranslations('subscriptions')
    const clerk = useClerk()
    const utils = trpc.useUtils()

    const subscribe = trpc.subscriptions.create.useMutation({
        onSuccess() {
            toast.success(t('successSub'))
            utils.videos.getSubscribed.invalidate()
            utils.users.getOne.invalidate({ id: userId})
            utils.subscriptions.getMany.invalidate()
            fromVideoId && utils.videos.getOne.invalidate({ id: fromVideoId})
            
        },
        onError(e) {
            toast.error(t('error'))
            if(e.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
        }
    })
    const unsubscribe = trpc.subscriptions.remove.useMutation({
        onSuccess() {
            toast.success(t('successUnsub'))
            utils.videos.getSubscribed.invalidate()
            utils.users.getOne.invalidate({ id: userId})
            utils.subscriptions.getMany.invalidate()
            fromVideoId && utils.videos.getOne.invalidate({ id: fromVideoId})
        },
        onError(e) {
             toast.error(t('error'))
            if(e.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
        }
    })

    const isPending = subscribe.isPending || unsubscribe.isPending

    const onClick = () => {
        if(isSubscribed) {
            unsubscribe.mutate({ userId })
        } else {
            subscribe.mutate({ userId })
        }
    }
    return {
        isPending,
        onClick,
    }
}
