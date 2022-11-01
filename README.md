This is the Repository for CSYE6225 - Cloud Computing and Networking Structures
NUID:002926129
Name: Satya Sowri Sampath Korturti

Prerequisites NodeJs Visual Studio Code (Optional)

Requirements & Description : All API request/response payloads should be in JSON. No UI should be implemented for the application. As a user, I expect all APIs call to return with a proper HTTP status code.

Steps to run this Project :

->Clone this github repo(for Assignment -2)
navigate to the repo and open vscode in that folder
run the command "npm install". All the dependencies are installed.

Run these commands and give the dev admin access keys before building the packer.

export AWS_ACCESS_KEY_ID="<YOUR_AWS_ACCESS_KEY_ID>"
export AWS_SECRET_ACCESS_KEY="<YOUR_AWS_SECRET_ACCESS_KEY>"

After giving the access keys build the .hcl file by going into the Packer directory using the following command
cd Packer
packer build ami.pkr.hcl

Ami is created in the EC2 and can connect the instance to the server.

Also SwaggerUI is set in the /api-docs endpoint of the same port url

(Assignment 4 and 5)
AMI is created using the github by the pull and merge request and vpc, rds, s3, ec2 instances are launched using the cloud formation templete.