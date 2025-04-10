'use client'

import { UserProfile } from '@clerk/nextjs'
import {useTranslations} from "next-intl";

const DotIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  )
}

const Appearance = () => {
  return (
    <div>
      <h1>Custom page</h1>
      <p>This is the content of the custom page.</p>
    </div>
  )
}

const UserProfilePage = () => {
    const t = useTranslations("settings")

    return (
      <UserProfile path="/settings" routing="path">
        <UserProfile.Page label={t("label")} labelIcon={<DotIcon />} url="appearance">
          <Appearance />
        </UserProfile.Page>
      </UserProfile>
    )
}

export default UserProfilePage
