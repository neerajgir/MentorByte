import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserRole } from "@/lib/generated/client";
import { getCurrentUserData } from "@/modules/auth/actions";
import { CreateProblemForm } from "@/modules/problems/components/create-problem-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const CreateProblemPage = async () => {
  const user = await getCurrentUserData();
  // @ts-ignore
  if (user?.role !== UserRole.ADMIN) {
    redirect("/");
  }
  return (
    <section className="flex flex-col items-center justify-center mx-4 my-4">
      <div className="flex flex-row justify-between items-center w-full">
        <Link href={"/"}>
          <Button variant={"outline"} size={"icon"}>
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-amber-500">
          Welcome {user?.firstName}! Create a Problem
        </h1>
        <ModeToggle />
      </div>
      <CreateProblemForm/>
    </section>
  );
};

export default CreateProblemPage;
