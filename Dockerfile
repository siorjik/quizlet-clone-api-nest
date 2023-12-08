FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app/

ARG ENV_NAME

RUN yarn install

COPY . .

EXPOSE 8080

RUN yarn build

# ENTRYPOINT [ "yarn", "start:production" ]
# ENTRYPOINT yarn start:ENV_NAME
# CMD [ "yarn", "start" ]