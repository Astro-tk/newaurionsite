# Aurion Creative website

Live site: https://aurioncreative.com (GitHub Pages from `main`, custom domain via `CNAME`).

Aurion Creative is an engineering-led AI and software studio in Pretoria. This is a static
Bootstrap 5 site (jQuery, AOS, Owl Carousel, Iconify). Pages live at the repository root,
assets in `assets/`, and `html/` holds redirect stubs only.

The site was rebuilt for the studio positioning on 24 Nov 2026 (branch `studio-rebuild`,
merged into `main`).

---

## Rollback

The last commit before the rebuild is tagged `pre-studio-rebuild` (pushed to GitHub).

- Undo the rebuild with a new commit (safe, keeps history):
  `git revert -m 1 <merge-commit>` then `git push origin main`
- Or put `main` back exactly as it was (rewrites history, needs a force push):
  `git reset --hard pre-studio-rebuild` then `git push --force-with-lease origin main`

GitHub Pages redeploys from `main` within a couple of minutes either way.

---

## Pages

| Page | What it is |
|---|---|
| `index.html` | Homepage, sections 01 to 10 (Studio, What we build, Products, How we work, Selected work, Testimonials, Pricing, FAQ, Resources, Contact) |
| `ai-systems.html` | AI systems and chatbots in depth, with pricing and FAQs |
| `project-command.html` | Project Command product page |
| `beelevel.html` | BeeLevel product page (carries the required disclaimer) |
| `projects.html` | Work: products first, then client work |
| `work-glc-website.html`, `work-career-guide-chatbot.html`, `work-horizon-estates.html`, `work-aurion-assistant.html` | Case studies |
| `about-us.html`, `contact.html` | Studio story and method; contact form |
| `blog.html`, `blog-detail-1..3.html` | Resources |
| `thank-you.html`, `404.html` | Utility pages (noindex). `404.html` uses `<base href="/">` so it renders at any depth |

Header menu: Home, AI systems, Products (`index.html#products`), Work, About, Pricing
(`index.html#pricing`), Contact. `#quote` still works as an alias of `#pricing`.

### Redirects

| Old URL | Now goes to |
|---|---|
| `projects-detail-1.html` to `projects-detail-6.html` (concept pieces) | `projects.html` |
| `projects-detail-7.html` (old BOQ Automation Platform page) | `project-command.html` |
| `blog-detail.html` (template leftover) | `blog.html` |
| `html/*.html` (pre-July 2026 URLs, unchanged) | the root page of the same name |

Each stub is a meta refresh plus a canonical tag. Do not delete them.

### Shared header and footer

The header and footer are copied into every page. They must stay byte-identical; check
with:

```
python scripts/check_partials.py
```

Because the header is identical everywhere, `assets/js/custom.js` sets the active menu
link and the footer year at runtime.

---

## Forms

Both go to Formspree only. **EmailJS was removed** in the rebuild (it sent customers a
fake "invoice" with old prices).

| File | Form ID | Powers |
|---|---|---|
| `index.html` | `mgojjrbe` | Pricing enquiry form (service, modules, indicative price, details) and the homepage contact form |
| `contact.html` | `xjgqqjdo` | Contact page form |

Manage them at https://formspree.io/forms. Each form has a honeypot (`_gotcha`), a spinner,
an error state and a WhatsApp fallback.

Prices in the enquiry form live in the `OFFERS` and `PROJECT_COMMAND` objects in the
script at the bottom of `index.html`. If prices change, update them there, in the pricing
cards on `index.html`, `ai-systems.html` and `project-command.html`, in the BeeLevel page,
in the JSON-LD, and in the bot (see below).

---

## Chatbot (Botpress)

The bubble on `index.html` and `ai-systems.html` is Aurion's own Botpress assistant. Its
knowledge lives in the Botpress dashboard, not here. `docs/botpress-knowledge.md` holds the
current offer, prices, products, FAQ answers and behaviour rules, ready to paste in. Update
the bot whenever prices or offers change.

