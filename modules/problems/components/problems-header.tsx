"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";


export function ProblemsHeader({ onCreatePlaylist }:any) {

  console.log(onCreatePlaylist)

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Problems</h1>
        <p className="text-muted-foreground">
          Manage and solve coding problems
        </p>
      </div>
      <Button onClick={onCreatePlaylist} className="gap-2">
        <Plus className="h-4 w-4" />
        Create Playlist
      </Button>
    </div>
  );
}