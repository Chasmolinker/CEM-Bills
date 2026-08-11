# Money Ledger — Standalone App

This is your ledger packaged as a real, installable web app. It runs entirely
in the browser and stores all data locally on your device (via
`localStorage`) — nothing is sent to a server, and no account or sign-in is
needed.

## Why it needs to be "served," not just double-clicked

Opening `index.html` directly from your file system (a `file://` link) will
not work — browsers block ES module imports and service workers on `file://`
for security reasons. You need to serve the folder over `http://` or
`https://`. Any of the options below take a couple of minutes.

## Option A — Try it locally first

From this folder, run one of:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open the printed `http://localhost:...` address in your phone or
desktop browser. (If testing on your phone, both devices need to be on the
same Wi-Fi, and you'd use your computer's local IP instead of `localhost`.)

## Option B — Put it on the real internet (free, permanent)

Any static host works. Two easy ones:

**Netlify Drop** (fastest, no account needed for a quick test):
1. Go to https://app.netlify.com/drop
2. Drag this whole folder onto the page.
3. You'll get a live `https://...netlify.app` URL immediately.

**GitHub Pages** (free, keeps a stable URL):
1. Create a new GitHub repo and push these files to it.
2. In the repo's Settings → Pages, set the source to your main branch.
3. Your app will be live at `https://<your-username>.github.io/<repo-name>/`.

Cloudflare Pages and Vercel work the same way if you'd rather use one of
those.

## Installing it on your phone (Add to Home Screen)

Once it's live at a real URL:

- **iPhone (Safari):** open the URL → tap the Share icon → "Add to Home
  Screen." It'll launch full-screen, no browser chrome, with its own icon.
- **Android (Chrome):** open the URL → tap the menu (⋮) → "Add to Home
  screen" / "Install app."

After that first visit, the service worker caches everything, so it keeps
working even with no signal.

## Your data

- Everything lives in your browser's `localStorage`, scoped to whichever
  URL you're using. If you later move from a test URL to a permanent one,
  your data won't carry over automatically — it's tied to the origin you
  installed from.
- **Back up your data:** open the hamburger menu → Configuration →
  "Backup & Restore." Export downloads a `.json` file with every account,
  transaction, recurring template, and debt. Restore lets you pick that
  file back later to fully replace what's in the app — useful if you clear
  your browser data, switch phones, or just want a periodic safety net.
  Since a restore replaces everything, it asks for confirmation and shows
  you what's in the file (counts + when it was made) before doing anything.
- Clearing your browser's site data for this app will erase your ledger —
  the same as any local-storage-based app — so it's worth exporting a
  backup every so often, especially before iOS storage-cleanup prompts or
  a phone migration.

## Files in this folder

- `index.html` — the app shell, loads everything else
- `ledger.jsx` — the actual app (unchanged from the version you built in
  Claude)
- `main.jsx` — mounts the app into the page
- `storage.js` — swaps in `localStorage` in place of the Claude-artifact
  storage API, so the app doesn't need any code changes
- `manifest.json`, `sw.js`, `icon-*.png` — what make it installable and
  offline-capable
