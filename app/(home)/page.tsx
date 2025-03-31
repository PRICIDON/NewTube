import {trpc} from "@/trpc/server";

export default async function Home() {
    const data = await trpc.hello({ text: "Antonio2"})

  return (
    <div className="">
      Client components says: { data.greeting }
    </div>
  );
}
