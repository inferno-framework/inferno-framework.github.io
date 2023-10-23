---
title: Getting Started
nav_order: 11
has_children: true
section: docs
layout: docs
---
# Getting Started for Inferno Test Writers
Tests can be developed either with a local Ruby installation or by using Docker.
We recommended installing Ruby locally for development because:
* When the tests change, it is much faster to restart native Ruby processes than to stop/rebuild/start
  Docker images.
* Ruby lets you set breakpoints and access an interactive debugger inside of
  running tests, which makes test development easier.
* The Inferno Command Line Interface can be used, which includes additional useful
  functionality for developers, such as an interactive console. See 
  [Inferno CLI](http://localhost:4000/docs/inferno-cli.html) for more information.

### Development with Ruby

#### Installation
1. Install [Docker](https://www.docker.com/get-started).
1. Install Ruby. It is highly recommended that you install Ruby via a [Ruby
   version
   manager](https://www.ruby-lang.org/en/documentation/installation/#managers).
1. Clone the [Inferno Template
   repository](https://github.com/inferno-framework/inferno-template). You can
   either clone this repository directly, or click the green "Use this template"
   button to create your own repository based on this one.
1. Run `bundle install` to install dependencies.
1. Run `gem install inferno_core` to install inferno.
1. Run `gem install foreman` to install foreman, which will be used to run the
   Inferno web and worker processes.
1. Run `gem install rerun` to install rerun, which will be used to enable
   `watch` functionality to reload Inferno when a test has been updated.
1. Run `bundle exec inferno migrate` to set up the database.
1. Put the `package.tgz` for the IG you're writing tests for in
`lib/your_test_kit_name/igs` and update this path in
`docker-compose.background.yml`. This will ensure that the validator has access
to the resources needed to validate resources against your IG.

#### Running Inferno
1. Run `bundle exec inferno services start` to start the background services. By
   default, these include nginx, redis, the FHIR validator service, and the FHIR
   validator UI. Background services can be added, removed, and edited in
   `docker-compose.background.yml`.
1. Run `inferno start --watch` to start Inferno and have it reload any time a file
   changes. Remove the `watch` flag if you would prefer to manually restart
   Inferno.
1. Navigate to `http://localhost:4567` to access Inferno. 
   To access the FHIR resource validator, navigate to
   `http://localhost/validator`.
1. When you are done, run `bundle exec inferno services stop` to stop the
   background services.

### Development with Docker Only

#### Installation
1. Install [Docker](https://www.docker.com/get-started).
1. Clone the [Inferno Template
   repository](https://github.com/inferno-framework/inferno-template). You can
   either clone this repository directly, or click the green "Use this template"
   button to create your own repository based on this one.
1. Run `./setup.sh` in the template repository to retrieve the necessary Docker
   images and create a database.
1. Put the `package.tgz` for the IG you're writing tests for in
  `lib/your_test_kit_name/igs` and update this path in
  `docker-compose.background.yml`. This will ensure that the validator has access
  to the resources needed to validate resources against your IG.

#### Running Inferno
After installation, run the `./run.sh` script to start Inferno.
- Navigate to `http://localhost` to access Inferno and run test
  suites.
- Navigate to `http://localhost/validator` to access a
  standalone validator that can be used to validate individual FHIR resources.
   

### Next Steps
Now that Inferno is running, you can either:
- Go to [Template Layout](/docs/getting-started/repo-layout-and-organization.html) for
more information on the files included in the Inferno Template directory,
- Go to [Inferno CLI](/docs/getting-started/inferno-cli.html) for
more information about the `inferno` commands available,
- Go to [Debugging](/docs/getting-started/debugging.html) for
more information about debugging in Inferno,
- Or just jump to [Writing Tests](/docs/writing-tests).
