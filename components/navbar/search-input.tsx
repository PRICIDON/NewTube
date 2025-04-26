'use client'
import React, {useState} from 'react'
import {SearchIcon, XIcon} from 'lucide-react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Button} from '@/components/ui/button'
import {APP_URL} from '@/lib/constants'
import {useTranslations} from 'next-intl'

export default function SearchInput() {
    const t = useTranslations("navbar")
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const [value, setValue] = useState(query)
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const url = new URL("/search", APP_URL)
        const newQuery = value.trim()
        url.searchParams.set("query", encodeURIComponent(newQuery))

        if (categoryId) {
            url.searchParams.set("categoryId", categoryId)
        }

        if(newQuery === "") {
            url.searchParams.delete("query")
        } else {
            setValue(newQuery)
            router.push(url.href)
        }

    }
    return (
        <form className="flex w-full max-w-[600px]" onSubmit={handleSearch}>
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder={t('search')}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className="pl-4 w-full py-2 pr-12 rounded-l-full focus:outline-none focus:border-blue-500 border"
                />
                {value && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => setValue("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full">
                        <XIcon className="text-gray-500" />
                    </Button>
                )}
            </div>
            <button
                disabled={!value.trim()}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-secondary dark:hover:bg-secondary border-l-0 rounded-r-full disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
            >
                <SearchIcon className="size-5" />
            </button>
        </form>
    )
}
