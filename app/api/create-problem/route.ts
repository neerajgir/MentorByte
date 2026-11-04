import { prisma } from "@/lib/db";
import { UserRole } from "@/lib/generated/client";
import { getJudge0languageId, pollBatchResults, submitBatch } from "@/lib/judge0";
import { currentUserRole, getCurrentUserData } from "@/modules/auth/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const userRole = await currentUserRole();
    const user = await getCurrentUserData();
    if(!user){
        return NextResponse.json({error: "User not found."})
    }
    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testCases,
      codeSnippets,
      referenceSolutions,
    } = await request.json();

    if(!title || !description || !difficulty || !testCases || !codeSnippets || !referenceSolutions){
        return NextResponse.json(
            {error: "Missing Required Field"},
            {status: 400}
        );
    }

    if(!Array.isArray(testCases) || testCases.length === 0){
        return NextResponse.json(
            {error: "At least one test case is required"},
            {status: 400}
        );
    }
    for(const [language, solutionCode] of Object.entries(referenceSolutions)){
        //get judge0 lang id for the current id
        const languageId = getJudge0languageId(language);
        //prep judge0 submission for all the test cases
        const submissions = testCases.map(({input, output})=>({
            source_code: solutionCode,
            language_id: languageId,
            stdin: input,
            expected_output: output,
        }))
        //submit all test cases in one batch
        const submissionsResults = await submitBatch(submissions);
        //extract tokens from response
        const tokens = submissionsResults.map((res:any)=>res.token);
        //poll judge0 until all submission is done
        const results = await pollBatchResults(tokens);
        //validate that each test case
        for(let i =0; i<results.length; i++){
            const result = results[i];
            if(result.status.id !== 3){
                return NextResponse.json(
                    {
                        error:`Validation failed for ${language}`,
                        testCase:{
                            input: submissions[i].stdin,
                            expectedOutput: submissions[i].expected_output,
                            actualOutput: result.stdout,
                            error: result.stderr || result.compile_output,
                        },
                        details: result,
                    },
                    {status: 400}
                );
            }
        }
    }

    const newProblem = await prisma.problem.create({
        data:{
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            testCases,
            codeSnippets,
            referenceSolutions,
            // @ts-ignore
            userId:user.id
        }
    })
        return NextResponse.json({ success: true, message: "Problem Created Successfully", data:newProblem },{ status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create problem" },
      { status: 500 }
    );
  }
}
