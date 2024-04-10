FROM node:18 AS BUILDER

WORKDIR /app

COPY ./package.json .

RUN apt-get update && apt-get install -y fontconfig
RUN npm install

COPY . .

RUN  npm run build

FROM node:18

COPY --from=BUILDER /app/node_modules ./node_modules
COPY --from=BUILDER ["/app/package.json", "/app/package-lock.json", "./"]
COPY --from=BUILDER /app/.next ./.next

EXPOSE 3000

CMD [ "npm", "run", "start" ]