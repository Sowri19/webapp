#!/bin/bash

# sleep 30


# sudo install -y gcc-c++ make
# curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -

# sudo apt install nodejs npm unzip -y

# cd ~/ && unzip webapp.zip
# cd ~/webapp && npm install i



#!/bin/bash

sleep 30

sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install nginx -y
sudo curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install nodejs -y
sudo apt-get install npm -y
sudo mv /tmp/webapp.zip /home/ubuntu/webapp.zip
sudo apt install unzip
cd ~/ && unzip webapp.zip
cd ~/webapp && npm i --only=prod


sudo mv /tmp/webapp.service etc/systemd/system/webapp.service
sudo systemctl enable webapp.service
sudo systemctl start webapp.service


echo "Installing mysql server"

sudo apt-get install mysql-server -y

sudo mysql <<EOF

CREATE DATABASE first_schema;

CREATE USER 'sowri'@'localhost' IDENTIFIED BY 'Password';

GRANT ALL PRIVILEGES ON first_schema.* TO 'sowri'@'localhost' WITH GRANT OPTION;

FLUSH PRIVILEGES;

EOF

echo "Starting mysql server"

sudo service mysql start
sudo npm i pm2
sudo npm i -g pm2
sudo pm2 start client_controller.js
sudo pm2 startup systemd
sudo apt-get clean