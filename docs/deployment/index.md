---
title: Deploying to Shared Hosts
nav_order: 25
has_children: true
layout: docs
section: docs
---
# Deploying Inferno
Deployments of Inferno are based on the [Inferno
Template](https://github.com/inferno-framework/inferno-template). This template
contains a `docker-compose.yml` file that can run all of the services inferno
needs.

At a minimum, deploying inferno involves the following:
- `git clone` the repository you want to deploy (or get it onto your server in
  some other way)
- run `setup.sh` to pull & build the needed docker images and run database
  migrations
- run `docker compose up -d` to start all of the services in the background

By default, a deployment of Inferno includes the following services:

- `nginx` - A reverse proxy which handles sending requests to the correct
  services
- `inferno` - The inferno web process which serves Inferno's static assets and
  the JSON API
- `worker` - The inferno web process which executes the tests
- `redis` - Message broker that handles communication between the inferno web and worker
  processes
- `validator_service` - A [JSON API wrapper](https://github.com/inferno-framework/fhir-validator-wrapper) 
  around the HL7 FHIR validator which Inferno uses to validate FHIR resources
- `fhir_validator_app` - (Optional) A [web front end](https://github.com/inferno-framework/fhir-validator-app) for the validator
  service which allows users to easily perform standalone FHIR resource validation. Nothing depends
  on this service, so it can be safely removed from `docker-compose.yml` if you
  don't need to provide standalone FHIR resource validation.
