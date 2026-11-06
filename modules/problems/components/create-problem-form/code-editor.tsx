"use client";
import { Editor } from "@monaco-editor/react";

const LANGUAGE_MAP = {
  javascript: "javascript",
  python: "python",
  java: "java",
};

export function CodeEditor({ value, onChange, language = "javascript" }: any) {
  return (
    <div className="border rounded-md bg-slate-950 text-slate-50">
      <div className="px-4 py-2 bg-slate-800 border-b text-sm font-mono">
        {language}
      </div>

      <div className="h-75 w-full">
        <Editor
          height={"300px"}
          defaultLanguage={LANGUAGE_MAP[language]}
          theme="vs-dark"
          value={value}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 18,
            lineNumbers: "on",
            readOnly: false,
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}