FROM node:18-alpine
 
WORKDIR /user/src/app
 
COPY . .
 
RUN yarn && yarn build

CMD ["yarn", "start:prod"]
