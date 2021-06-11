This directory will contain all the files related to make a Go Ethereum client docker image.


* To build a docker image, use the following command.

docker build -t geth . --network=host

* If you want to send Golang version arguement to docker build, you can use "docker build -t geth . --network=host --build-arg GO_VERSION=1.16.5" command.

* To check the image, use the following command.

docker images

* You can see "geth" in the image list.
