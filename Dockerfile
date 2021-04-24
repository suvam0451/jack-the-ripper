FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./ 'Cached docker layer'
RUN yarn install
COPY . .

EXPOSE 3000
CMD ["yarn", "start"]
