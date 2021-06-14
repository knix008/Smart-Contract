# To run this file use "docker build -t geth . --network=host"
FROM ubuntu

# Non Interactive Mode
ENV DEBIAN_FRONTEND noninteractive 

# Install Dependent Packages
RUN apt-get update
RUN apt-get install -y --no-install-recommends apt-utils build-essential libgmp3-dev git wget debconf ca-certificates openssl net-tools tree

# Get the certificates for golang and github access
ARG cert_location=/usr/local/share/ca-certificates
# Get certificate from "github.com"
RUN openssl s_client -showcerts -connect github.com:443 </dev/null 2>/dev/null|openssl x509 -outform PEM > ${cert_location}/github.crt
# Get certificate from "proxy.golang.org"
RUN openssl s_client -showcerts -connect proxy.golang.org:443 </dev/null 2>/dev/null|openssl x509 -outform PEM >  ${cert_location}/proxy.golang.crt
# Update certificates
RUN update-ca-certificates

# Install the latest version of Golang
ENV GO_VERSION 1.16.5
ENV GO_OS linux
ENV GO_ARCH amd64
ENV GOPATH /go
ENV GOROOT /usr/local/go
ENV PATH ${GOPATH}/bin:/usr/local/go/bin:$PATH

RUN mkdir -p $GOPATH/src $GOPATH/bin
RUN mkdir -p /usr/local/go
RUN wget https://dl.google.com/go/go${GO_VERSION}.${GO_OS}-${GO_ARCH}.tar.gz
RUN rm -rf /usr/local/go && tar -C /usr/local -xzf go1.16.5.linux-amd64.tar.gz
RUN rm go${GO_VERSION}.${GO_OS}-${GO_ARCH}.tar.gz
RUN go version

# Build Go Ethereum client 
WORKDIR /home
RUN git clone https://github.com/ethereum/go-ethereum
WORKDIR /home/go-ethereum
RUN make geth
RUN cp build/bin/geth /usr/local/bin/
WORKDIR /home
RUN rm -rf go-ethereum
ENV DATA_STORE ethereum
RUN mkdir /home/${DATA_STORE}
RUN /usr/local/bin/geth version

# Initialize Ethereum go client with "genesis.json" file
WORKDIR /home/${DATA_STORE}
COPY ./genesis.json /home/${DATA_STORE}
# Do not use this line!!! It will generate same enode ID for geth node.
# RUN geth --datadir "/home/${DATA_STORE}" init /home/${DATA_STORE}/genesis.json
