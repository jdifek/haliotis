ARG BASE_IMAGE=node:20-alpine

FROM $BASE_IMAGE AS deps
RUN apk add --no-cache libc6-compat bash
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM $BASE_IMAGE AS runner

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_DOMAIN
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_API_DOMAIN=${NEXT_PUBLIC_API_DOMAIN}

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]

