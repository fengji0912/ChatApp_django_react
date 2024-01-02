# Chat App
# Overview
This repository contains the source code and configuration files for a chat application built using MySQL as the database, Redis for caching, Django with Gunicorn as the backend server, React for the frontend, and Nginx as the reverse proxy, all orchestrated in Docker containers.


# Prerequisites
Make sure you have the following installed on your machine:
- docker
- docker-compose

  
# Getting Started
1. Clone the repository:

    $ git clone https://github.com/fengji0912/ChatApp_django_react.git
    
    $ cd ChatApp_django_react

2. Build all the services:

    $ sudo docker-compose build

3. check if the images are already in the docker:

    $ sudo docker images
    
4. run the application:

    $ sudo docker-compose up
    
5. check if all the services are already running in the docker:

    $ sudo docker ps
    
6. if the app is running well in the docker, then the website "127.0.0.1:8180" can be successfully accessed


