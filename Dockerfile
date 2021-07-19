FROM ubuntu:20.04 as app

RUN apt-get update \
    && apt-get install -y tzdata

RUN apt-get update \
    && apt-get install -y wget libxml2-utils ffmpeg build-essential --no-install-recommends \ 
    && apt-get -y clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace