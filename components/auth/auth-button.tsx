'use client'
import React from 'react'
import {Button} from '@/components/ui/button'
import {ClapperboardIcon, UserCircleIcon, UserIcon} from 'lucide-react'
import {SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/nextjs'
import {useTranslations} from 'next-intl'


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
                    <UserButton.MenuItems>
                        <UserButton.Link href="/users/current" label="My profile" labelIcon={<UserIcon className="size-4"/>} />
                    </UserButton.MenuItems>
                    {/*<UserButton.UserProfilePage label={"Кастомизация"} labelIcon={<Palette className="size-4" />} url="appearence" >*/}
                    {/*  <div>*/}
                    {/*    <h1 className="font-bold text-md">Кастомизация</h1>*/}
                    {/*    <Separator className="mt-4 bg-gray-500" />*/}
                    {/*      <div className="mt-5 gap-y-2 flex flex-col">*/}
                    {/*          <h1 className="font-medium text-sm">Язык</h1>*/}
                    {/*          <ChangeLanguageForm/>*/}
                    {/*      </div>*/}
                    {/*  </div>*/}
                    {/*</UserButton.UserProfilePage>*/}
                </UserButton>
            </SignedIn>
        </>
    )
};
