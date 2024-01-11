FROM node:16.20.2-alpine3.18
RUN mkdir -p /home/app
WORKDIR /home/app
COPY . /home/app
RUN npm ci \
    npm run build
ENTRYPOINT npm start
#ENTRYPOINT npm run dev -f
#ENTRYPOINT sh initial_cmd.sh
