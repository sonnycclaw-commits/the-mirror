FROM node:20-alpine
WORKDIR /app
COPY mirror.js .
COPY package.json .
EXPOSE 3003
CMD ["node", "mirror.js"]
