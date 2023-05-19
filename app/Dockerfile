FROM node:18-alpine

WORKDIR /usr/src/app

COPY ["./package.json", "package-lock.json", "./"]
RUN npm install
COPY ["./app.js", "./"]
COPY ["./private", "./private"]
COPY ["./public", "./public"]

CMD ["node","app.js"]