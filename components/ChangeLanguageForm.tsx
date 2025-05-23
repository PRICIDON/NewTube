'use client'
import React, {useTransition} from 'react'
import {Form, FormField, FormItem} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {useLocale} from 'next-intl'
import {useForm} from 'react-hook-form'
import {
	changeLanguageSchema,
	TypeChangeLanguageSchema
} from '@/schemas/change-language.schema'
import {zodResolver} from '@hookform/resolvers/zod'
import {setLanguage} from '@/lib/i18n/language'

const languages = {
	ru: 'Русский',
	en: 'English'
}

export default function ChangeLanguageForm() {
    const locale = useLocale()
    const [isPending, startTransition] = useTransition()
    const form = useForm<TypeChangeLanguageSchema>({
		resolver: zodResolver(changeLanguageSchema),
		values: {
			language: locale as TypeChangeLanguageSchema['language']
		}
	})

    function onSubmit(data: TypeChangeLanguageSchema) {
		startTransition(async () => {
			try {
				await setLanguage(data.language)
			} catch (error) {
				console.log(error)
			}
		})
	}

    return (
        <Form {...form}>
            <FormField
                control={form.control}
                name='language'
                render={({ field }) => (
                    <FormItem>
                        <Select
                            onValueChange={value => {
                                field.onChange(value)
                                form.handleSubmit(onSubmit)()
                            }}
                            value={field.value}
                        >
                            <SelectTrigger className='w-[180px] outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              <div className="z-50 rounded-md shadow-md">
                                {Object.entries(languages).map(([code, name]) => (
                                  <SelectItem key={code} value={code} disabled={isPending}>
                                    {name}
                                  </SelectItem>
                                ))}
                              </div>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
            />
        </Form>
    )
}
