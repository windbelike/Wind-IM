FROM node:16-alpine

ADD . /web_app

WORKDIR /web_app

RUN npm install

RUN npm run migrate

CMD npm run dev