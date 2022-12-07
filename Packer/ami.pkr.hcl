variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-08c40ec9ead489470" # Ubuntu 22.04 LTS
}


variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

variable "subnet_id" {
  type    = string
  default = "subnet-0a228ce80ce496973"
}


#https://www.packer.io/plugins/builders/amazon/ebs

source "amazon-ebs" "my-ami" {
  // profile = "dev"
  region     = "${var.aws_region}"
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for CSYE 6225"
  ami_regions = [
    "us-east-1",
  ]

ami_users =[
  "275040382637","500270589937"
]

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }


  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
 

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 50
    volume_type           = "gp2"
  }
}

build {

  sources = ["source.amazon-ebs.my-ami"]
    provisioner "file" {
        source = ".././"
        destination = "/home/ubuntu"
    }

        provisioner "file" {
        source = "./webapp.service"
        destination = "/tmp/webapp.service"
    }
    
    provisioner "shell" {
        script="./app.sh"
    }
    
    post-processor "manifest" {
    output = "../manifest.json"
    strip_path=true
    } 
}
