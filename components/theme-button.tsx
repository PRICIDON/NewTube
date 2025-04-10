'use client'
import React from 'react'
import {Button} from "@/components/ui/button";
import {useTheme} from "next-themes";
import {Moon, Sun} from "lucide-react";

export default function ThemeButton() {
    const { theme, setTheme } = useTheme();
    return (
        <Button
            onClick={() => {
                if(theme === "light") {
                    setTheme("dark");
                } else {
                    setTheme("light");
                }
            }}
        >
            {theme === "light" ? <Sun /> : <Moon />}
        </Button>
    )
}
