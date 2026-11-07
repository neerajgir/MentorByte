'use client';



export function ExampleSection({ example , index }:any) {
  if (!example) return null;

  return (
    <div>
      <h3 className="font-semibold text-lg mb-3">Example: {index+1}</h3>
      <div className="bg-muted p-4 rounded-lg space-y-2">
        <div>
          <span className="font-medium text-amber-400">Input: </span>
          <code className="text-sm dark:bg-zinc-900 bg-zinc-200 text-zinc-900 dark:text-zinc-200 px-2 py-1 rounded">
            {example.input}
          </code>
        </div>
        <div>
          <span className="font-medium text-amber-400">Output: </span>
          <code className="text-sm dark:bg-zinc-900 bg-zinc-200 text-zinc-900 dark:text-zinc-200 px-2 py-1 rounded">
            {example.output}
          </code>
        </div>
        {example.explanation && (
          <div>
            <span className="font-medium">Explanation: </span>
            <span className="text-sm">{example.explanation}</span>
          </div>
        )}
      </div>
    </div>
  );
}