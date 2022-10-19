FROM golang:1.18.2 AS builder

WORKDIR /src

COPY ./server/file    ./

RUN CGO_ENABLED=0 go build -o app .


FROM alpine:latest  
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /src/app ./

EXPOSE 4000

CMD ["./app"]  

LABEL org.opencontainers.image.source="https://github.com/ebox-org/ebox"
