# Couch to First Stripe — Project Notes

Static single-page marketing site for Couch to First Stripe, a beginner-friendly
Brazilian Jiu-Jitsu program modeled on the "Couch to 5K" concept, aimed at adults
with zero prior experience. Hosted on Netlify (see Deployment).

No build step. No framework. Plain HTML/CSS/JS. Keep it that way unless there's
a real reason not to.

## Files

- `index.html` — the main site
- `privacy.html` — privacy policy, linked from the footer (and should be linked
  from the MailerLite signup form). Covers only the email list and partner
  inquiries; city registration data falls under the City's own policies.
- `success.html` — custom post-signup success page, set as the redirect URL
  in MailerLite's form settings (Custom success page)
- `css/base.css` — shared by every page: palette/font tokens, reset, headings,
  `.eyebrow`, `.btn`, `.logo-mark`, `.wrap`, and the `.surface-light` /
  `.surface-dark` / `.surface-glow` backgrounds
- `b2b.html` — partner page pitching the program to recreation departments,
  adult schools, community centers, etc. Linked from the homepage nav as a
  quiet text link ("For Partners", hidden under 560px) and from the footer
  ("Partner With Us"). Keep it secondary: the homepage's primary action is the
  student registration reminder. Holds the partner inquiry form (see below).
- `b2b-success.html` — confirmation page after a partner inquiry (the form's
  `action`). Uses `success.css`. `noindex`.
- `css/components.css` — shared marketing components used by `index.html` and
  `b2b.html`: nav, hero, sections/titles, `.lede`, `.cta-row`, steps + track,
  `.card-grid`, form fields, footer
- `css/home.css`, `css/b2b.css`, `css/privacy.css`, `css/success.css` — one
  stylesheet per page, loaded after `base.css` (and `components.css` where used)
- `js/main.js` — steps scroll-reveal (index and b2b; loaded with `defer`)
- `js/b2b.js` — partner page: UTM/referrer capture into hidden form fields,
  `cta_click` and `inquiry_start` events, hands lead details to the
  confirmation page
- `js/b2b-success.js` — sends one `generate_lead` event per submitted inquiry
- `images/favicon.svg` — the logo mark favicon, used by every page
- `images/flags.svg` — sprite of the community flags in the footer (USA,
  Philippines, South Korea, Brazil, California, Hawaii), referenced with
  `<use href="images/flags.svg#flag-us">`. All share a 3:2 box like a row of
  gym flags. Keep clip paths and gradients out of it: they're unreliable
  through an external `<use>`. Brazil omits the stars and motto at this size.
- `brand-guide.html` + `css/brand-guide.css` — **internal** brand reference
  (palette with hex/RGB/CMYK, icon, badge, lockups, single-color, merch
  previews). Hosted but private-by-obscurity:
  - **Never link to it** from any public page, sitemap, or social post.
  - It has `<meta name="robots" content="noindex, nofollow, ...">` and
    `_headers` sends a matching `X-Robots-Tag` header. Keep both.
  - **No Google Analytics tag** on this page (it would only count your own
    visits).
  - **Don't add it to `robots.txt`.** A Disallow line would stop crawlers from
    seeing the noindex, and robots.txt is public, so it would advertise the URL.
- `_headers` — Netlify response headers (`X-Robots-Tag` for the brand guide
  and both success pages). Not served as a page.

Every page includes the Google Analytics tag (`G-ERTBRT8GX6`) in `<head>`.
Add it to any new page. `success.html` is the signup conversion page: mark its
page view as a key event in Google Analytics. The privacy policy's "Site
Analytics" section discloses this, so keep it in sync if tracking changes.

## Partner inquiry form (b2b.html)

- Uses **Netlify Forms** (`data-netlify="true"`, form name `partner-inquiry`),
  not MailerLite. It's an interim lead-capture setup: submissions go to the
  Netlify dashboard (Forms tab) and can email a notification. B2B contacts
  stay off the student mailing list.
