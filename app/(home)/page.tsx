import {HydrateClient, trpc} from "@/trpc/server";
import Client from "@/app/(home)/client";
import {Suspense} from "react";
import { ErrorBoundary } from 'react-error-boundary'

export default async function Home() {
    void trpc.hello.prefetch({ text: "Antonio2"})

    return (
        <HydrateClient>
            <Suspense fallback={<p>Loading...</p>}>
                <ErrorBoundary fallback={<p>Error...</p>}>
                    <Client/>
                </ErrorBoundary>
            </Suspense>
        </HydrateClient>
    );
}
