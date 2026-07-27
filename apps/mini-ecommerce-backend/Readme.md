# Project Setup

```node
pnpm init
```

### Dev dependcies

```pnpm
pnpm i typescript @types/node tsc-watch

```

### Installing express

```pnpm
pnpm i express
pnpm i @types/express -D
```

## Initialize typescript

```pnpm
tsc --init
```

### Initialize a dev script in package.json

```json
"dev": "tsc-watch --onSuccess \"node dist/index\"",
```

# Seeding Database

```ts
pnpm i @faker-js/faker

```

Was facing error in database seeding with prisma v7 setup so what i changed is

## Prisma Schema provider

```ts
 generator client {
  provider = "prisma-client-js"
}
```

### Create Src Directory

> Create a file index.ts and iniitalize the app using express

## Seed apdaptor provider

> IN prisma client a provider is needed unlike prisma cli

```ts
import "dotenv/config";
import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "@prisma/client";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});
```

# DATABASE_URL="postgresql://aryanraj:Aryan%4017aman@localhost:5432/miniecommerce"

## Migration of schema into db

>

```ts
npx prisma migrate dev --name init
```

## Generate prisma to regenrate client

```ts
npx prisma generate
```

## Seed the Database

```ts
npx prisma  db seed
```

# Trpc Setup

## Benifits

> Apis are

1. Type Safed

2) Well Structured
3) Input Output Validation
4) Open api spec layer over the api for good docs

### Install Trpc

```pnpm
pnpm add @trpc/server
```

> ### Create a router instance

server/trpc.ts

```ts
import { initTRPC } from "@trpc/server";
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
```

### Next, we'll initialize our main router instance, commonly referred to as appRouter, in which we'll later add procedures to. Lastly, we need to export the type of the router which we'll later use on the client side

server/index.ts

```ts
import { router } from "./trpc"; // Root router
const appRouter = router({
  // ...
});
// Export type router type signature,
// NOT the router itself.
// This type will later used by fronted
export type AppRouter = typeof appRouter;
```

### Nowe we will create routes

> Create a folder routes

### We will Start with product routes

> Create a folder prpoduct and inside it a file product.routes.ts

routes/product/product.routes.ts

We will fist write for getAllProducts

```ts
import { router, publicProcedure } from "../../trpc.js";
export const productRouter = router({
  getAllProducts: publicProcedure
    .input()
    .output()
    .query(() => {}),
});
```

### We will write models for product

### What prisma already gives

> ✅ Types
> ✅ Autocomplete
> ✅ Compile-time safety
> ✅ DB structure
> ✅ Migrations

### What prisma does not do

Prisma does NOT:

> ❌ validate HTTP request body
> ❌ validate user input
> ❌ check required fields before hitting DB
> ❌ sanitize strings

### ✅ Two different uses of Zod (important)

There are 2 styles:

> 1️⃣ Validation style (forms/admin)

Validate user input only
Small schemas

2️⃣ Contract style (tRPC/OpenAPI) ← YOU

Define full API response types
Bigger schemas

We’re doing #2.

## Install zod

```pnpm
pnpm i zod
```

### Converting prisma schema to zod

> mportant conversion rules (Prisma → Zod)
> Prisma API JSON Zod
> Int number z.number().int()
> Float/Decimal number z.number()
> String string z.string()
> Boolean boolean z.boolean()
> DateTime Date z.date()
> Json object z.unknown() / z.any()
> String[] string[] z.array(z.string())
> Relation object nested schema
> @default(now()) server generated optional() in output
> autoincrement id number z.number()

### Now in product.routes.ts

> writinq query , if we want to query we should use trpc client
> but we will not use that ,we will go through open api spec
> SO first thing

### We will mount this app router inside express application

> as it is just routes we need to expose it to listen

### For docs

Visit [Google](https://trpc.io/docs/server/adapters) for more information.

> tRPC is not a server on its own, and must therefore be served using other hosts, such as a simple Node.js HTTP Server, Express, or even Next.js. Most tRPC features are the same no matter which backend you choose. Adapters act as the glue between the host system and your tRPC API.
> import express adaptor in trpc.ts

```ts
import * as trpcExpress from "@trpc/server/adapters/express";
```

### Create a context and export it

> create a file
> server/context.ts

```ts
import * as trpcExpress from "@trpc/server/adapters/express";
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
export type Context = Awaited<ReturnType<typeof createContext>>;
```

### In src/index.ts use now

```ts
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);
```

## Now to get open api spec

```pnpm
 pnpm i trpc-to-openapi
```

> Open link for documentaion
> VIew[Google](https://www.npmjs.com/package/trpc-to-openapi)
> trpc.ts

```ts
import type { OpenApiMeta } from "trpc-to-openapi";
const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();
```

> Now we will use this meta in product.routes.ts

```ts
export const productRouter = router({
  getAllProducts: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/products",
        tags: ["Product"],
        description: "Returns all products",
      },
    })
```

> Now we will expose this openapi spec meta data
> in src/index.ts

```ts
import { generateOpenApiDocument } from "trpc-to-openapi";
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "Mini Ecommerce App",
  baseUrl: "http://localhost:8000",
  version: "1.0.0",
});
```

## Now we can even mount open api spec

```ts
import fs from "fs/promises";
fs.writeFile("openapi-specification.json", JSON.stringify(openApiDocument));
```

## Session and Otp Model

> Seperated the models for tracking multiple otp request and multi device logout

## Created the user route and the tokens for cookies to the browser send in response

> Install cookies pareser for parsing request cookies

```js
npm install cookie-parser

```

## Moving forward with checkout and order

Cart → Checkout → Create Order (PENDING)
↓
Create Payment Session
↓
User Pays
↓
Webhook
↓
Update Order to SUCCESS
↓
Clear User Cart

Cart → Checkout → Create Order (PENDING)
↓
Create Razorpay Order
↓
Open Razorpay on frontend
↓
Payment success → Verify signature
↓
Update Order → SUCCESS
Reduce Stock
Clear Cart

## ngrock secret codes

UBFYSYZBPF
ZFEEAN88FT
WYTUC6R4N5
R7FWNHDDKB
QQXBCZTZBX
7AVSVCS59P
ED3P3HX8FK
7HMHPK9FQY
GCCHWVGS2Q
YB2XAHJF5U

### Next Step

> Make success page fetch real order

> Build user order history

Build admin dashboard

Add email notifications

Add order lifecycle management

## TYpe sharing in frontend

Frontend must NEVER import backend source code — only compiled types (.d.ts)
created types.d.ts in backend manually in dist folder
// so creating a script in backend
Even better (future upgrade)

Later you can:

publish backend as package (@repo/api)
use "types": "dist/types.d.ts"
remove api-types package entirely

## BIG Insight (Most important)

Any cookie used in cross-origin (Vercel ↔ Railway) MUST be:

sameSite: "none"
secure: true

### How Node runs

1. The #1 Rule (Never forget)
   Node runs compiled JS from dist — NOT your src code

👉 Everything flows from this.

You write → src/
TypeScript builds → dist/
Node executes → dist
