# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /myreact

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install \
    react \
    react-dom \
    webpack webpack-cli --save-dev \
    --save-dev style-loader css-loader file-loader \
    --save-dev html-webpack-plugin \
    clean-webpack-plugin --save-dev \
    --save-dev babel-loader @babel/core \
    --save-dev @babel/preset-react \
    --save-dev @babel/preset-env \
    react-router-dom \
    webpack-dev-server --save-dev \
    fetch


# Copy the local code into the container
COPY . .

# Build the React app for production
RUN npm run compile


