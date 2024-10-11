
# Laravel Docker Workflow

This is a pretty simplified, but complete, workflow for using Docker and Docker Compose with Laravel development. The included docker-compose.yml file, Dockerfiles, and config files, set up a LEMP stack powering a Laravel application in the `src` directory.

## Getting Started

### Configuration Settings
Copy `.env_example` to `.env` and set the following variables:

#### Application Settings
- `COMPOSE_PROJECT_NAME=ea_wrc_setups` Used in the docker-compose.yml file to namespace the services.
- `PATH_TO_CODE=../src` - Location of the code that is used to configure map volumes into the containers

#### Docker Container Versions
The following are used to set the container versions for the services. Here is an example configuration:
- `PHP_VERSION=8.3`
- `MONGO_VERSION=7.0`
- `NODE_VERSION=20`
- `NGINX_VERSION=stable`

#### Docker Services Exposed Ports
The following are used to configure the exposed ports for the services. Here is an example, but update to de-conflict ports:
- `HTTP_ON_HOST=8080`
- `MONGO_ON_HOST=27017`

#### Database Settings
The following are used by docker when building the database service:
- `MONGO_USERNAME=devusername`
- `MONGO_PASSWORD=devpassword`

## Usage

To get started, make sure you have [Docker installed](https://docs.docker.com/docker-for-mac/install/) on your system, and then copy this directory to a desired location on your development machine.

Next, open the .env file and update any settings (e.g., versions & exposed ports) to match your desired development environment.

Then, navigate in your terminal to that directory, and spin up the containers for the full web server stack by running `docker-compose up --build`.

After that completes, run the following to install and compile the dependencies for the application:

- `docker-compose run --rm composer install`
- `docker-compose run --rm npm install`
- `docker-compose run --rm npm run build`

When the container network is up, the following services and their ports are available to the host machine:

- **nginx** - `:HTTP_ON_HOST`
- **mongodb** - `:MONGO_ON_HOST`

Additional containers are included that are not brought up with the webserver stack, and are instead used as "command services". These allow you to run commands that interact with your application's code, without requiring their software to be installed and maintained on the host machine. These are:

- `docker-compose run --rm composer <COMMAND>` runs a composer command
- `docker-compose run --rm artisan <COMMAND>` runs an artisan command
- `docker-compose run --rm npm <COMMAND>` runs a npm command

You would use them just like you would with their native counterparts, including your command after any of those lines above (e.g. `docker-compose run --rm artisan db:seed`).

You can create an interactive shell by doing one of the following:

- `docker-compose run -it --entrypoint /bin/bash <SERVICE>`
-  `docker compose exec -it <SERVICE> /bin/sh` 

## Acknowledgements
Thanks to [The Technology Sandbox](https://www.youtube.com/@thetechnologysandbox) for sharing a baseline for managing a Laravel application with Docker ([Docker Kit For Laravel](https://www.youtube.com/watch?v=GwgwgoWCm8Q)).