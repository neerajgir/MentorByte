"use client";

import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DIFFICULTY_OPTIONS } from "../../schema";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { problemSchema } from "@/modules/problems/schema";

type ProblemFormData = z.infer<typeof problemSchema>;

interface BasicInfoSectionProps {
  form: UseFormReturn<ProblemFormData>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TitleField register={register} error={errors.title} />
      <DescriptionField register={register} error={errors.description} />
      <DifficultyField control={control} error={errors.difficulty} />
    </div>
  );
}

interface FieldProps {
  register: any;
  error?: any;
}

interface DifficultyFieldProps {
  control: any;
  error?: any;
}

function TitleField({ register, error }: FieldProps) {
  return (
    <div className="md:col-span-2">
      <Label htmlFor="title" className="text-lg font-semibold">
        Title
      </Label>
      <Input
        id="title"
        {...register("title")}
        placeholder="Enter problem title"
        className="mt-2 text-lg"
      />
      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}

function DescriptionField({ register, error }: FieldProps) {
  return (
    <div className="md:col-span-2">
      <Label htmlFor="description" className="text-lg font-semibold">
        Description
      </Label>
      <Textarea
        id="description"
        {...register("description")}
        placeholder="Enter problem description"
        className="mt-2 min-h-32 text-base resize-y"
      />
      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}

function DifficultyField({ control, error }: DifficultyFieldProps) {
  return (
    <div>
      <Label htmlFor="difficulty" className="text-lg font-semibold">
        Difficulty
      </Label>
      <Controller
        name="difficulty"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <Badge variant="secondary" className={option.className}>
                    {option.label}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}