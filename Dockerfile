FROM node:20.11.1-alpine3.19

USER node

WORKDIR /game-server

COPY package.json .

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "server.js" ]
