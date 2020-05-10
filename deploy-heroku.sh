#!/bin/bash
npm install
npm run lint
npm run test
npm run nais-build

APP_NAME="frontendbootstrap"

# build docker image
docker build -t $APP_NAME -f Dockerfile.web .

# push docker image to heroku container registry
heroku container:login
heroku container:push web -a $APP_NAME  --recursive

# release image
heroku container:release web -a $APP_NAME
