# SEO Notes

## Action required: create the social sharing image

Every page now includes Open Graph and Twitter Card tags that reference:

```
https://aurioncreative.com/assets/images/logos/og-image.png
```

**This file does not exist yet.** Create a branded 1200x630px PNG (logo on the dark
`#1F2A2E` background with the lime `#C1FF72` accent works well) and save it to:

```
assets/images/logos/og-image.png
```

Until the image exists, link previews on WhatsApp, LinkedIn, Facebook, and X will
show no image.

## Action required: Formspree form ID

The lead-capture forms send via Formspree with AJAX (no redirect, inline success
and error messages). Create or reuse a form at https://formspree.io/forms, copy its
ID (your previous form used `xnnewgvw`), and paste it in **two places**, replacing
`YOUR_FORMSPREE_ID`:

1. `html/contact.html`, in the script block at the bottom (main contact form).
2. `html/index.html`, in the script block at the bottom. This powers the homepage
   contact form and also emails you a copy of every quote request.

Until the ID is set, the contact forms show their error message on submit, and the
quote form falls back to only sending the customer their EmailJS invoice.

The quote form's customer-facing invoice email still uses the existing EmailJS
setup (`service_g6gr5oq` / `template_sz1jcum`); no change needed there.

## Also in this pass

- `sitemap.xml` and `robots.txt` were added at the repo root. Submit the sitemap
  in Google Search Console.
- Unique titles, meta descriptions, Open Graph and Twitter tags on every page.
- JSON-LD LocalBusiness + Service structured data on `html/index.html`.
