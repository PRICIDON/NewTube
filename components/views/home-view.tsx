import React from 'react'
import CategorySection from "@/components/categories/category-section";

interface HomeViewProps {
    categoryId?: string;
}

export default function HomeView({ categoryId }: HomeViewProps) {
    return (
        <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
            <CategorySection categoryId={categoryId} />
        </div>
    )
}
