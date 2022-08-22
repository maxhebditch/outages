# Outage Challenge Back End Test

## Introduction

This is a CLI script which can be used to update an endpoint with information about outages.
It achieves this by
1. Getting information about all outages from an endpoint
2. Retrieving information about a site
3. Filtering all outages by time and for a specific site's devices
4. Adding the display name of the device to the information about the outage
5. Posting these enhanced outages to an endpoint

The tool provided in this repository contains a number of individual functions to achieve the above, which are then handled by a simple CLI tool to perform the function and orchestrate the information flow.

The code was designed in this was as to make it easy to convert to an express app or similar.

The code is also resilient to 500 errors and will gracefully exit.
Other tooling could rerun these functions until a succesful result was achieve if desired.

A number of unit tests are also provided which cover a reasonable number of cases.

The API key is not provided and should be stored in an `.env` file in the root directory, an example is available in `env.example`.

## Installation
The tool is written in typescript, and as such will require compiling or the use of a ts runtime environment.

The tool was written in 
1. Node v16.15.1
2. Typescript 4.7.4

The tool was developed using a [vscode dev container](https://code.visualstudio.com/docs/remote/containers) and the configuration files are provided.

### Installation steps
1. Clone the repo
2. Install packages `npm ci`
3. Build the js files `npm run build`
4. Run the binary `./bin/outages` or `node .`

## Desired further work
1. The documentation is lacking, ideally functions and layout should make code clear but further work and ideally documentation like typedoc
2. Allowing the use of variable site ids using a library to handle CLI arguements
3. Dockerising
4. Displaying endpoint messages to the user upon failure
5. Concurrent gets