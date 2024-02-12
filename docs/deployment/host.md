---
title: Hostname and Path Configuration
nav_order: 4
parent: Deploying to Shared Hosts
section: docs
layout: docs
---
# Hostname and Path Configuration
Inferno needs to know the URL of where it is hosted, and it determines this
based on environment variables. These environment variables need to be set in
both the web and worker processes. The web process needs to know the URL because
it is serving the URL. The worker process needs to know where Inferno is hosted
even though it isn't serving those URLs itself because some tests generate links to Inferno.

## Hostname Configuration
In `.env`, set the `INFERNO_HOST` environment variable to the hostname. 
This allows Inferno to correctly construct things like
absolute redirect and launch URLs for the SMART App Launch workflow.

## Base Path Configuration
If Inferno won't be hosted at the root of its host (e.g., you want to host
Inferno at `http://example.com/inferno` rather than at `http://example.com`):
- Set the `BASE_PATH` environment variable in `.env`
- In `nginx.conf`, change `location /` to `location /your_base_path`
