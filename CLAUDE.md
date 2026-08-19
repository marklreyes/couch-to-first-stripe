# Couch to First Stripe — Project Notes

Static single-page marketing site for Couch to First Stripe, a beginner-friendly
Brazilian Jiu-Jitsu program modeled on the "Couch to 5K" concept, aimed at adults
with zero prior experience. Hosted via GitHub Pages.

No build step. No framework. Plain HTML/CSS/JS. Keep it that way unless there's
a real reason not to.

## Files

- `index.html` — the main site
- `privacy.html` — privacy policy, linked from the signup form and footer
- `success.html` — custom post-signup success page, set as the redirect URL
  in MailerLite's form settings (Custom success page)

## Deployment

Hosted on **Netlify** (moved from GitHub Pages). No `.nojekyll` or `CNAME`
file needed — those were GitHub-Pages-specific and don't apply here; Netlify
manages domain config entirely through its own dashboard.

**Getting it live:**
1. Push the site files to the GitHub repo, `main` branch (or use Netlify's
   drag-and-drop deploy if skipping Git entirely for a quick one-off deploy —
   but Git-connected deploys are better long-term since every push auto-
   redeploys).
2. In Netlify: "Add new site" → "Import an existing project" → connect the
   GitHub repo → leave **Build command blank** and **Publish directory** set
   to `/` (root) — no build step for a plain static site.
3. Verify it loads at the auto-generated `*.netlify.app` URL before touching
   DNS.
4. Add the custom domain: Site settings → Domain management → Add a domain.
5. Pick **one** DNS approach, never both at once:
   - **Netlify DNS (simplest)** — delegate by updating nameservers at the
     registrar to the four Netlify gives you; Netlify then auto-manages all
     records and SSL.
   - **External DNS (keep current registrar)** — apex domain: A record →
     `75.2.60.5`. `www` subdomain: CNAME → the site's `*.netlify.app`
     address shown in Netlify's DNS verification panel. Always confirm the
     exact IP/value in the Netlify dashboard, as it can change.
6. HTTPS is auto-provisioned (Let's Encrypt) once DNS verifies — no manual
   "enforce HTTPS" step like GitHub Pages required.

## Brand decisions — please don't casually reverse these

- **Color palette is deliberately green** (tatami-mat inspired), not the
  black/red/white/blue that's standard in martial-arts branding. This was a
  conscious choice to visually differentiate from typical gym/competition
  branding. Full palette with hex/RGB/CMYK lives in the separate
  `couch-to-first-stripe-logo-concept.html` reference file.
- **The logo icon has sharp, square corners — no rounded corners, ever.**
  Earlier rounded-corner versions (and a separate knot/tied-belt icon concept)
  were rejected because the combination of rounded, overlapping organic shapes
  read as unintentionally anatomical. Keep the mark flat and geometric: a
  plain rectangle split by a gap, with the stripe sitting in the gap. Avoid
  any future icon direction built from paired/forking or organic shapes.
- **Two separate belt graphics currently coexist, intentionally:**
  - The **hero illustration** (large tied-belt-with-knot graphic on the
    homepage) — a detailed, spacious-use-only asset.
  - The **logo mark** (simple rectangle + stripe) — used in the header,
    footer, favicon, and all merch/stationery contexts.
  Don't merge or confuse these — they serve different purposes.
- **Fonts**: `Big Shoulders Display` (headings), `Work Sans` (body),
  `IBM Plex Mono` (small/mono labels). Loaded via Google Fonts.

## Outstanding placeholders — not yet real, needed before full public launch

- `privacy.html`: `[DATE]`, `[X days...]` retention line, and `[YOUR EMAIL]`
  (appears twice) all still need real values.
- Footer social links (Instagram, YouTube, Facebook) are still `#` placeholders.
- Footer domain/handle text is still placeholder — confirm against actual
  registered domain and handles before publishing.
- Signup form is still a non-functional placeholder (`<form id="signupForm">`
  in the `#signup` section of `index.html`) — it shows a fake JS confirmation
  and captures nothing. This needs to be replaced with the real MailerLite
  embed once it's built. When wiring it up: use a hidden field named
  `signup_source` or `lead_source` for segmentation — **not** `source`, which
  is a reserved field name in MailerLite.
- MailerLite form config decided so far: single opt-in (not double), no
  confirmation checkbox, no GDPR marketing-permissions fields, no interest
  groups, reCAPTCHA on, hidden segmentation field on (`signup_source` or
  `lead_source` — not `source`, which is reserved), custom success page built
  (`success.html`) — still needs to be set as the redirect URL in MailerLite's
  form settings.

## Content notes

- Copy is written to be **institution-neutral** on purpose — it's being
  pitched to multiple venue types (Adult School, city Recreation Center
  guides, possibly more). Avoid re-introducing wording specific to one
  institution (e.g. don't hardcode "Adult School" back into the signup copy).
- The public-facing curriculum description is intentionally simplified from
  the internal Tier 1/2/3 module design — don't expose the tiered structure
  or season-by-season compression details publicly; the site describes a
  clean 5-step version ("Move Safely" → ... → "Stripe Day").
