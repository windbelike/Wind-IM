FROM node:16-alpine

ADD . /wind-im

WORKDIR /wind-im

RUN npm install

CMD npm run dev