# Unsplash app built by Next.js@latest + Turbopack

## Prerequisite

1. Node@16+
2. npm@8+
3. next@13+
4. react@18+

## Running Locally

1. Install dependencies: `npm i`
2. Start the dev server: `npm run dev`
3. Start the dev server with Turbopack: `npm run dev:turbopack`
4. See your binaries: `npx next info`

**Note:** This app uses [Tailwind CSS](https://tailwindcss.com). However, Turbopack does not yet support fully [PostCSS](https://turbo.build/pack/docs/features/css#postcss), but it does support CSS and CSS Modules.

[Turbopack](https://turbo.build/pack) is a new incremental bundler optimized for JavaScript and TypeScript, written in Rust by the creators of Webpack and Next.js at [Vercel](https://vercel.com). On large applications Turbopack updates 10x faster than Vite and 700x faster than Webpack ([benchmark](https://turbo.build/pack/docs/benchmarks)). For the biggest applications the difference grows even more stark with updates up to 20x faster than Vite.

**As a reminder, Turbopack is currently in alpha and not yet ready for production, so that the build may not be successful for now.**
