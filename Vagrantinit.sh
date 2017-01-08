#!/bin/bash

## Note: this is only an example. Vagrant will not run it.

# Update apt-get
sudo apt-get update

# Install basic requirements
sudo apt-get -y install ntp
sudo apt-get -y install vim
sudo apt-get -y install python-pip
sudo apt-get -y install python-setuptools
sudo apt-get -y install python-dev
sudo apt-get -y install fabric
sudo apt-get -y install git
sudo apt-get -y install postgresql
sudo apt-get -y install postgresql-server-dev-9.1
sudo apt-get -y install screen
sudo apt-get -y install sendmail
sudo easy_install virtualenv
sudo pip install virtualenvwrapper

# Set up virtualenv
echo -e "\n"
echo -e "source /usr/local/bin/virtualenvwrapper.sh\n" >> /home/vagrant/.bashrc
mkdir /home/vagrant/.virtualenvs/
cd /home/vagrant/.virtualenvs/
virtualenv meow

easy_install psycopg2
pip install -r /vagrant/requirements.txt

chown -R vagrant /home/vagrant/.virtualenvs
rm -r /vagrant/build

echo -e "export VISUAL=vim; export EDITOR=vim\n" >> /home/vagrant/.bashrc

echo -e "workon meow" >> /home/vagrant/.bashrc
