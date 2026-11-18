# MD Rakib Hossain — Portfolio

Static portfolio site deployed with GitHub Pages.

## Build

Requires Node.js and npm.

```sh
npm ci
npm run build
```

The generated Tailwind stylesheet is committed so GitHub Pages can serve the site without a build step. After changing Tailwind classes, run the build and commit the updated `css/tailwind.generated.css`.

## Email updates

The subscription form currently stores addresses in the visitor's browser only. It does not send email or notify the site owner; a backend or email-marketing provider must be configured for real subscriptions.
