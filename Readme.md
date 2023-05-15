# Karyajaya API

# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- Setup Environment
  - This project uses [dotenv](https://www.npmjs.com/package/dotenv), please configure the proper environment variables before running this application. Edit all sample field with the correct environment variables for the application server in `.env` file
    
- `npm start` to start the local server

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [sequelize](https://github.com/sequelize/sequelize) - For modeling and mapping Database data to javascript 

## Authentication

Requests are authenticated using the `Authorization` header with a valid JWT. Request/Routes that need `Authentication` will have `verifyToken.verifyToken` as their middleware. We define middlewares in `app/middleware/verifyToken.js` that can be used to authenticate requests. The middleware configures the `jsonwebtoken` using our application's secret and will return a 401 status code if the request cannot be authenticated.