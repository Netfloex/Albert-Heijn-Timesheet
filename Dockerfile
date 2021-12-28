ARG NODE_IMAGE=node:12-alpine

FROM $NODE_IMAGE AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM $NODE_IMAGE AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
ENV NEXT_TELEMETRY_DISABLED 1

# Temporary until Next.js swc updates for arm
RUN echo '{"presets":["next/babel"]}' > .babelrc

RUN yarn build
RUN yarn build:notifications

RUN yarn install --production --ignore-scripts --prefer-offline


FROM $NODE_IMAGE AS runner

# Install Apprise

RUN apk add --no-cache python3 py3-six py3-requests py3-cryptography && \
	apk add --no-cache --virtual=build-dependencies py3-pip && \
	pip3 install --no-cache-dir --upgrade apprise && \
	apk del --purge build-dependencies

WORKDIR /app

ENV NODE_ENV production
ENV STORE_PATH /data/store.json
ENV FORCE_COLOR 1

COPY --from=builder /app/next.config.js ./
# COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src/entrypoint.sh ./

COPY --from=builder /app/dist/index.js ./notifications.js


EXPOSE 3000

CMD ["./entrypoint.sh"]