- **Form detection must be enabled** in Netlify (Site configuration → Forms)
  or submissions are dropped. Can't be tested locally: `python3 -m
  http.server` rejects the POST.
- Spam: Netlify's built-in filtering plus a honeypot field
  (`netlify-honeypot="company_website"`).
- Hidden fields `lead_source`, `utm_*`, and `referrer` are filled by
  `js/b2b.js` for attribution. Use UTM links in outreach, e.g.
  `/b2b.html?utm_source=<city>&utm_medium=email&utm_campaign=<campaign>`.
- Analytics events: `cta_click` (with `cta_location`), `inquiry_start`, and
  `generate_lead` (fired on `b2b-success.html`, with `organization_type`,
  `timeline`, `utm_source`). **Never send names, emails, or phone numbers to
  Google Analytics.** Mark `generate_lead` as a key event in GA.
- Field names are plain (`name`, `email`, `organization`, ...). If this moves
  to MailerLite later, remember `source` is reserved there.
- The privacy policy's "Partner Inquiries" section lists the collected fields
  and names Netlify as processor. Keep it in sync with the form.

## CSS conventions

- **No inline `style=` attributes and no `<style>` blocks.** Put shared rules
  in `base.css` and page-only rules in that page's stylesheet.
- **Surfaces set the colors.** A section gets `.surface-light` or
  `.surface-dark`, which set `--heading`, `--text-body`, and `--accent`.
  Headings, paragraphs, and `.eyebrow` read those tokens, so they don't need
  light/dark variants of their own.
- Shared marketing components live in `components.css`: `.section`,
  `.section-title` (`--sm` / `--lg`), `.lede`, `.cta-row`, `.steps`/`.track`,
  `.card-grid` (`--2`) + `.card-label`, `.form-grid` + `.field`
  (`--full`), `.site-nav`, `.site-footer`. Build new marketing pages from
  these before adding page-specific CSS.
- The nav and footer markup is duplicated in each page's HTML (no build step
  for includes). Change it in every page that has it.
- The logo mark SVG uses `fill="currentColor"` for the belt and the
  `.logo-mark__stripe` class for the stripe. Set its color with `color`.
- Palette token names are historical (`--mat-navy` and `--stripe-gold` are
  both greens). The values are locked; don't rename them casually.

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
  branding. Full palette with hex/RGB/CMYK lives in `brand-guide.html`.
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

## Current offering

- Offered through **Escondido Recreation**. Registration opens **Tuesday,
  Dec. 8 at 10 a.m.** through Escondido Recreation; the **City of
  Escondido** handles registration, payment, and waivers. No registration URL
  yet.
- **One 8-week course** this season, **Monday and Wednesday, 1 hour each**,
  starting in March. A second course may be added later: don't promise it.
  "More courses to come" is fine.
- **Adults 18+**, no experience needed.
- **Gear:** a gi is required for every class. Students also bring a water
  bottle and a towel, like going to the gym.
- **Instructor:** Mark Reyes, BJJ brown belt.
- Students earn a **certificate of completion** on Completion Day. **There
  is no stripe at the end of the course.** The program name stays, but the
  stripe is a later milestone: no copy should promise one.
- The instructor bio mentions Gracie Barra Escondido and Ribeiro Jiu-Jitsu
  Carlsbad. These were left as-is on purpose; don't change them without asking.

### Keep copy evergreen

- **No hard dates in page copy.** Show the month only ("starting in March"),
  no day or year, and no season labels like "Winter 2027". The one exception
  is the registration-opening date (Dec. 8, 10 a.m.) in the signup section
  and on `success.html`. Exact dates (day, date, year) are planned for a
  countdown timer component instead of body copy.
- **Leave off the site for now:**
  - Prices and fees. The city's catalog is the authority.
  - The drop-in option, until the city confirms how it will be listed.
  - The end date and individual class dates, until the city confirms its
    holiday calendar.
  - The January start and any "two courses" wording from earlier drafts.
- **The partner page (`b2b.html`) stays venue-neutral.** Each recreation
  center sets what it can offer, so don't promise a drop-in, specific dates,
  or a fixed schedule there. Describe the format ("designed as an 8-week
  course") and say details are set with each partner.

## IP notices

- The program name carries **™**, never **®**. Nothing is federally
  registered. Switch to ® only after a federal registration exists and Mark
  says so.
- ™ appears only in brand spots: the sticky header brand text and footer
  wordmark (`index.html`, `b2b.html`), the homepage hero headline (once),
  and the "Back to Couch to First Stripe" links on `privacy.html` and
  `success.html`. Markup:
  `<sup class="tm">™</sup>` (styled in `base.css`). Not in `<title>`, body
  copy, the favicon, or the logo graphic.
- Copyright line, in `.fine-print` at the bottom of every page (`index`,
  `b2b`, `privacy`, `success`, `b2b-success`, `brand-guide`): "© 2026 Mark
  Reyes. All rights reserved." Add it to any new page.
- `brand-guide.html` documents these rules in its "Trademark & copyright"
  section. Its lockup and merch artwork stays without ™.
- If the business moves into an LLC, update the copyright holder, the ™
  owner, and this section.
- `IP-RECORDS.md` is the dated first-use log. It and `CLAUDE.md` sit in the
  published root, so `_redirects` forces a 404 for both. Add any new
  internal file there too.

## Outstanding placeholders — not yet real, needed before full public launch

- Footer domain link (`couchtofirststripe.com`) and handle link
  (`@couchtofirststripe`) both point to `#`. Confirm the registered domain and
  handle, then link them (the Instagram URL is already used in the social row).
- Footer Facebook link is commented out with an `href="#"` placeholder.
  Instagram and YouTube links are real.
- City of Escondido registration URL — not available yet. When it is, link it
  from the hero CTA, the Schedule & Registration section, and the signup copy.
- MailerLite: the signup form is the live embed (`data-form="AgVjm7"` in the
  `#signup` section). Config: single opt-in, no confirmation checkbox, no GDPR
  marketing-permissions fields, no interest groups, reCAPTCHA on, hidden
  segmentation field named `signup_source` or `lead_source` — **not**
  `source`, which is reserved in MailerLite. Confirm `success.html` is set as
  the Custom success page redirect URL in MailerLite's form settings.

## Content notes

- **Tone: supportive, inspirational, measured.** Don't lean on "couch" as a
  metaphor in body copy ("Everyone starts on the couch", "you're no longer on
  the couch") — it reads as calling the reader lazy. "Couch" belongs only in
  the program name and the Couch to 5K comparison.

- Evergreen copy (what the program is, curriculum, gear, instructor) stays
  **institution-neutral** because the program may be pitched to other venues
  (Adult School, other city Recreation Center guides). Offering-specific
  details (Escondido Recreation, City of Escondido registration) belong in the
  Schedule & Registration section, the hero, the signup copy, and the success
  and privacy pages, so they're easy to swap per venue or season.
- The public-facing curriculum description is intentionally simplified from
  the internal Tier 1/2/3 module design — don't expose the tiered structure
  or season-by-season compression details publicly; the site describes a
  clean 5-step version ("Move Safely" → ... → "Completion Day"), ending in a
  certificate of completion, not a stripe.
