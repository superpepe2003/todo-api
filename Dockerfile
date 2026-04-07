FROM node:20-alpine
RUN apk add --no-cache openssl openssl-dev libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production=false
COPY . .
ARG DATABASE_URL="mysql://user:password@localhost:3306/db"
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate
RUN npm run build
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
EXPOSE 3000
CMD ["sh", "-c", "node dist/src/main.js"]