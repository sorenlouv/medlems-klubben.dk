FROM node:13

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock node_modules /usr/src/app/
RUN yarn install && yarn cache clean --force
COPY . /usr/src/app

EXPOSE 3000
USER node
CMD [ "yarn", "start" ]
