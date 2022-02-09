FROM node:16-alpine

WORKDIR /app

# Build frontend
COPY ./frontend ./frontend
RUN cd frontend && npm install && npm run build


# Build server
COPY package.json .
RUN npm install

COPY server.js .

ENTRYPOINT [ "node", "server.js" ]