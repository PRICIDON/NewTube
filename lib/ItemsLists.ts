import {
    FlameIcon,
    HistoryIcon,
    HomeIcon,
    ListVideoIcon,
    LogOutIcon,
    PlaySquareIcon,
    ThumbsUpIcon,
    VideoIcon
} from "lucide-react";

export const items = {
    home:[
        {
            title: "Home",
            url: "/",
            icon: HomeIcon
        },
        {
            title: "Subscriptions",
            url: "/feed/subscriptions",
            icon: PlaySquareIcon,
            auth: true
        },
        {
            title: "Trending",
            url: "/feed/trending",
            icon: FlameIcon,
        },
    ],
    homeYou: [
        {
            title: "History",
            url: "/playlists/history",
            icon: HistoryIcon,
            auth: true
        },
        {
            title: "Liked videos",
            url: "/playlists/liked",
            icon: ThumbsUpIcon,
            auth: true
        },
        {
            title: "All playlists",
            url: "/playlists",
            icon: ListVideoIcon,
            auth: true
        },
    ],
    studio: [
        {
            title: "Content",
            url: "/studio",
            icon: VideoIcon,
        },
        {
            title: "Exit studio",
            url: "/",
            icon: LogOutIcon,
            auth: true
        }
    ]
}
