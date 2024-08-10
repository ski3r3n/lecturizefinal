# Use an official Node runtime as the base image
FROM node:18-alpine

# Install dependencies required for PhantomJS
RUN apk add --no-cache bzip2 curl

# Set the OPENSSL_CONF environment variable to /dev/null
ENV OPENSSL_CONF=/dev/null

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
