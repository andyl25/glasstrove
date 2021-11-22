# frontend/Dockerfile

# pull official base image
FROM node:16-alpine3.12

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm ci
RUN npm install

# start app
CMD ["npm", "run", "dev"]
