FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose the application port
EXPOSE 3000

# Expose the monitoring port
EXPOSE 9100

# Run the application with monitoring enabled
CMD ["npm", "run", "start"]
