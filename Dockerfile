FROM node:14.21.3-alpine3.16
RUN mkdir -p /home/app
WORKDIR /home/app
COPY . /home/app
RUN npm i \
    npm run build
ENTRYPOINT npx next start
#ENTRYPOINT npm run dev -f
#ENTRYPOINT sh initial_cmd.sh
