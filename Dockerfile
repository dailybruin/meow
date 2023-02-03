# Stage 0 - Node build
FROM node:10
WORKDIR /meow
ADD package.json package-lock.json /meow/
RUN npm install
COPY ./webpack.config.js ./webpack.prod.config.js ./jsconfig.json ./
COPY meow/frontend meow/frontend
RUN npm run build-production

FROM python:3.7
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /meow

RUN apt-get update && apt-get install -y curl \
  build-essential \
  libpq-dev

ADD requirements.txt /meow/
RUN pip install -U -r requirements.txt

COPY --from=0 /meow /meow

ADD . /meow/

EXPOSE 5000

ENTRYPOINT ["./entrypoint.sh"]