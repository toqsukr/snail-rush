FROM node:22-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --check-files
COPY . .

ARG VITE_CLIENT_IP
ARG VITE_CLIENT_PORT
ENV VITE_CLIENT_IP=$VITE_CLIENT_IP
ENV VITE_CLIENT_PORT=$VITE_CLIENT_PORT
ENV NODE_OPTIONS=--max-old-space-size=2048
RUN yarn build

FROM nginx:1.25-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
