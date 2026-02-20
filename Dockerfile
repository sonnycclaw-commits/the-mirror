FROM node:20-alpine
WORKDIR /app
COPY mirror.js .
COPY package.json .
ENV PORT=3003
EXPOSE 3003
CMD ["node", "mirror.js"]
