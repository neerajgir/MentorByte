# MentorByte

**A DSA learning platform for engineers — solve complex coding problems, execute code against real test cases, track every submission, and organize problems into playlists.**

MentorByte is a full-stack SaaS-style coding platform built with Next.js 16, Clerk, Prisma/PostgreSQL, and the Judge0 execution API. It plays the role of a lightweight LeetCode: admins author problems backed by reference solutions and test cases, users write code in Monaco Editor, and the server securely submits that code to Judge0 for execution, polls the batch, and records every attempt.

---

## Screenshot Gallery

Application screenshots live in the [`ss/`](./ss) folder and are referenced below. **If your screenshots use different filenames, update the `ss/...` paths in this section.**

| # | Screenshot | What it shows |
|---|-----------|---------------|
| 1 | ![Landing](./ss/landing.png) | Marketing landing page with stats, feature grid, and CTA |
| 2 | ![Problems List](./ss/problems.png) | Searchable, filterable problem table with delete/edit for admins |
| 3 | ![Problem Workspace](./ss/workspace.png) | Split view: description + tabs (Description, Test Cases, Editorial, Submissions) and Monaco editor / Run & Submit panel |
| 4 | ![Execution Results](./ss/execution.png) | Test-case verdicts (passed/failed with output vs. expected) |
| 5 | ![Profile](./ss/profile.png) | User info card, stats (acceptance rate, solves, playlists), solved-problem gallery, submission history |
| 6 | ![Create Problem](./ss/create-problem.png) | Admin-only multi-section form: basic info, test cases, per-language solutions |
| 7 | ![Playlists](./ss/playlists.png) | Creating playlists and adding problems to them |

---

## High-Level Architecture

```text
                         ┌────────────────────────────────────────────┐
                         │                  Browser                   │
                         │  React 19 components + Monaco Editor       │
                         │  shadcn/ui on Tailwind 4                   │
                         └───────────────┬────────────────────────────┘
                                         │ fetch / RSC payload
                         ┌───────────────▼────────────────────────────┐
                         │            Next.js 16 (Turbopack)          │
                         │                                            │
                         │  app/(root)/          public pages         │
                         │  app/(auth)/          Clerk sign-in/up     │
                         │  app/create-problem/  admin-SSR-guarded    │
                         │  app/api/…/           JSON endpoints       │
                         │  modules/*            server actions +     │
                         │                       typed client hooks   │
                         └──────┬───────────────────────┬─────────────┘
                                │                       │
              ┌─────────────────▼─────┐    ┌────────────▼──────────────┐
              │  Clerk                │    │  Prisma 7 (pg adapter)    │
              │  identity + sessions  │    │  PostgreSQL               │
              │  currentUser()/roles  │    │  users/problems/submissions│
              └───────────────────────┘    └────────────┬──────────────┘
                                                        │ batch submit + poll
                                             ┌──────────▼───────────┐
                                             │  Judge0 Execution API│
                                             │  sandboxed compilers │
                                             └──────────────────────┘
```

**Key design decision:** user code never touches the database server's shell or the app server's runtime — it is serialized into a Judge0 batch submission and executed inside their isolated sandbox. The app only *orchestrates* (submit → poll → validate) and *persists* (results in PostgreSQL).

## Request Flow: Running & Submitting Code

This is the heart of the platform. Execution flow diagram:

```mermaid
sequenceDiagram
    autonumber
    participant U as User (Monaco Editor)
    participant A as Next.js Action<br/>(modules/problems/actions)
    participant J as Judge0 API
    participant DB as PostgreSQL (Prisma)

    U->>A: executeCode(source, language, stdin, expected)
    A->>J: POST /submissions/batch (all test cases at once)
    J-->>A: submissions[], one token per test case
    A->>J: GET /submissions/batch?tokens=…
    loop until every token settles (status detected)
        J-->>A: batch results (status, stdout, stderr, time, memory)
    end
    A->>A: compare stdout vs expected_output per case
    alt user pressed "Run"
        A-->>U: execution results only (not saved)
    else user pressed "Submit"
        A->>DB: create Submission + TestCaseResult rows
        alt all cases passed
            A->>DB: upsert ProblemSolved (unique userId+problemId)
        end
        A-->>U: submission id → switch to Submissions tab
    end
```

