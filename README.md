# MD Rakib Hossain — Portfolio

Static portfolio site deployed with GitHub Pages.

## Build

Requires Node.js and npm.

```sh
npm ci
npm run build
```

The generated Tailwind stylesheet is committed so GitHub Pages can serve the site without a build step. After changing Tailwind classes, run the build and commit the updated `assets/css/tailwind.generated.css`.

## Languages

Visitors can switch between English and Bengali using the language control in the navigation. Their choice is saved in the current browser.

## Email updates

The subscription form posts to the configured Formspree endpoint in `index.html`. If you change Formspree forms, update that endpoint with the new form ID. The form validates the address and displays clear success or error messages.

## Live concept projects

The three independent concepts have standalone, responsive demos under `projects/`. Careflow's appointment form and Maison's checkout are simulations: they do not contact a clinic, create an order, or process payments. Orbit uses sample replies on GitHub Pages. Its optional Gemini API route is included for a separate Vercel deployment.

- [Careflow Clinic demo](https://rakib-web50.github.io/my-portfolio/projects/careflow-clinic/) · [source](https://github.com/rakib-web50/my-portfolio/tree/main/projects/careflow-clinic)
- [Orbit AI Workspace demo](https://rakib-web50.github.io/my-portfolio/projects/orbit-ai-workspace/) · [source](https://github.com/rakib-web50/my-portfolio/tree/main/projects/orbit-ai-workspace)
- [Maison Form demo](https://rakib-web50.github.io/my-portfolio/projects/maison-form/) · [source](https://github.com/rakib-web50/my-portfolio/tree/main/projects/maison-form)

Each demo is plain HTML, CSS, and JavaScript with no additional dependencies. The source folders are public so visitors can inspect the code.

To enable live Gemini responses, create a Vercel project with `projects/orbit-ai-workspace` as its root directory and set `GEMINI_API_KEY` as a server-side environment variable. Never put the key in client-side code or commit it. The GitHub Pages demo remains in sample-response mode. Set a usage quota with the AI provider before sharing a live endpoint; the included in-memory request limit is only a best-effort burst limit on serverless instances.

## Portfolio placeholders

- The Download CV link points to `assets/MD_Rakib_Hossain_CV_Professional.pdf`.
- Replace `YOUR_LINKEDIN_URL` with your LinkedIn profile URL.
- The social preview image is `assets/images/og-image.png` and should remain 1200 × 630 pixels.
