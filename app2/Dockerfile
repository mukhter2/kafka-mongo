FROM node:16.9.0-alpine

# ENV NODE_VERSION 20.3.1
WORKDIR /app
COPY package.json index.js /app/
RUN npm install
RUN npm i -g nodemon
CMD [ "nodemon","index.js" ]