# SpotiVo

### SpotiVO is [![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/sindresorhus/awesome)

## Index
- [Requirements](#requirements)
- [Installation](#installation)
- [References](#references)

## Requirements
- NodeJS: https://nodejs.org/en/
- MySQL: https://www.mysql.com/
- mongoDB: https://www.mongodb.com

##Installation

### MySQL:
Install MySQL:
```bash
$ sudo apt-get -y install mysql-server
```
Import Database:
```bash
$ sudo mysql -u <username> -p < mysql.sql
$ sudo mysql -u <username> -p < user.sql
```

####Optional:
Install apache2:
```bash
$ sudo apt-get -y install apache2
```
Install phpMySQL (https://www.phpmyadmin.net/):
```bash
$ sudo apt-get install phpmyadmin
$ sudo dpkg-reconfigure -plow phpmyadmin
```

### mongoDB:
[Install MongoDB](https://docs.mongodb.com/manual/installation/)

Import Database:
```bash
$ mongorestore --db session [ProjectDirectory]/mongo/session/
```



## References
###Tutorials
MySQL Docker Containers: http://severalnines.com/blog/mysql-docker-containers-understanding-basics
###Code Snippets
#### NodeJS
Example: https://example.com
