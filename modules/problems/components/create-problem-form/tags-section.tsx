"use client";

import { Plus, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { problemSchema } from "@/modules/problems/schema";

type ProblemFormData = z.infer<typeof problemSchema>;

interface TagsSectionProps {
  form: UseFormReturn<ProblemFormData>;
  tagsArray: any;
}

export function TagsSection({ form, tagsArray }: TagsSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const { fields, append, remove } = tagsArray;

  return (
    <Card className="bg-amber-50 dark:bg-amber-950/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            Tags
          </CardTitle>
          <Button
            type="button"
            size="sm"
            onClick={() => append("")}
            className="gap-2"
          >
            <Plus className="w-4 h-4" /> Add Tag
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((field: any, index: number) => (
            <TagItem
              key={field.id}
              index={index}
              register={register}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
            />
          ))}
        </div>
        {errors.tags && (
          <p className="text-sm text-red-500 mt-2">{errors.tags.message}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface TagItemProps {
  index: number;
  register: any;
  onRemove: () => void;
  canRemove: boolean;
}

function TagItem({ index, register, onRemove, canRemove }: TagItemProps) {
  return (
    <div className="flex gap-2 items-center">
      <Input
        {...register(`tags.${index}`)}
        placeholder="Enter tag"
        className="flex-1"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        disabled={!canRemove}
        className="p-2"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </Button>
    </div>
  );
}