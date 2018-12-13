# Welcome to HelloDereks smart FAQ

Requirements:
- Have python 3 installed
- Have pip3 installed
- Have docker installed

First we need to check you have the correct node version

Now lets clone the repo, go to the folder where you want the app folder to be and open a terminal in that folder

    git clone https://gitlab.paris-digital-lab.com/mokoloco/derek-back.git
    cd derek-back

Now there are two ways to run the app, localy for dev purposes or on a remote server on heroku for production

1.  Local deployment

    a.  Launch a PostgreSQL server on your machine.

    In order to do that you first need to install postgre: https://www.postgresql.org/download/. Follow the installer and check the pgAdmin 4 option to have it installed on your machine.
    Once the install is done launch the pgAdmin 4 app, it will open a browser tab. On the dashboard click add a new server. Fill the information as shown below with the password being: lemotdepasse

    <img src="db1.png"/><img src="db2.png"/>

    b. Setup the python environment

    Create a vitual environment and activate it with (still in the same terminal window as before):

        python3 -m venv venv
        source venv/bin/activate
    
    Now lets import spacy and the french language

        pip3 install spacy
        python3 -m spacy download fr_core_news_sm

    *If the command install spacy returns an error because of gcc then run the command:*

        xcode-select --install 

    c. Launch the server

    First install the dependencies
    In the same console in the app folder run:

        npm install

    Finally launch the server

        npm run devstart 
    
    And thats it you have the server running ready to accept incoming messages
    To access the database you will have to launch the front (the tutorial to do that is in the read me of the front git repository)
    To send the messages use the "send local message" request in the shared postman collection.

2. Remote deployment

    a. Login to heroku and docker

    First login to heroku, in the same terminal window type, you will need the heroku CLI:

        npm install heroku
        heroku login
    
    It will prompt you to hit any key (do that) and it will open a browser tab and ask that you login to heroku (do that too)

    Then make sure you have docker installed (see this to install https://runnable.com/docker/install-docker-on-macos) and that it is currently running on your computer
    In the same terminal window type:

        docker login --username=_ --password=$(heroku auth:token) registry.heroku.com

    b. Push the image to heroku

    Now all thats left is to push the app to heroku and to release it, in the same console type:

        heroku container:push web --app dty-derek
        heroku container:release web --app dty-derek
    
    Thats it the app is now running on heroku

3. Postman info

    On the shared collection you have two requests one if the server is launched locally and another if it is launched on heroku
    You can change the message sent or the the id of the sender by editing the environment varaibles.
    