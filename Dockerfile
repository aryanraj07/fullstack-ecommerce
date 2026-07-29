FROM node:24-alpine

WORKDIR /usr/src/app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY apps/mini-ecommerce/package.json ./apps/mini-ecommerce/
COPY apps/mini-ecommerce-backend/package.json ./apps/mini-ecommerce-backend/

COPY packages/db/package.json ./packages/db/
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

RUN pnpm install --frozen-lockfile

COPY apps ./apps
COPY packages ./packages

RUN pnpm run build:frontend

CMD ["pnpm","run","start-frontend-app"]