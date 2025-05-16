FROM node:22.4-alpine
WORKDIR /frontend
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . /frontend/
CMD [ "npm", "run", "dev" ]