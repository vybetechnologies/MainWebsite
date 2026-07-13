# VYBE Newsroom — Editorial Workflow

This is the Sanity Studio used to manage content for the [VYBE Technologies
website](../artifacts/vybe-website) Newsroom (`/newsroom`). It is a
standalone, hosted CMS admin tool — it is **not** part of the website's
build and has no preview in the Replit workspace.

## Where to log in

The hosted Studio lives at **https://vybe-newsroom.sanity.studio/**.

Log in with a Sanity account that has been invited as a member of the
project (project id `fupqvdcv`). To invite a new editor, an existing project
admin can add them from the "Manage" link inside the Studio, or via
https://www.sanity.io/manage.

## Publishing a news item

1. Open the Studio and click **News Article** in the left sidebar, then
   **+ Create new**.
2. Fill in:
   - **Title** — the headline.
   - **Slug** — click "Generate" to derive it from the title. This becomes
     the article's URL: `vybetechnologies.net/newsroom/<slug>`.
   - **Category** — one of Press Release, Product Announcement, Company
     News, or Community Initiative. This drives the filter buttons on the
     Newsroom page.
   - **Published At** — the date shown on the listing and article page.
   - **Summary** — one or two sentences shown on cards and previews.
   - **Main Image** — the card/hero image. Alt text is required.
   - **Body** — the full article, written in the rich text editor
     (headings, paragraphs, images, links all supported).
3. Click **Publish** in the bottom-right. Unpublished drafts never appear
   on the live site.

## How content reaches the website

The website (`artifacts/vybe-website`) is a **statically exported** Next.js
site. It fetches Sanity content only at **build time**, not at runtime —
so a newly published article will not appear live automatically.

To publish new/edited content to the live site, the website needs to be
rebuilt and redeployed (ask the development team, or trigger a redeploy
from the Replit workspace). There is no autopublish webhook configured.

## Deploying Studio changes

If the schema (`schemaTypes/`) or Studio config changes, redeploy the
hosted Studio from this directory:

```
SANITY_AUTH_TOKEN=<a Sanity API token> npx sanity deploy --url vybe-newsroom -y
```
