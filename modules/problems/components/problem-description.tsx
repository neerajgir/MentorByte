import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { ExampleSection } from "./example-section";
import { ConstraintsSection } from "./constraint-section";

export function ProblemDescription({ problem }: any) {

  console.log(problem?.examples)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          Problem Description
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <p className="text-foreground leading-relaxed">
            {problem?.description}
          </p>
          {
            Object.values(problem?.examples).map((example:any , index:number)=>(

              <ExampleSection example={example} index={index}/>
            ))
          }
          <ConstraintsSection constraints={problem?.constraints}/>
        </div>
      </CardContent>
    </Card>
  );
}