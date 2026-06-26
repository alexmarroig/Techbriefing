# Editorial Generation Procedure

This procedure applies to every Tech Briefing generator that can create content with LLMs or automated sources.

## Required flow

1. Collect candidates from real sources first.
2. Rank by editorial relevance, recency, and utility.
3. Remove duplicates by URL, slug, and similar title before writing.
4. Generate Markdown only after the candidate passes relevance checks.
5. Assign a local image and verify the image exists.
6. Run text quality checks twice:
   - structural/editorial audit;
   - proofreading pass for grammar, spelling, punctuation, and clarity.
7. Reject content that is too similar to existing content.
8. Reject low-signal or generic images.
9. Do not publish automatically unless the workflow explicitly allows it.

## Must-run checks

Use this command before considering any generated batch ready:

```bash
npm run quality:content
```

For stricter review of editorial batches:

```bash
npm run audit:editorial -- --strict-all
```

## Content quality rules

- Use sources that are public and traceable.
- Prefer RSS, search signals, or news feeds over synthetic topics.
- Keep the body original and avoid long copied quotations.
- Make the lead answer the main question quickly.
- Preserve clear structure, FAQ, and discussion prompts.
- Check readability, punctuation, and accent/encoding integrity.

## Image quality rules

- Every article must have a local image unless the pipeline explicitly keeps a vetted remote image.
- Prefer branded SVGs with a title, a description, and source context.
- Reject placeholders, missing files, Unsplash fallbacks, or generic assets.
- Make sure the image matches the article topic and category.

## Duplicate prevention

- Block duplicate URL, slug, and title matches.
- Block semantically similar titles when a candidate is too close to existing content.
- When a batch is generated, re-run the duplicate audit against the full article corpus.

## Human override

If an article fails quality checks but is still worth keeping, fix the source content or image first. Do not weaken the checks to pass a bad batch.
