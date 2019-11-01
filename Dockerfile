FROM node:13

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/
RUN yarn install && yarn cache clean --force
COPY . /usr/src/app

RUN yarn build

EXPOSE 8080
USER node
CMD [ "node", "nemid-backend.js" ]