Why batch mode? Judge0 exposes a `submissions/batch` endpoint so all test cases for a run share one round-trip cycle. The client polls a single batch endpoint with all token ids instead of one request per case — the `pollBatchResults` helper in `lib/judge0.ts` re-polls at an interval until all tokens have settled, which makes even large solution runs cheap.

Data Tier — ER diagram:

```mermaid
erDiagram
    USER ||--o{ PROBLEM : authors
    USER ||--o{ SUBMISSION : makes
    USER ||--o{ PROBLEMSOLVED : "earns"
    USER ||--o{ PLAYLIST : organizes
    PROBLEM ||--o{ SUBMISSION : receives
    PROBLEM ||--o{ PROBLEMSOLVED : "counted in"
    PROBLEM ||--o{ PLAYLIST : via
    PLAYLIST ||--o{ PROBLEMINPLAYLIST : contains
    PROBLEM ||--o{ PROBLEMINPLAYLIST : listed_in
    SUBMISSION ||--o{ TESTCASERESULT : produces
    PROBLEM }o--|| USER : "userId FK"

    PROBLEM {
        string id
        string title
        string description
        Difficulty difficulty
        stringArray tags
        JSON testCases
        JSON codeSnippets
        JSON referenceSolutions
        DateTime createdAt
    }
    SUBMISSION {
        string id
        string userId
        string problemId
        JSON sourceCode
        string language
        string status
        string memory
        string time
    }
    TESTCASERESULT {
        string id
        int testCase
        boolean passed
        string stdout
        string expected
        string memory
        string time
    }
    PROBLEMSOLVED {
        string id
        string userId
        string problemId
        DateTime createdAt
    }
    PLAYLIST {
        string id
        string name
        string userId
    }
```

Every `Submission` records the raw source code, per-case pass/fail rows in `TestCaseResult`, and the resource metrics (`memory`, `time`) reported by Judge0. The `ProblemSolved` join table enforces `@@unique([userId, problemId])` so solving the same problem twice does not double-count.

## Module Map

```text
app/
  (auth)/          Clerk catch-all sign-in/sign-up routes
  (root)/          landing, /problems list, /problems/[id] workspace, /profile
  api/create-problem/   admin POST: validates input, batch-validates reference solutions on Judge0, then persists
  api/playlist/         playlist CRUD + add-problem endpoints
modules/
  auth/        currentUser lookups, DB-side role, user onboarding/upsert
  problems/
    actions/   server actions: CRUD, executeCode, submission history
    hooks/     use-editor, use-problem-filters, use-pagination, use-submission-history
    components/ table, filters, tabs, description, execution results, workspace
  playlists/   playlist hooks + modals
  profile/     stats cards, solved-problem gallery, playlists section
  home/        navbar + Clerk user button
prisma/        schema + migrations (7 applied)
lib/           judge0 client wrapper, db singleton (pg adapter), schema
```

Type flow is end-to-end: the zod schema in `modules/problems/schema` is the single source of truth — inferred as `ProblemFormData` for `react-hook-form` (the create-problem multi-section form) and mirrored by Prisma's generated payload types (`UserGetPayload`, `SubmissionGetPayload`) so the UI, server actions, and the DB layer agree with no manual interface duplication.

## Route-Level Rendering Rules (Next.js 16 gotchas we handle)

Because `currentUser()` / uncached server data cannot participate in prerendering, every data-driven page follows a wrapper pattern:

```tsx
const Page = async () => (
  <Suspense fallback={null}>
    <Content />   // calls getCurrentUserData() here
  </Suspense>
);
```

That keeps the route shell prerenderable while user data streams in — the `Blocking Route` error is prevented at every entry point (`/problems`, `/profile`, `/create-problem`).

## PANEL OF THE WORKSPACE (Split View)

The `/problems/[id]` page uses a resizable split view:

