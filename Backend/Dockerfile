FROM node:20.8-alpine3.18

WORKDIR /app

COPY package.json .

COPY package-lock.json .

COPY tsconfig.json .

COPY .env .

COPY ./src ./src

COPY ./prisma ./prisma

RUN apk update && apk add bash

RUN apk add python3

RUN npm install

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]