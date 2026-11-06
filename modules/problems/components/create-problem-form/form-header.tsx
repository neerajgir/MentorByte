"use client";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function FormHeader({ sampleType, setSampleType, onLoadSample }: any) {
  return (
    <CardHeader className="pb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <CardTitle className="text-3xl flex items-center gap-3">
          <FileText className="w-8 h-8 text-amber-600" />
          Create Problem
        </CardTitle>

        <div className="flex flex-col md:flex-row gap-3">
          <SampleTypeToggle
            sampleType={sampleType}
            setSampleType={setSampleType}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onLoadSample}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Load Sample
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}

function SampleTypeToggle({ sampleType, setSampleType }: any) {
  return (
    <div className="flex border rounded-md">
      <Button
        type="button"
        variant={sampleType === "DP" ? "default" : "outline"}
        size="sm"
        className="rounded-r-none"
        onClick={() => setSampleType("DP")}
      >
        DP Problem
      </Button>
      <Button
        type="button"
        variant={sampleType === "string" ? "default" : "outline"}
        size="sm"
        className="rounded-l-none"
        onClick={() => setSampleType("string")}
      >
        String Problem
      </Button>
    </div>
  );
}