FROM node:16-alpine

ADD . /server_app

WORKDIR /server_app

RUN npm install -g pnpm

RUN pnpm install

CMD pnpm run dev