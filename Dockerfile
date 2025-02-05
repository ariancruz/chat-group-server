LABEL authors="arian cruz"
# Use the official Node.js 18 image as the base image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define environment variables
ENV PORT=3000
ENV MONGODB_URI=your_mongodb_uri
ENV TOKEN_SECRET=your_token_secret
ENV GEMINI_API_KEY=your_gemini_api_key
ENV GEMINI_MODEL=gemini-2.0-flash-exp

# Start the application
CMD ["npm", "run", "start:prod"]
