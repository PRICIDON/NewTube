import React from 'react'
import ChangeLanguageForm from '@/components/ChangeLanguageForm'
import {useTranslations} from 'next-intl'

export default function Appearance() {
	const t = useTranslations("appearance")
	return (
		<div className="max-w-screen-md mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
			<div>
				<h1 className="text-2xl font-bold">{t('title')}</h1>
				<p className="text-xs text-muted-foreground">{t('description')}</p>
			</div>
			<div>
				<h1 className="text-lg font-bold mb-3">{t('label')}</h1>
				<ChangeLanguageForm/>
			</div>
		</div>
	)
}
