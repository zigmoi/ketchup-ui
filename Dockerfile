FROM node:15.5.1-alpine3.10
WORKDIR /app
COPY build /app
RUN npm install -g serve
CMD ["/bin/sh", "-c", "serve . -l 3000"]