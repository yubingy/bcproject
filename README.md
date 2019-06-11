# The Prototype of Order Tracking & Certification Application Leveraging Blockchain Technology - final project for COMP90055


This project is developed using [react-box](https://www.trufflesuite.com/boxes/react-box-web3-todo) provided by truffle framework and partial logic is inspired by trace program. The details of related project are presented in final report.

## The overall design of smart contracts (UML)

![image](https://github.com/yubingy/bcproject/blob/master/images/scuml.png)

Simple explanationS to the above diagram:

Model works like traditional database: address type in solidity for storage.
Helper deals with existence checking.
Main is defined with basic operation interacting with front-end side.

## How to run the program
1. install all dependencies and related toolkit
2. install ganache-ui or using command ganache-cli to test on personal blockchain
3. execute truffle develop and migrate at your own terminal
4. execute the command npm run start at another terminal
5. install and configure metamask as extension of current browser
6. add your own address and port as custom network in metamask
7. create your account and import the mnomenic as seed phrase
8. finished!- the dapp is launced and you can create your products or try other
operations shown in final report.



