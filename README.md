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

## Portfolio placeholders

- The Download CV link points to `assets/MD_Rakib_Hossain_CV_Professional.pdf`.
- Replace `YOUR_LINKEDIN_URL` with your LinkedIn profile URL.
- Replace the example.com demo URLs and `YOUR_USERNAME` project repository URLs with the real project links.
- The social preview image is `assets/images/og-image.png` and should remain 1200 × 630 pixels.
