# Krete Works Concrete — Google Ads landing pages

Three standalone landing pages, one per ad-group theme, built off the **Holdeman Concrete** pattern
(Kennedy's pick) and re-skinned to the KWC logo (logo blue `#3883c4` + near-black `#141414` on a cool
concrete-white; Archivo + IBM Plex Sans/Mono; chevron motif from the logo). **No nav links between pages**
— each funnels to *call* or *quote form*. Pre-alignment build (ads not written yet) — see the bottom.

| Page | File | Ad group(s) | H1 |
|---|---|---|---|
| Concrete Contractor (main) | `index.html` | 1 Concrete Contractor · 4 Patios & Sidewalks (`#patios`) · 5 Foundations, Footers & Walls (`#foundations`) | Concrete Contractor in Cheraw, SC |
| Slabs & Pads | `slabs-pads.html` | 2 Slabs & Pads | Concrete Slabs & Pads in Cheraw, SC (broadened from "pole barn" on the 2026-11-04 call — covers house slabs too) |
| Driveways | `driveways.html` | 3 Driveways | Concrete Driveways in Cheraw, SC |
| Thank-you | `thank-you.html` | form redirect target (fires the form conversion) | |
| Privacy / 404 | `privacy.html` · `404.html` | footer link / Vercel 404 | |

Generated once by `build_pages.py` (scratch, not kept) — **edit the HTML directly from here on.**

## Preview locally
Double-click **`Preview Site.command`** (gitignored) → http://localhost:8770 (8765 is taken by Kennedy's M&A dashboard) — clean URLs work like Vercel.

## The "What We Pour" / "The Work" section (Kennedy's change from Holdeman)
Holdeman's "What We Do" listed every service with two small thumbnails. Here that section is
**service-specific per page** with **two big clickable photos beside the text** (`.work` grid: copy left,
two staggered 4:5 photos right; on phones the photos drop below the text, side by side):
- `index.html` → "What We Pour" — the 4-item set (slabs / driveways / patios & sidewalks / foundations)
- `slabs-pads.html` → "Slabs & Pads" — checklist of slab types
- `driveways.html` → "Driveways" — checklist of driveway jobs
Swap photos by changing the two `<button class="work-pic">` images.

## Location insertion (Kennedy: "we'll probably use the location extension in the title")
The ads will use `{LOCATION(City)}` in headlines. The page matches it:
- Every `[data-city]` span (the H1 city) and `[data-city-short]` (hero pill) swaps from the URL:
  - `?city=pageland` → "Pageland, SC" (names: see `BY_NAME` in `js/main.js`)
  - `?loc=1025631` → same via Google's location ID. **Final URL suffix to set in Google Ads:**
    `loc={loc_physical_ms}` — Google fills in the searcher's physical-location ID.
  - Unknown / missing → stays "Cheraw, SC" (baked into the HTML, so AdsBot sees a real page).
- The ID → town table lives in `js/main.js` and `../google-ads/targeting/google-ads-bulk-locations.txt`
  (pulled from the API 2026-11-04). Add towns there if the location report shows new ones.
- `title`/`meta description` stay Cheraw (not swapped) — only visible copy swaps.

## ⚠️ Before going live
1. **Quote form is LIVE-WIRED** (Web3Forms key for `kreteworks12@gmail.com` pasted in 2026-11-05, all three pages).
   Still to do once deployed: **submit one live test** from the real URL and confirm Alex gets the email.
   `redirect` is hard-coded to `https://kreteworks.vercel.app/thank-you` — change it if the domain changes.
   Bot protection = Web3Forms honeypot (`botcheck` box hidden off-screen; Web3Forms drops any submit that has it
   ticked, and `js/main.js` blocks it client-side too). Name, phone, town and the project-type dropdown are required.
2. **Tracking is LIVE (2026-11-05):** Google tag `AW-17064399996` + website-call number swap (label
   `QDmcCLKx97IdEPyo-Mg_`, "Calls from website", 45-sec) in every page head; the "Quote form" conversion
   (`-CnzCLWx97IdEPyo-Mg_`) fires on `thank-you.html`. `js/main.js` also sends `call_click` / `form_submit` as
   secondary gtag events. Ad groups 4 + 5 land on `/?s=patios` and `/?s=foundations` — main.js scrolls to that
   section (a `#` anchor can't take the campaign's `loc=` URL suffix).
3. **Reviews section** shows only the "5.0 on Google" banner (true per Alex: ~8 reviews, all 5 stars).
   Paste 3 verbatim reviews into the commented block in each page once we have the GBP link.
   **No review count on the page until we see the GBP.**
4. **Claims to confirm with Alex** (all written from his answers; these are the inferences):
   - "We don't do repair / leveling / lifting" (FAQ) — he listed new work only, never said no to repair.
   - "Poured to your building supplier's drawings" / anchor points (slabs page) — standard for the trade, unconfirmed.
   - Hours shown as **Mon–Sat 7am–5pm** — he said 7–5, didn't say which days.
   - "Clear the area and tell us about anything underground; we handle grading" — he has a Bobcat (photo), unconfirmed.
   - Stamped/decorative concrete is deliberately NOT on any page — CONFIRMED on the 2026-11-04 call: Alex
     is "locked in on flatwork", not pushing stamped. Keep it off.
5. **Only true trust claims on the page:** *Fully Insured* (yes) · *5.0 on Google* (yes) · *5 Years* (yes).
   **Never** licensed / bonded — he's insured only.

## Design notes
- Info bar (location + hours / email + "Free Quotes" dot) above a sticky header with the Safari shield;
  sticky mobile bar is `position: sticky` AFTER the footer (not fixed), shows only after the hero scrolls
  away, and every call element shows the number (no "Call Now" anywhere — `grep -i "call now"` = 0).
- Trust strip right under the hero: Fully Insured · ★★★★★ 5.0 on Google · 5 Years.
- Photos: Alex's real jobs, converted to WebP at 1400px in `images/` (sources: `../assets/photos/`,
  ranked in `../assets/photos/INVENTORY.md`). Logo: `images/logo.png` (color, transparent) +
  `images/logo-white.png` (footer). No stock anywhere.
- `vercel.json`: images immutable, CSS/JS `max-age=0, must-revalidate` (never immutable-cache code).
- Pages are `noindex` on purpose (ads pages, not the SEO site). No `robots.txt` → AdsBot is not blocked.

## Deploy — LIVE 2026-11-05
Repo **customleadz-sites/kreteworks** (this `site/` folder is the repo root), Vercel project **kreteworks**
(team custom-leadz, id prj_cQuI6HcaZRHK1H0rAyhjSSTHekdw) → **https://kreteworks.vercel.app**. Push to `main`
auto-deploys. Deployment protection turned OFF (pages are public). Git author email + org token rules: `git-deploy`
skill. Never `git add -A` from the client folder root. No hyphens in the domain (Kennedy's rule).
