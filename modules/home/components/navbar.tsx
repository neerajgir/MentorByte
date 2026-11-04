"use client";

import { UserRole } from "@/lib/generated/client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

export const Navbar = ({ userRole }: any) => {
  const [mounted, setMounted] = useState(false);

  // Delay rendering auth buttons until the client is fully hydrated
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-200 hover:bg-white/15 dark:hover:bg-black/15">
        <div className="px-6 py-4 flex justify-between items-center">
          <Link href={"/"} className="flex items-center gap-2">
            <Image src={"/logo.svg"} alt="MentorByte" width={42} height={42} />
            <span className="font-bold text-1xl tracking-widest text-amber-600">
              MentorByte
            </span>
          </Link>

          <div className="flex flex-row items-center justify-center gap-x-4">
            <Link href="/problems" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400">Problems</Link>
            <Link href="/about" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400">About</Link>
            <Link href="/profile" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400">Profile</Link>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />
            
            {/* Render buttons only after the client handles initial mount */}
            {mounted ? (
              <>
                {/* Core 3 Authentication Check */}
                <Show when="signed-in">
                  {userRole && userRole === UserRole.ADMIN && (
                    <Link href={"/create-problem"}>
                      <Button variant={"outline"} size={"default"}>Create Problem</Button>
                    </Link>
                  )}
                  <UserButton />
                </Show>

                {/* Core 3 Authentication Check */}
                <Show when="signed-out">
                  <SignInButton />
                  <SignUpButton>
                    <Button size="sm" className="text-sm font-medium bg-amber-400 hover:bg-amber-500 text-white">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </Show>
              </>
            ) : (
              /* A stable placeholder/skeleton matching the button sizes to avoid visual layout layout shifting */
              <div className="w-20 h-9 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-md" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
