"use client";

import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AdditionalInfoSection({ form }) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card className="bg-amber-50 dark:bg-amber-950/20">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          Additional Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ConstraintsField register={register} error={errors.constraints} />
        <HintsField register={register} />
        <EditorialField register={register} />
      </CardContent>
    </Card>
  );
}

function ConstraintsField({ register, error }) {
  return (
    <div>
      <Label className="font-medium">Constraints</Label>
      <Textarea
        {...register("constraints")}
        placeholder="Enter problem constraints"
        className="mt-2 min-h-24 resize-y font-mono"
      />
      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}

function HintsField({ register }) {
  return (
    <div>
      <Label className="font-medium">Hints (Optional)</Label>
      <Textarea
        {...register("hints")}
        placeholder="Enter hints for solving the problem"
        className="mt-2 min-h-24 resize-y"
      />
    </div>
  );
}

function EditorialField({ register }) {
  return (
    <div>
      <Label className="font-medium">Editorial (Optional)</Label>
      <Textarea
        {...register("editorial")}
        placeholder="Enter problem editorial/solution explanation"
        className="mt-2 min-h-32 resize-y"
      />
    </div>
  );
}