FROM node:8
MAINTAINER Loris Crüll <loris.crull@heig-vd.ch>

COPY src /opt/app/

WORKDIR /opt/app/

RUN npm install

ENTRYPOINT ["node", "/opt/app/Musician.js"]