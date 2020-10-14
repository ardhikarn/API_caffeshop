<h1 align="center">ExpressJS - #CAFFESHOP RESTfull API</h1>

## About The Project

This project is a my backend project, the name is Caffeshop App. Its main purpose is to make cafe or shop owner easier to checkout and manage datas in database. More about Express. [More about Express](https://en.wikipedia.org/wiki/Express.js)

## Built With

[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.12.16-green.svg?style=rounded-square)](https://nodejs.org/)

## Requirements

1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)

## How to run the app ?

1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name caffeshop, and Import file sql to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.(ex. http://127.0.0.1:3000/)
8. You can see all the end point [here](#postman-documentation)

## Set up .env file

Open .env file on your favorite code editor, and copy paste this code below :

```
DB_HOST=localhost // Database host
DB_USER=root // Database user
DB_PASS= // Database password
DB_DB=caffe-shop // Database name

PORT=3000 // PORT
IP=127.0.0.1 // IP
URL=http://localhost:8080 //URL to your local website

USER= //Input your email here
PASS= //Input your email's password here

KEY=RAHASIA
```

## Postman Documentation

Link Postman click [here](https://documenter.getpostman.com/view/11699211/TVRoX655)
