# LANCe

## Installation

### Debian

    sudo apt-get install git npm nodejs
    git clone https://github.com/sheerforce/LANCe
    cd LANCe
    npm install
    nodejs .

### Chromebook Extra Steps

In a CROSH window (ctrl + shift + t)

    sudo /sbin/iptables-save ~/Downloads/iptables.backup
    sudo /sbin/iptables -F
    sudo /sbin/iptables -A INPUT -p tcp --dport 80 -j ACCEPT
    sudo reboot # WILL REBOOT YOUR COMPUTER

## Features

### User List

- See all users connected to the chat room, including their IPs (hover over a user)
