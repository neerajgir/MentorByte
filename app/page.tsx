import { onBoardUser } from "@/modules/auth/actions";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default async function Home() {
  await onBoardUser();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <UserButton/>
    </div>
  );
}
