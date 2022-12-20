# Unsplash app built by Next.js@latest + Turbopack

## Prerequisite

1. Node@16+
2. npm@8+
3. next@13+
4. react@18+

## Running locally

1. Install dependencies:

    ```console
    npm i
    ```

2. Start the dev server:

    ```console
    npm run dev
    ```

3. Start the dev server with Turbopack:

    ```console
    npm run dev:turbopack
    ```

4. See your binaries:

    ```console
    npx next info
    ```

## Dockerize the app

1. Build Docker image

    ```console
    docker build -t unsplash-nextjs .
    ```
2. Deploy the image in your container and run it:

    ```console
    docker run --name unsplash-nextjs-container --env-file .env.local -p 0.0.0.0:3000:3000 unsplash-nextjs
    ```

**Note:** This app uses [Tailwind CSS](https://tailwindcss.com). However, Turbopack does not yet support fully [PostCSS](https://turbo.build/pack/docs/features/css#postcss), but it does support CSS and CSS Modules.

[Turbopack](https://turbo.build/pack) is a new incremental bundler optimized for JavaScript and TypeScript, written in Rust by the creators of Webpack and Next.js at [Vercel](https://vercel.com). On large applications Turbopack updates 10x faster than Vite and 700x faster than Webpack ([benchmark](https://turbo.build/pack/docs/benchmarks)). For the biggest applications the difference grows even more stark with updates up to 20x faster than Vite.

**As a reminder, Turbopack is currently in alpha and not yet ready for production, so that the build may not be successful for now.**

