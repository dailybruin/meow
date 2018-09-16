FROM node:8

WORKDIR /app/frontend

COPY ./meow/frontend/package*.json /app/frontend/

RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]