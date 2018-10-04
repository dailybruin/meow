FROM node:8

WORKDIR /frontend/

COPY ./meow/frontend/ /frontend/

RUN rm -rf /frontend/node_modules/ && rm -rf /frontend/static/

RUN npm install

EXPOSE 8080

RUN pwd && ls

CMD npm run build
