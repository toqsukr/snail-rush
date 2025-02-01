# Stage 1: Build
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy project files
COPY . .

# Build the project
RUN yarn build

# Stage 2: Run
FROM nginx:1.25-alpine

# Copy built files to Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/sites-available/
COPY default.conf /etc/nginx/conf.d/
COPY default.conf /etc/nginx/sites-enabled/

COPY ./ssl/snail-rush.pem /etc/nginx/ssl/snail-rush.pem
COPY ./ssl/snail-private.key /etc/nginx/ssl/snail-private.key

# Expose port
EXPOSE 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

