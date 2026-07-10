# Probably Fine™ — The Worst UX App

A joke signup page that deliberately violates every UX/UI principle. **Do not use this as a design reference.**

## Live demo

- **Vercel:** Deployed via GitHub → Vercel (see below)
- **Local:** `python3 -m http.server 8080` → http://localhost:8080

## Deploy to Vercel

Static site — no build step. Push to `main` or run:

```bash
npx vercel deploy --prod --yes
```

Requires `VERCEL_TOKEN` (and optionally `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID`) in your environment or GitHub Actions secrets.

## What's awful (v2)

- Rage meter that fills as you suffer (max rage = chaos mode)
- Clippy-style paperclip with terrible advice
- Live chat bot that ignores you and spams messages
- Rigged prize wheel (always "TRY AGAIN")
- Rate-us modal — only 5 stars accepted, "later" returns in 10s
- Fake pull-to-refresh on mobile
- Phone vibration + screen flash on tap
- Fake low-battery warning
- Phone digits stolen into the email field
- Mood dropdown that resets itself
- Clown mode + Konami code easter egg
- Everything from v1: fleeing buttons, cookie wall, hostile captcha, etc.

Enjoy your discomfort.
