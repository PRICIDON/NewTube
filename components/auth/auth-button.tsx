"use client"
import React from 'react'
import {Button} from "@/components/ui/button";
import {ClapperboardIcon, UserCircleIcon} from "lucide-react";
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";
import {useTranslations} from "next-intl";

export default function AuthButton() {
    const t = useTranslations("studio")
    return (
        <>
            <SignedOut>
                <SignInButton mode="modal">
                    <Button
                        variant="outline"
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none [$_svg]:size-5"
                    >
                        <UserCircleIcon/>
                        Sign in
                    </Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton >
                    <UserButton.MenuItems>
                        <UserButton.Link href="/studio" label={t("name")} labelIcon={<ClapperboardIcon className="size-4"/>} />
                    </UserButton.MenuItems>
                </UserButton>
            </SignedIn>
        </>
    )
};
