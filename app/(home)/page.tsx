import {HydrateClient, trpc} from "@/trpc/server";
import CategorySection from "@/components/categories/category-section";
import React from "react";
import {getTranslations} from "next-intl/server";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{categoryId?: string}>
}

export default async function Home({searchParams}: PageProps) {
    const { categoryId } = await searchParams;
    const t = await getTranslations("layouts.main")
    void trpc.categories.getMany.prefetch()

    return (
        <HydrateClient>
            <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
                <CategorySection categoryId={categoryId} />
                {t("title")}
            </div>
        </HydrateClient>
    );
}
