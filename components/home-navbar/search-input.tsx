import React from 'react'
import {SearchIcon} from "lucide-react";

export default function SearchInput() {
    return (
        <form className="flex w-full max-w-[600px]">
            <div className="relative w-full">
                <input type="text" placeholder="Search" className="pl-4 w-full py-2 pr-12 rounded-l-full focus:outline-none focus:border-blue-500 border" />
            </div>
            <button className="px-5 py-2.5 bg-gray-100 border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" type="submit">
                <SearchIcon className="size-5" />
            </button>
        </form>
    )
}
