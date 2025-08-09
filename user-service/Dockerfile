FROM node:22.17.1-alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app/

EXPOSE 2048

CMD [ "npm", "run", "start"]