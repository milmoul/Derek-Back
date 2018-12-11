FROM nikolaik/python-nodejs:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN pip3 install spacy 
RUN pip3 install msgpack==0.5.6
RUN python3 -m spacy download fr_core_news_sm
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# Run the image as a non-root user
RUN adduser --disabled-login myuser
USER myuser

#EXPOSE 4000

CMD NODE_ENV=production PORT=$PORT node .