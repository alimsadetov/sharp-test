ARG NODE_IMAGE_NAME=18-bullseye-slim
ARG NODE_ENV=production
FROM node:${NODE_IMAGE_NAME} AS deps
WORKDIR /app
ENV NODE_ENV=${NODE_ENV}

COPY package*.json .
RUN --mount=type=cache,target=/root/.npm,sharing=locked npm ci

FROM node:${NODE_IMAGE_NAME} AS builder
WORKDIR /app
ENV NODE_ENV=${NODE_ENV}

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

FROM node:${NODE_IMAGE_NAME}
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json /app/tsconfig.json /app/tsconfig.build.json /app/nest-cli.json ./

CMD npm run start:prod
