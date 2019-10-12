
AU Shop
===
> -URL: https://kelolooo.com

AU shop is a price comparison website powered by Node.js, aggregating product listings from five different retailers, including health and beauty products. AU Shop now has 27,000+ products.

Demo
---
![](https://media.giphy.com/media/MEoqiKqdfvbwLcdtbH/giphy.gif)

Features
---
* Integrated different data source from five retailers and sorted by discount
* Clicked "More" button to load more products and filter products by categories
* By clicking product image and user can go to product detail page and see product price comparison results
* Enter the keyword in the search bar, products will be displayed
* Supported email login and Facebook Login
* After logging in, users can add the product to their wishlist by clicking heart icon
* Subscribed notification by clicking bell icon

## Technologies

### Backend

* Web Crawler:
    * Implemented web crawler by **request** module and **cherrio**
    * Schedule auto updating every Wednesday by **cron job** 

* Data Access Object: Applied **DAO** pattern for readability
* Database:
    * Setting **index** for tables for performance
    * Implemented database **CRUD** for user tracklist and wishlist
* RESTful APIs: Build RESTful APIs for front-end development
* Notification: Send email notification with weekly product price by **nodemailer**
* Cache: Add cache mechanism by **node-cache**
* Authentication: Engaged authentication and generated user token by **hash** function in crypto module to ensure user data security


### Front-End
* HTML / CSS
* Bootstrap: Applied Bootstrap for RWD page
* AJAX

### Cloud Service
* AWS EC2： Deployed web server and MySQL server on AWS EC2 instance

### Networking
* HTTP/HTTPS: SSL Certificate with Let's Encrypt SLL
* DNS

### Third party
* Facebook Login API

### Tools: 
* Git / GitHub
* Jest (Unit Test) 

Backend Architecture
---
![](https://i.imgur.com/Jijmnxa.png)


Database Schema
---
![](https://i.imgur.com/n96dysk.png)


Contact
---
Wen-Hua,Chen
E-mail: winnie090400@gmail.com
