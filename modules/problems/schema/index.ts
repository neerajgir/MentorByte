import { z } from "zod";

export const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),

  testCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Input is required"),
      }),
    )
    .min(1, "At leat one test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    JAVA: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
  }),

  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "Javascript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "Javascript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
});

export const defaultFormValues = {
  title: "",
  description: "",
  difficulty: undefined,
  constraints: "",
  hints: "",
  editorial: "",
  testCases: [{ input: "", output: "" }],
  tags: [""],
  examples: {
    JAVASCRIPT: { input: "", output: "", explanation: "" },
    PYTHON: { input: "", output: "", explanation: "" },
    JAVA: { input: "", output: "", explanation: "" },
  },
  codeSnippets: {
    JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
    PYTHON: "def solution():\n    # Write your code here\n    pass",
    JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
  },
  referenceSolutions: {
    JAVASCRIPT: "// Add your reference solution here",
    PYTHON: "# Add your reference solution here",
    JAVA: "// Add your reference solution here",
  },
};

export const LANGUAGES = ["JAVASCRIPT", "PYTHON", "JAVA"];

export const DIFFICULTY_OPTIONS = [
  { value: "EASY", label: "Easy", className: "bg-green-100 text-green-800" },
  {
    value: "MEDIUM",
    label: "Medium",
    className: "bg-amber-100 text-amber-800",
  },
  { value: "HARD", label: "Hard", className: "bg-red-100 text-red-800" },
];