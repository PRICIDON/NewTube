import React from 'react'
import {Button, ButtonProps} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import {useTranslations} from 'next-intl'

interface SubscriptionButton {
    onClick: ButtonProps['onClick']
    disabled: boolean
    isSubscribed: boolean
    className?: string
    size?: ButtonProps['size']
}

export default function SubscriptionButton({ onClick, size, isSubscribed, disabled, className }: SubscriptionButton) {
    const t = useTranslations('subscriptions')
    return (
        <Button size={size} onClick={onClick} variant={isSubscribed ? "secondary" : 'default'} disabled={disabled} className={cn("rounded-full", className)}>
            {isSubscribed ? t('unsubscribe') : t('subscribe')}
        </Button>
    )
}
