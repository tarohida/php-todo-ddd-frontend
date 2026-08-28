FROM node:24.20.0-bookworm-slim

WORKDIR /app
RUN chown node:node /app

COPY --chown=node:node package.json package-lock.json ./
USER node
RUN npm ci

COPY --chown=node:node . .

EXPOSE 8080

CMD ["npm", "run", "dev"]
