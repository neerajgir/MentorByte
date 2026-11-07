import { ModeToggle } from "@/components/ui/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getDifficultyColor } from "../constant";

export function ProblemHeader({ problem }: any) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{problem?.title}</h1>
          <Badge
            className={cn(
              "font-medium",
              getDifficultyColor(problem?.difficulty),
            )}
          >
            {problem?.difficulty}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {problem?.tags.map((tag:string) => (
            <Badge key={tag} variant="outline" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <ModeToggle />
    </div>
  );
}