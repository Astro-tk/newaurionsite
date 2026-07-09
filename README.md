# Aurion Creative Website

Live site: https://aurioncreative.com (GitHub Pages, custom domain via `CNAME`)

Static site built on Bootstrap 5 with jQuery, AOS scroll animations, Owl Carousel, and
Iconify icons. All pages live at the repository root; assets live in `assets/`.

---

## Action required after deploying

These are the only manual steps left. Everything else is done.

### 1. Formspree (done, for reference)

The forms are wired to two Formspree endpoints:

| File | Form ID | Powers |
|---|---|---|
| `contact.html` | `xjgqqjdo` | Main contact form |
| `index.html` | `mgojjrbe` | Homepage contact form, plus a copy of every quote request sent to your inbox |

Manage them at https://formspree.io/forms. The quote form also sends the customer an
invoice through the existing EmailJS setup (`service_g6gr5oq` / `template_sz1jcum`).

### 2. Create the social sharing image

Every page references `assets/images/logos/og-image.png`, which does not exist yet.
Create a 1200x630 PNG (logo on the dark `#1F2A2E` background with the lime `#C1FF72`
accent works well) and save it at that exact path. Until then, WhatsApp, LinkedIn,
and Facebook link previews show no image.

### 3. Replace the BOQ project placeholder images

`projects-detail-7.html` (BOQ Automation Platform) currently uses copies of existing
site photos. Drop real product screenshots over these two files, no HTML changes needed:

- `assets/images/portfolio/portfolio-img-7.jpg` (card thumbnail, projects grid and homepage carousel)
- `assets/images/backgrounds/projects-detail-banner-7.jpg` (page banner)

### 4. Get Google indexing the site (Search Console)

1. Go to https://search.google.com/search-console and add the property `aurioncreative.com`
   (use the Domain property type; verify with a DNS TXT record at your domain registrar).
2. Submit the sitemap: enter `sitemap.xml` under Indexing, then Sitemaps.
3. Use URL Inspection on `https://aurioncreative.com/`, `about-us.html`, `contact.html`,
   and `projects.html` and click "Request indexing" for each.
4. Optional but high impact for local search: create a free Google Business Profile at
   https://business.google.com (category: "Website designer" or "Software company",
   location Pretoria). This is what puts you on the map panel when people search your
   business name.

Indexing typically takes a few days to a few weeks. Old `/html/...` URLs redirect to
the new clean URLs and will drop out of the index on their own.

---

## URL structure

Pages moved from `/html/*.html` to the repository root in July 2026, so URLs are clean:

- `https://aurioncreative.com/` (homepage)
- `https://aurioncreative.com/about-us.html`
- `https://aurioncreative.com/contact.html`
- `https://aurioncreative.com/projects.html` plus `projects-detail-1..7.html`
- `https://aurioncreative.com/blog.html` plus `blog-detail-1..3.html`
- `https://aurioncreative.com/thank-you.html` (noindex)
- `https://aurioncreative.com/404.html` (noindex; GitHub Pages now serves it automatically for missing URLs)

The old `/html/` folder contains only redirect stubs (instant meta refresh plus a
canonical tag pointing at the new URL) so old links, bookmarks, and indexed pages
keep working. Do not delete the `html/` folder.

---

## SEO already in place

- Unique `<title>` and 140-160 character meta description on every page
- Canonical link tag on every page (the generic `blog-detail.html` template
  canonicalises to `blog-detail-1.html` to avoid duplicate content)
- Open Graph and Twitter Card tags on every page
- JSON-LD structured data on the homepage: LocalBusiness (Pretoria, ZA) plus the three
  service offerings (AI Automation and Chatbots, Web Design and Development, Custom Software)
- `sitemap.xml` with clean URLs and lastmod dates; `robots.txt` pointing to it
- `noindex` on utility pages (thank-you, 404); redirect stubs for the old `/html/` URLs
- Descriptive alt text on portfolio images
- Google Analytics (`G-936RHVHQ8W`) on every page
- Mobile optimisation via `assets/css/mobile.css` (phones only; desktop untouched)

## What was upgraded (change log)

1. **SEO overhaul**: titles, meta descriptions, OG and Twitter tags, JSON-LD, sitemap,
   robots.txt; template leftovers removed (Studiova, WrapPixel, ThemeWagon, sign-in and
   sign-up pages, stale backup files); thank-you page rebuilt with the site header and footer.
2. **Lead pipeline**: contact form and homepage form post to Formspree with AJAX
   (inline success and error states, spam honeypot, no page reload); the quote
   calculator sends the customer an EmailJS invoice and, once Formspree is configured,
   sends you a copy of every quote request so no lead is lost. The homepage form was
   previously dead (it submitted nowhere).
3. **Conversion flow**: hero CTAs (Get an Instant Quote, Chat on WhatsApp), rewritten
   FAQ with real pricing and timelines plus an "Ask on WhatsApp" row, WhatsApp
   follow-up links in every success state, quick-contact panel (WhatsApp, call, email)
   next to the homepage form.
4. **Floating buttons**: the AI chatbot bubble owns the homepage corner; the WhatsApp
   float appears on every other page. The two never overlap.
5. **Mobile optimisation**: smaller display type, compact buttons, shorter banners,
   fixed button-wrapping bugs. All rules live in `assets/css/mobile.css` inside a
   phones-only media query.
6. **BOQ Automation Platform** case study added (`projects-detail-7.html`), featured
   first in the projects grid and homepage carousel.
7. **Services updated**: brand identity, graphic design, and content creation removed
   everywhere as offered services (services section, FAQ, quote calculator, contact
   dropdown, structured data). Portfolio pages keep their history.
8. **About page rework**: real company story, honest stats, current-services marquee,
   How We Work steps, and a Connect card featuring the LinkedIn page.
9. **URL restructure**: pages moved to the root with redirects from the old paths,
   canonicals everywhere, and a rebuilt sitemap.

---

## Editing cheat sheet

| Change | Where |
|---|---|
| Page title or meta description | `<head>` of each page (also update the matching `og:` and `twitter:` tags) |
| Quote calculator pricing | `pricing` object in the script at the bottom of `index.html` |
| WhatsApp number | Search all files for `wa.me/27655465919` and `+27-65-546-5919` |
| FAQ questions | `#faq` section in `index.html` |
| Services copy | `#services` section in `index.html` |
| Chatbot | Botpress scripts at the bottom of `index.html` |
| Mobile-only styling | `assets/css/mobile.css` |
| Add a page to search results | Add a `<url>` entry to `sitemap.xml` |

## Ideas to push SEO further

- Publish a blog post every few weeks targeting searches your customers make
  ("AI chatbot for small business South Africa", "website cost Pretoria"). The blog
  section exists; fresh content is the biggest remaining lever.
- Get listed on local directories and ask past clients for LinkedIn recommendations
  and Google reviews (reviews feed the Business Profile ranking).
- Add real client names and results to the portfolio pages; specific numbers rank
  and convert better than generic descriptions.
- Compress the hero video and large JPGs (page speed is a ranking factor); consider
  WebP versions of portfolio images.
- Once you have a Google Business Profile, embed the same name, address, and phone
  consistently in the footer of every page.
