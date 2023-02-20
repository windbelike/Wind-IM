FROM node:16-alpine

ADD . /web_app

WORKDIR /web_app

RUN npm install -g pnpm

RUN pnpm install

CMD pnpm run dev
