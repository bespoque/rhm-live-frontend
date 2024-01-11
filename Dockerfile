FROM node:14-alpine3.18
RUN mkdir -p /home/app
RUN 
WORKDIR /home/app
COPY . /home/app
RUN npm i
RUN npm run build
ENTRYPOINT npx next start
#ENTRYPOINT npm run dev -f
#ENTRYPOINT sh initial_cmd.sh
