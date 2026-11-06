"use client";

import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TestCasesSection({ form, testCasesArray }) {
  const {
    register,
    formState: { errors },
  } = form;

  const { fields, append, remove } = testCasesArray;

  return (
    <Card className="bg-green-50 dark:bg-green-950/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Test Cases
          </CardTitle>
          <Button
            type="button"
            size="sm"
            onClick={() => append({ input: "", output: "" })}
            className="gap-2"
          >
            <Plus className="w-4 h-4" /> Add Test Case
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field, index) => (
          <TestCaseCard
            key={field.id}
            index={index}
            register={register}
            errors={errors}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
          />
        ))}
        {errors.testCases && !Array.isArray(errors.testCases) && (
          <p className="text-sm text-red-500">{errors.testCases.message}</p>
        )}
      </CardContent>
    </Card>
  );
}

function TestCaseCard({ index, register, errors, onRemove, canRemove }) {
  return (
    <Card className="bg-background">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Test Case #{index + 1}</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            disabled={!canRemove}
            className="text-red-500 gap-2"
          >
            <Trash2 className="w-4 h-4" /> Remove
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="font-medium">Input</Label>
            <Textarea
              {...register(`testCases.${index}.input`)}
              placeholder="Enter test case input"
              className="mt-2 min-h-24 resize-y font-mono"
            />
            {errors.testCases?.[index]?.input && (
              <p className="text-sm text-red-500 mt-1">
                {errors.testCases[index].input.message}
              </p>
            )}
          </div>
          <div>
            <Label className="font-medium">Expected Output</Label>
            <Textarea
              {...register(`testCases.${index}.output`)}
              placeholder="Enter expected output"
              className="mt-2 min-h-24 resize-y font-mono"
            />
            {errors.testCases?.[index]?.output && (
              <p className="text-sm text-red-500 mt-1">
                {errors.testCases[index].output.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}