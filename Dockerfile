FROM node:alpine AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile



FROM node:alpine AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline



FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production
COPY --from=builder /app/dist ./dist


COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "."]