```text
┌────────────────────────┬─────────────────────────────────────┐
│ Description tab set    │  Monaco Editor (per-language        │
│ • Description          │  snippet, language selector)        │
│ • Constraints          ├─────────────────────────────────────┤
│ • Editorial (RO)       │  Test inputs / expected outputs     │
│ • Submissions history  │  [ Run ]  [ Submit ]                │
└────────────────────────┴─────────────────────────────────────┘
```

The `Run` action uses the execution-only path (results never stored). `Submit` walks the validation + persistence flow diagrammed above.

## Real-Life Usage Scenarios

1. **Interview prep** — a college senior solving daily problems opens the workspace, drafts a solution, inspects test-case verdicts, and hits Submit only when confident. Their profile shows acceptance rate and solved count, mirroring real interview-dashboard habits.

2. **Bootcamp / university lab** — a TA (ADMIN role) authors a weekly problem set through `/create-problem`. The authoring flow is safe by design: on save, Judge0 first *executes the reference solution against every test case* and rejects creation if the author's own solutions do not pass — preventing publication of unsolvable problems.

3. **Competitive revision** — a user organizes problems into named playlists ("DP revision", "FAANG interview") and re-attempts them; the profile's solved count cannot double-count thanks to the unique join constraint.

4. **Lightweight hiring screen** — a small team curates a problem set as a pre-screen, shares the deployment, and reviews each candidate's submissions with per-case results plus memory/time metrics.

## Tech Stack & Concepts

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16.4.5 (Turbopack) | RSC + streaming, async request APIs, route groups |
| Runtime/Auth | Clerk 7 (`@clerk/nextjs`) | works without a custom middleware in v6+; `currentUser()` server action |
| DB | PostgreSQL + Prisma 7 with `@prisma/adapter-pg` | driver connections pooled via `pg.Pool` singleton |
| Form/validation | react-hook-form + Zod 4 + @hookform/resolvers | `ProblemFormData = z.infer<typeof problemSchema>` |
| Editors | @monaco-editor/react + shiki | code editing, syntax highlighting |
| Execution | Judge0 API | batch submit + token polling; one sandboxed run per test case |
| UI | shadcn-style components on Tailwind 4 | `next-themes` dark/light + system, sonner toasts |
| State/hooks | React 19 hooks in `modules/*/hooks` | no global store used |

## Setup

```bash
git clone <repo>
cd mentorbyte
bun install       # packageManager: bun 1.4.3
# or: npm install

# Create a .env file with:
#   DATABASE_URL="postgresql://user:pass@localhost:5432/mentorbyte"
#   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_…
#   CLERK_SECRET_KEY=sk_…
#   JUDGE0_API_URL=…            # endpoint (self-host or RapidAPI style)
#   JUDGE0_API_KEY=…            # x-rapidapi-key style payload, optional for self-host

npx prisma migrate dev     # apply the 7 migrations
npx prisma generate        # emit the typed client to lib/generated/client

npm run dev                # http://localhost:3000
```

Admin access: manually flip your database user to `ADMIN`:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE "clerkId" = '<your Clerk userId>';
```

## Conventions & Best Practices Already Applied

- **Single source of truth:** zod schema ⇄ Prisma model ⇄ typed hooks — change one, re-run `prisma generate`, re-check `tsc`.
- **Always type check:** `node node_modules/typescript/bin/tsc --noEmit` before pushing, since Next.js dev/Turbopack caches type states; a stale Prisma client silently breaks runtime validation.
- **Keep server code server-only:** `"use server"` directive on the action files, browser-safe logic isolated in `hooks/`.
- **Suspend everything dynamic:** use the `<Suspense>` wrapper pattern at the top of every data page so the app stays prerenderable and per-route errors become streamed, not blocking.
- **No user code on app server:** execution always routed to Judge0 — never `eval` locally.

## Future Enhancements

- [ ] Leaderboards and weekly challenges
- [ ] LLM-generated hints with per-user unlock gating
- [ ] Judge0 token webhook instead of client polling (fewer requests)
- [ ] e2e suite (Playwright) for the workspace submission flow
- [ ] Rate limiting + Judge0 cost guardrails before public demo

---

*Built for small labs, bootcamps, and self-taught engineers — one repo, unlimited practice.*
