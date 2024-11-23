## About

It uses [Turborepo](https://turborepo.org/) and contains:

```
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  └─ next.js
      ├─ Next.js
      ├─ React
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  |   └─ tRPC v10 router definition
  ├─ auth
  |   └─ Authentication using next-auth.
  ├─ config
  |   └─ Shared Tailwind & Eslint configs
  └─ db
      └─ Typesafe db calls using Prisma
```

## Quick Start

To get it running, follow the steps below:

### Setup dependencies

```diff
# Install dependencies
pnpm i

# Configure environment variables.
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the ecommerce schema to the database with clean start
pnpm  db:push --force-reset


# Push the ecommerce schema to the database
pnpm db:push


# Seed the ecommerce schema with data
pnpm db:seed
```

pnpm run dev

default user sing in info

email :manager@test.com  
 password : asddsa

## References

The stack originates from [create-t3-app](https://github.com/t3-oss/create-t3-app).

A [blog post](https://jumr.dev/blog/t3-turbo) where I wrote how to migrate a T3 app into this.
