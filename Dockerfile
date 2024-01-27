FROM node:16-alpine3.15

RUN mkdir -p /home/app/

WORKDIR /home/app/

RUN npm i anywhere -g

RUN npm i pnpm -g

COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpm install

RUN pnpm run build:user

EXPOSE 8080

EXPOSE 4000

CMD pnpm run deploy:user 
