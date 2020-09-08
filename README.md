<h1 align="center">ExpressJS - #CAFFESHOP RESTfull API</h1>

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
7. Choose HTTP Method and enter request url.(ex. localhost:3000/)
8. You can see all the end point [here](#end-point)

## Set up .env file

Open .env file on your favorite code editor, and copy paste this code below :

```
DB_HOST=localhost // Database host
DB_USER=root // Database user
DB_PASS= // Database password
DB_DB=caffe-shop // Database name
PORT=3000 // PORT
IP=127.0.0.1 // IP
```

## End Point

**1. GET**

- `/users` (Get all user)
- `/users/login` (Login user)
- `/product` (Get all product)
- `/product/:id` (Get product by id)
- `/category` (Get all category)
- `/category/:id` (Get category By Id)
- `/order` (Get all order)
- `/order/:id` (Get order By Id)
- `/history` (Get all history)
- `/history/:id` (Get history By Id)

**2. POST**

- `/users/register` (Register user)
  - `{ "user_name": "admin", "user_email": "admin@caffeshop.com", "user_password": 12345678, "user_role": 2, "user_status": 0 }`
- `/product` (Post product)
  - `{ "product_name": "espresso", "product_image": "#", "category_id": 1, "product_price": 10000 , "product_status" : 1 | 0}`
- `/category` (Post category)
  - `{ "category_name": "coffe", "category_status": 1 }`
- `/order` (Post order)
  - `{ "orders": [{ "product_id": 1, "order_qty": 2 }, { "product_id": 2, "order_qty": 2 }] }`

**3. PATCH**

- `/users/edit/:id` (Update user by id)
  - `{"user_name": "admin", "user_email": "admin@caffeshop.com", "user_password": 12345678, "user_role": 2, "user_status": 0}`
- `/product/:id` (Update product by id)
  - `{"product_name" : "coffe latte", "product_image": "#", "category_id" : 1, "product_harga" : 15000, "product_status" : 1 | 0}`
- `/category/:id` (Update category by id)
  - `{ "category_name": "coffe", "category_status": 1 }`

**4. DELETE**

- `/product/:id` (Delete product by id)
- `/category/:id` (Delete category by id)

## Postman

Link Postman : https://www.getpostman.com/collections/e96172b4ff299c2bba16
