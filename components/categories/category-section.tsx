"use client"
import React, {Suspense} from 'react'
import {trpc} from "@/trpc/client";
import {ErrorBoundary} from "react-error-boundary";
import FilterCarousel from "./filter-carousel";
import {useRouter} from "next/navigation";

interface CategorySectionProps {
    categoryId?: string;
}

export default function CategoriesSection({ categoryId }: CategorySectionProps) {
    return (
        <Suspense fallback={<FilterCarousel isLoading data={[]} onSelect={() => {}}/>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <CategoriesSectionSuspense categoryId={categoryId} />
            </ErrorBoundary>
        </Suspense>
    )
}

function CategoriesSectionSuspense({ categoryId }: CategorySectionProps) {
    const router = useRouter()
    const [categories] = trpc.categories.getMany.useSuspenseQuery()
    const data = categories.map(category => ({
        value: category.id,
        label: category.name,
    }))
    const onSelect = (value: string | null)=> {
        const url = new URL(window.location.href)
        if(value) {
            url.searchParams.set("categoryId", value)
        }
        if(value === "") {
            url.searchParams.delete("categoryId")
        }
        router.push(url.href)
    }

    return <FilterCarousel value={categoryId} data={data} onSelect={onSelect} />
}
