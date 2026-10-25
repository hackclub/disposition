# todo: check if node:22-bookworm-slim is vulnerable to the latest bullshit
# also todo: make file better? like idk, this is some ai genned bullshit. seems to work fine tho.
# too lazy to look over it properly rn

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /app

FROM base AS build
# better-sqlite3 is a native module; build tools are needed if no prebuilt binary matches
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*
COPY . .
RUN pnpm install --frozen-lockfile
# prerendering loads the Slack Bolt client, which needs tokens to exist.
# these placeholders only live in this stage; real secrets are supplied at runtime.
RUN SLACK_TOKEN=xoxb-build-placeholder SLACK_APP_TOKEN=xapp-build-placeholder pnpm build

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app/.output ./.output
RUN mkdir -p /app/.data && chown node:node /app/.data
# local blob storage (uploads) lives here, mount a volume to keep it
VOLUME ["/app/.data"]
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
