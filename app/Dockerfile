FROM node:18-alpine

WORKDIR /usr/src/app

COPY ["./package.json", "package-lock.json", "./"]
RUN npm install && npm install typescript -g
COPY ["./tsconfig.json", "./"]
COPY ["./app.js", "./"]
COPY ["./ts", "./ts"]
COPY ["./private", "./private"]
COPY ["./public", "./public"]
CMD ["npm", "test"]