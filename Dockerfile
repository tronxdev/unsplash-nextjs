FROM node:16.10-alpine

RUN mkdir -p /home/app/ && chown -R node:node /home/app
WORKDIR /home/app
COPY --chown=node:node . .

USER node

RUN npm install --frozen-lockfile
RUN npm build

EXPOSE 3000
CMD [ "npm", "run", "start" ]