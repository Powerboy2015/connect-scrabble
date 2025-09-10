FROM node:20-alpine3.19

RUN apk update && apk upgrade

WORKDIR /app
RUN npm install -g live-server

# Mount your frontend directory at runtime
EXPOSE 80
CMD ["live-server", "--host=0.0.0.0", "--port=80", "--watch=."]
