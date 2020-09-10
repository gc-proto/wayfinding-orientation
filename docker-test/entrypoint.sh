#!/bin/bash

AZURE_CREDENTIALS=$1
PREVIEW_DEPLOY_TO_PROD=$2
BUILD_DIRECTORY=$3
INSTALL_COMMAND=$5
BUILD_COMMAND=$6

# Install dependencies
eval ${INSTALL_COMMAND:-"npm i"}

# Build project
eval ${BUILD_COMMAND:-"npm run build"}

# Export token to use with netlify's cli
export AZURE_CREDENTIALS=$AZURE_CREDENTIALS

# Deploy with Docker
if [[ $PREVIEW_DEPLOY_TO_PROD == "true" ]]
then
	docker run --rm -ti
else
	docker run --rm -ti
fi