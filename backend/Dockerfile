FROM node:20-slim

WORKDIR /app

# Install OpenSSL and other dependencies for Prisma
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --legacy-peer-deps

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 4000

CMD ["sh", "-c", "npx prisma db push && npx prisma db seed && node dist/src/main"]
