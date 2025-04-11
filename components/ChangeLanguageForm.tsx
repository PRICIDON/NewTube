'use client'
import React, {useTransition} from 'react'
import {Form, FormField} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useLocale} from "next-intl";
import {useForm} from "react-hook-form";
import {changeLanguageSchema, TypeChangeLanguageSchema} from "@/schemas/change-language.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {setLanguage} from "@/lib/i18n/language";

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
                    <Select
                        onValueChange={value => {
                            field.onChange(value)
                            form.handleSubmit(onSubmit)()
                        }}
                        value={field.value}
                    >
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue
                                placeholder={"Русский"}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(languages).map(
                                ([code, name]) => (
                                    <SelectItem
                                        key={code}
                                        value={code}
                                        disabled={isPending}
                                    >
                                        {name}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                )}
            />
        </Form>
    )
}
