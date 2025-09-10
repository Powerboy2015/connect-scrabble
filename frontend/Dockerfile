FROM node:20-alpine

WORKDIR /app
RUN npm install -g live-server

# We'll mount your local frontend files here
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 8080
CMD ["live-server", "--host=0.0.0.0", "--port=80", "--watch=.", "--wait=0", "--no-browser", "--verbose"]