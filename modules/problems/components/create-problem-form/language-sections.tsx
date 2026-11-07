"use client";

import { Controller } from "react-hook-form";
import { Code2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { LANGUAGES } from "../../schema";
import { CodeEditor } from "./code-editor";
import {
  UseFormReturn,
  FieldErrors,
  FieldError,
  Control,
} from "react-hook-form";
import { z } from "zod";
import { problemSchema } from "@/modules/problems/schema";

type ProblemFormData = z.infer<typeof problemSchema>;
type Language = keyof ProblemFormData["codeSnippets"];

interface LanguageSectionsProps {
  form: UseFormReturn<ProblemFormData>;
}

export function LanguageSections({ form }: LanguageSectionsProps) {
  return (
    <>
      {LANGUAGES.map((language) => (
        <LanguageCard key={language} language={language} form={form} />
      ))}
    </>
  );
}

interface LanguageCardProps {
  language: Language;
  form: UseFormReturn<ProblemFormData>;
}

function LanguageCard({ language, form }: LanguageCardProps) {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <Card className="bg-slate-50 dark:bg-slate-950/20">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Code2 className="w-5 h-5 text-slate-600" />
          {language}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <StarterCodeEditor
          language={language}
          control={control}
          error={errors.codeSnippets?.[language]}
        />
        <ReferenceSolutionEditor
          language={language}
          control={control}
          error={errors.referenceSolutions?.[language]}
        />
        <ExampleFields
          language={language}
          register={register}
          errors={errors}
        />
      </CardContent>
    </Card>
  );
}

interface StarterCodeEditorProps {
  language: Language;
  control: Control<ProblemFormData>;
  error?: FieldError;
}

function StarterCodeEditor({ language, control, error }: StarterCodeEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Starter Code Template</CardTitle>
      </CardHeader>
      <CardContent>
        <Controller
          name={`codeSnippets.${language}`}
          control={control}
          render={({ field }) => (
            <CodeEditor
              value={field.value}
              onChange={field.onChange}
              language={language.toLowerCase()}
            />
          )}
        />
        {error && (
          <p className="text-sm text-red-500 mt-2">{error.message}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface ReferenceSolutionEditorProps {
  language: Language;
  control: Control<ProblemFormData>;
  error?: FieldError;
}

function ReferenceSolutionEditor({ language, control, error }: ReferenceSolutionEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          Reference Solution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Controller
          name={`referenceSolutions.${language}`}
          control={control}
          render={({ field }) => (
            <CodeEditor
              value={field.value}
              onChange={field.onChange}
              language={language.toLowerCase()}
            />
          )}
        />
        {error && (
          <p className="text-sm text-red-500 mt-2">{error.message}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface ExampleFieldsProps {
  language: Language;
  register: UseFormReturn<ProblemFormData>["register"];
  errors: FieldErrors<ProblemFormData>;
}

function ExampleFields({ language, register, errors }: ExampleFieldsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Example</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="font-medium">Input</Label>
            <Textarea
              {...register(`examples.${language}.input`)}
              placeholder="Example input"
              className="mt-2 min-h-20 resize-y font-mono"
            />
            {errors.examples?.[language]?.input && (
              <p className="text-sm text-red-500 mt-1">
                {errors.examples[language].input.message}
              </p>
            )}
          </div>
          <div>
            <Label className="font-medium">Output</Label>
            <Textarea
              {...register(`examples.${language}.output`)}
              placeholder="Example output"
              className="mt-2 min-h-20 resize-y font-mono"
            />
            {errors.examples?.[language]?.output && (
              <p className="text-sm text-red-500 mt-1">
                {errors.examples[language].output.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <Label className="font-medium">Explanation</Label>
            <Textarea
              {...register(`examples.${language}.explanation`)}
              placeholder="Explain the example"
              className="mt-2 min-h-24 resize-y"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}