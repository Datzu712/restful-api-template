FROM node:22-alpine3.19 as build

WORKDIR /app

COPY package*.json ./

# COPY ./ssl ./ssl

RUN npm install

COPY . .

RUN npm run build

# Etapa de producción
FROM node:22-alpine3.19 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

RUN npx prisma generate

COPY .env ./

#COPY --from=build /app/ssl ./ssl

COPY --from=build /app/dist ./dist

CMD ["node", "dist/main"]