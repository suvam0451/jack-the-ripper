FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json yarn.lock ./
RUN yarn
COPY . .

EXPOSE 4000
EXPOSE 27017

CMD ["yarn", "serve"]