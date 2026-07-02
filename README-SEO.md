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

## Action required: EmailJS contact-form template

The contact form on `html/contact.html` now sends via EmailJS instead of Formspree.
It reuses the site's existing EmailJS public key and service ID, but needs a new
template. In the EmailJS dashboard, create a template with the variables
`{{name}}`, `{{email}}`, `{{phone}}`, `{{service}}`, `{{message}}`, then replace
`YOUR_TEMPLATE_ID` in the script block at the bottom of `html/contact.html`.

## Also in this pass

- `sitemap.xml` and `robots.txt` were added at the repo root. Submit the sitemap
  in Google Search Console.
- Unique titles, meta descriptions, Open Graph and Twitter tags on every page.
- JSON-LD LocalBusiness + Service structured data on `html/index.html`.
