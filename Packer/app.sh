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
#sudo mkdir webapp
#sudo mv config models Packer src statsd package-lock.json package.json README.md test.js ~/webapp/
cd home/ubuntu/webapp
sudo curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install nodejs -y
sudo apt-get install npm -y

npm i

echo "Installing mysql server"
sudo apt-get install mysql-server -y

echo "Installing Cloud Watch Agent"
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

echo "Configuring Cloud Watch Agent"
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
-a fetch-config \
-m ec2 \
-c file:/home/ubuntu/webapp/statsd/cloudwatch-config.json \
-s



sudo npm i pm2
sudo npm i -g pm2
sudo pm2 start home/ubuntu/webapp/src/controller/client_controller.js
sudo pm2 startup systemd
sudo apt-get clean