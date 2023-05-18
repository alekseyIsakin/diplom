FROM node:18-alpine

WORKDIR /usr/src/app

# Postgres connection
ENV PORT=8000
ENV PGUSER='postgres'
ENV PGDB='postgres'
ENV PGPASSWORD='123'
ENV PGPORT=5432
ENV PGHOST='192.168.3.4'
# Agora data
ENV APPID='8f5f3639ee4941238369d5ecbcecad14'
ENV APPCERTIFICATE='ec57503c48804262a6eebd6236f15e75'

ENV LOG_LEVEL='debug'


COPY ["./package.json", "package-lock.json", "./"]
RUN npm install
COPY ["./app.js", "./"]
COPY ["./private", "./private"]
COPY ["./public", "./public"]

CMD ["node","app.js"]