---

## Images to replace

These files are placeholders copied from existing images. Overwrite each one at the same
path (no HTML changes needed):

| File | Size | What to show |
|---|---|---|
| `assets/images/portfolio/beelevel.jpg` | 1200 x 864 (landscape, about 25:18) | BeeLevel screenshot, ideally the beneficiary directory or readiness view, with demo data only |
| `assets/images/backgrounds/beelevel-banner.jpg` | 2400 x 1000 or larger | Wide BeeLevel screenshot or an ESD-related photo; it sits under a 50% dark overlay |
| `assets/images/backgrounds/ai-systems-banner.jpg` | 2400 x 1000 or larger | Document AI in action, for example a review screen with confidence flags |
| `assets/images/backgrounds/blog-detail-3-banner.jpg` | 2400 x 1000 or larger | Something that reads as commissioning or engineering method |

Project Command already uses real screenshots (`portfolio/portfolio-img-7.jpg` and
`backgrounds/projects-detail-banner-7.jpg`). Replace them with newer ones when the product
changes. `assets/images/logos/og-image.png` exists and is used for social previews.

Stock faces (`testimonial/*.jpg`, `profile/*`) are no longer used on any page. Only add
testimonials from clients who have agreed to be named.

---

## Copy rules (keep to these when editing)

- South African English. No em dashes, emojis or exclamation marks.
- Money as `R 1 234 567.89`; dates as `24 Nov 2026`. Aurion is not VAT-registered: pricing
  notes say "Aurion is not VAT-registered, so no VAT is added." Never say VAT is included.
- No unprovable claims, invented testimonials or client logos.
- BeeLevel: never say it calculates B-BBEE points or levels, improves a level, guarantees
  compliance or certifies anything. Say "built with POPIA in mind", never "POPIA
  compliant". Any BeeLevel page carries the disclaimer verbatim.
- AI: never "fully autonomous" or "replaces your staff". The AI Enquiry Desk is always an
  enquiry system, never described as a bare chatbot.
- B-BBEE: Aurion is a Level 1 B-BBEE contributor (EME). It appears as a calm trust line
  under the hero buttons, in the footer, the pricing section, the About page and the
  JSON-LD, with "B-BBEE affidavit available on request". Never the hero headline.
- Project Command: the BOQ module is available; tenders and site reports are marked "in
  development" until they ship. Horizon Estates is labelled "Concept", not client work.
- Design: reuse existing classes. Small CSS additions go in the "Aurion studio additions"
  block at the end of `assets/css/styles.css`. Mobile-only rules live in
  `assets/css/mobile.css`.

---

## SEO

- Unique title and a 140 to 160 character meta description, canonical, Open Graph and
  Twitter tags on every page.
- JSON-LD: LocalBusiness, three Services and two SoftwareApplications (Project Command,
  BeeLevel) on the homepage; Service on `ai-systems.html`; SoftwareApplication on each
  product page. Price ranges only where published.
- `sitemap.xml` lists live pages only (no redirects, no noindex pages); `robots.txt`
  points to it.
- Google Analytics `G-936RHVHQ8W` on every page.

After deploying, resubmit `sitemap.xml` in Google Search Console and request indexing for
`/`, `ai-systems.html`, `project-command.html` and `beelevel.html`.

## Editing cheat sheet

| Change | Where |
|---|---|
| Title or description | `<head>` of the page (also the matching `og:` and `twitter:` tags) |
| Prices | Pricing cards and `OFFERS` script in `index.html`; `ai-systems.html`; `project-command.html`; `beelevel.html`; JSON-LD; bot |
| FAQ | `#faq` in `index.html`; questions on `ai-systems.html` |
| Header or footer | Every page, identically, then run `python scripts/check_partials.py` |
| WhatsApp number | Search for `wa.me/27655465919` and `+27-65-546-5919` |
| Add a page to search | Add a `<url>` to `sitemap.xml` |
