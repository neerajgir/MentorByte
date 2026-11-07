import { useEffect, useState } from "react";
import { getAllSubmissionByCurrentUserForProblem } from "../actions";
import type { Submission } from "@/lib/generated/client";

export function useSubmissionHistory(id: string) {
  const [submissionHistory, setSubmissionHistory] = useState<Submission[]>(
    [],
  );


      useEffect(()=>{
         const fetchSubmissionHistory  = async()=>{
             try {
                 const response = await getAllSubmissionByCurrentUserForProblem(id);
                 if(response.success && response.data){
                       setSubmissionHistory(response.data);
                 }
             } catch (error) {
                  console.error('Error fetching submission history:', error);
             }
         }

         fetchSubmissionHistory()
      },[id])

      return {
         submissionHistory
      }
 }