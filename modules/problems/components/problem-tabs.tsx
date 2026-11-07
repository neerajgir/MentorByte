'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, FileText, Lightbulb } from 'lucide-react';
import { SubmissionHistory } from './submit-history';

export const ProblemTabs = ({problem , submissionHistory}:any) => {
  return (
     <Card>
      <CardContent className="p-3">
        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="submissions" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Submissions
            </TabsTrigger>
            <TabsTrigger value="editorial" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Editorial
            </TabsTrigger>
            <TabsTrigger value="hints" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Hints
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="p-6">
           <div className="text-center py-8 text-muted-foreground">
              <SubmissionHistory submissions={submissionHistory}/>
            </div>
          </TabsContent>

          <TabsContent value="editorial" className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              {problem?.editorial || 'Editorial not available yet.'}
            </div>
          </TabsContent>

          <TabsContent value="hints" className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              {problem?.hints || 'No hints available for this problem.'}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}