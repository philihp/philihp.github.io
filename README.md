https://philihp.com

Personal site, built with [Next.js](https://nextjs.org) and the
[Nextra](https://nextra.site) blog theme, deployed on
[Vercel](https://vercel.com).

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also generates the Pagefind search index)
```

## Write a post

Posts live in the `content/` directory and use Nextra's
[content-directory](https://nextra.site/docs/file-conventions/content-directory)
convention. The filename maps directly to the URL, and the trailing `.md`
is stripped:

```
content/2026/my-new-post.html.md   ->   /2026/my-new-post.html
```

- Create a branch.
- Add `content/<year>/<slug>.html.md` with front matter:

  ```yaml
  ---
  title: "My New Post"
  date: 2026-06-06
  tags:
    - example
  author: Philihp Busby
  ---
  ```

- Write the body in Markdown. Raw HTML is allowed (`.md` files are compiled
  as CommonMark with `rehype-raw`). For an interactive post that needs
  JavaScript, use an `.mdx` file and import/render a React client component
  instead of an inline `<script>` (see `components/pointille.jsx` and
  `content/2026/announcing-pointille.html.mdx`).
- Open a PR — Vercel will create a preview deployment.

## Create a redirect

Redirects are generated into `redirects.json` and wired up by
`next.config.mjs` (`async redirects()`). To add one, edit `redirects.json`:

```json
{ "source": "/old-path", "destination": "/2026/my-new-post.html", "permanent": true }
```

`scripts/convert-posts.mjs` is the one-time script that migrated the original
Jekyll `_posts/` into `content/` and harvested every `redirect_from` entry into
`redirects.json`.
