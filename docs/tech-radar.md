# Tech Radar automation

Use this command to create a Portuguese editorial roundup from Hacker News and major technology RSS feeds:

```bash
npm run radar:tech
```

The command writes a Markdown post to `src/content/articles/radar-tech-YYYY-MM-DD.md`.

Default behavior:

- Fetches Hacker News top stories through the official Firebase API.
- Fetches RSS feeds from technology and AI publishers.
- Scores items by relevance to AI, agents, automation, software and digital business.
- Generates a Portuguese analysis-style article with original source links.
- Refuses to overwrite an existing daily radar unless `RADAR_OVERWRITE=1` is set.

Optional environment variables:

- `RADAR_MAX_ITEMS=12`
- `RADAR_HN_LIMIT=35`
- `RADAR_OVERWRITE=1`

The generated post is intended for human review before publishing. It summarizes and comments on sources instead of copying articles.

## Fully automatic publishing

The repository includes `.github/workflows/daily-tech-radar.yml`.

It runs every day at 08:00 Sao Paulo time, using GitHub Actions, and can also be started manually from GitHub's Actions tab.

The workflow:

1. Installs dependencies with `npm ci`.
2. Runs `npm run radar:tech`.
3. Builds the site with `npm run build`.
4. Commits the new daily radar post.
5. Pushes to `main`, which lets Vercel deploy normally.

It does not overwrite an existing daily radar post. If the post already exists, the workflow exits without creating a duplicate.
