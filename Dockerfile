FROM node:19.7-slim
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3002
CMD ["node", "index.js"]
# CMD ["ls", "-l"]
