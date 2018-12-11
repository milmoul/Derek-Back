# Welcome to HelloDereks smart FAQ

First we need to check you have the correct node version

Now lets clone the repo, go to the folder you want the app to run and open a terminal in that folder

    git clone https://gitlab.paris-digital-lab.com/mokoloco/derek-back.git

Now install the dependencies 

    npm install

Now there are two ways to run the app, localy for dev purposes or on a remote server on heroku for production

1. Local deployment

a. Launch a PostgreSQL server on your machine.
In order to do that you first need to install postgre: https://www.postgresql.org/download/. Follow the installer and check the pgAdmin 4 option to have it installed on your machine.
Once the install is done launch the pgAdmin 4 app, it will open a browser tab. On the dashboard click add a new server.