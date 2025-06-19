# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --check-files --frozen-lockfile
COPY . .
RUN yarn build

# Stage 2: Run
FROM nginx:1.25-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
COPY ./ssl/snail-rush.pem /etc/nginx/ssl/
COPY ./ssl/snail-private.key /etc/nginx/ssl/

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]