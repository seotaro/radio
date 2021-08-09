FROM node:15-slim

WORKDIR /workspace

COPY package*.json ./
RUN yarn install
COPY index.js ./

CMD [ "node", "index.js" ]
