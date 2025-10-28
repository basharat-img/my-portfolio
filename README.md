This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## MongoDB Atlas configuration

The admin sign-up flow uses the MongoDB Atlas Data API. Create a `.env.local` file based on `.env.example` and provide your Atlas credentials:

```bash
cp .env.example .env.local
# Then populate each value with your Atlas Data API settings
```

| Variable | Description |
| --- | --- |
| `MONGODB_DATA_API_URL` | Base URL for the Data API endpoint (e.g. `https://data.mongodb-api.com/app/<APP_ID>/endpoint/data/v1`). |
| `MONGODB_DATA_API_KEY` | A Data API key with insert/read access. |
| `MONGODB_DATA_SOURCE` | Atlas cluster or data source name. |
| `MONGODB_DATA_DATABASE` | Database that stores admin users. |
| `MONGODB_DATA_COLLECTION` | Collection for admin users (defaults to `admins`). |

The sign-up API checks for existing usernames, enforces single-word values for each admin field, hashes the password with `scrypt`, and stores timestamps for auditing.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
