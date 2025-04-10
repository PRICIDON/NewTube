"use server"

import {cookies} from "next/headers";
import {COOKIE_NAME, defaultLanguage, type Language} from "@/lib/i18n/config";

export async function getCurrentLanguage() {
    const cookieStore = await cookies()

    return cookieStore.get(COOKIE_NAME)?.value ?? defaultLanguage
}


export async function setLanguage(language: Language) {
    const cookieStore = await cookies()

    return cookieStore.set(COOKIE_NAME, language)
}
