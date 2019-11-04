FROM node:13

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install && yarn cache clean --force

COPY src/ src/
COPY public/ public/
RUN yarn build

COPY ./ ./

EXPOSE 8080
USER node
CMD [ "node", "nemid-backend.js" ]
