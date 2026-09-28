# PSYCH 5612 Midterm 1 study site

A focused study site built only from `PSYCH_5612_Midterm1_Master.pdf` (the course master study guide). Chapters 2-14 of the guide are the reading pages, chapter 16 supplies the model answers for the Q1-23 bank, and chapter 17 supplies the drills.

## Run locally

```bash
cd psych5612
npm install
npm run dev
```

Open http://localhost:3000. Progress, self-ratings, and written drafts are saved in the browser's localStorage.

## Deploy on Vercel

1. In Vercel, choose **Add New → Project** and import this GitHub repository.
2. Set **Root Directory** to `psych5612`. Vercel detects Next.js automatically.
3. Click **Deploy**. Every push to the default branch redeploys.

Or from a terminal: `cd psych5612 && npx vercel --prod`.

## Verify

- `node scripts/e2e.mjs http://localhost:3000` drives the running site in headless Chrome, asserting widget behavior, the question-bank flow, search, and dark mode. It needs `puppeteer-core`.
- `python3 scripts/check-fidelity.py path/to/PSYCH_5612_Midterm1_Master.pdf` reports, per guide page, how much of the PDF text appears in the markdown.

## Where the content lives

- `src/content/guide/NN.md` holds the guide chapters as markdown. `scripts/convert-guide.py` produced the first draft from the PDF (headings come from the PDF bookmarks). Tables, diagrams, and callouts were then fixed by hand, so do not re-run it over the edited files.
- `src/content/course.ts` is the chapter registry and the verbatim Q1-23 prompts from the 2026S2 question bank.
- `src/content/drills.ts` holds the twelve distinctions, ten practice tasks, and frequent mistakes from chapter 17.
- `src/components/widgets/` holds the interactive figures (noise margins, gates, traffic FSM, toggle FSM, setup/hold, latch vs register, unary TM). Markdown embeds them with a fenced block: `widget` as the language and the widget name as the body.
