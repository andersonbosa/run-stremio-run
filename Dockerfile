FROM node:20.18.1-alpine3.19

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start"]
