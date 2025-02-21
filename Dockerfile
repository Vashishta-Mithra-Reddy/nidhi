# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built assets from the previous stage
COPY --from=builder /app ./

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
