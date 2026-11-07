export function ConstraintsSection({ constraints }:any) {
  if (!constraints) return null;

  return (
    <div>
      <h3 className="font-semibold text-lg mb-3">Constraints:</h3>
      <div className="bg-muted p-4 rounded-lg">
        <pre className="text-sm text-muted-foreground whitespace-pre-wrap">{constraints}</pre>
      </div>
    </div>
  );
}