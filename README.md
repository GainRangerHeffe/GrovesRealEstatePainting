# Groves Real Estate Painting

Website for [Groves Real Estate Painting](https://grovesrealestatepainting.com), a painting company in Erie, PA. Interior and exterior painting for homes, rentals and commercial properties, plus cleanouts and hauling.

Built by [GRH Web Solutions](https://grhwebsolutions.com).

## Stack

Plain HTML, CSS and JavaScript. No build step and no dependencies to install.

- `index.html`: the whole site (single page), including meta tags and JSON-LD structured data
- `styles.css`: design tokens, light and dark themes, responsive layout
- `script.js`: theme toggle, mobile menu, before/after gallery, hero video controls, form sending
- `contact.vcf`: contact card behind the "Save our contact" button
- `robots.txt`, `sitemap.xml`, `llms.txt`: crawler and AI-assistant discovery files
- `image/`: logo, icons, social share card and hero video
- `images/`: before and after project photos

Forms are sent with [EmailJS](https://www.emailjs.com/). If EmailJS is unavailable the form falls back to opening the visitor's mail app with the message filled in.

## Run locally

Any static file server works:

```bash
npx serve .
```

## Deploy

The site is hosted on Hostinger. Upload the contents of this folder to `public_html`.

## SEO checklist when editing

- Keep the business name, phone numbers and service area identical in the page copy, the JSON-LD block in `index.html`, `llms.txt` and `contact.vcf`.
- The FAQ section and the `FAQPage` JSON-LD must say the same thing. Change both together.
- Update `lastmod` in `sitemap.xml` after content changes.
