---
title: Getting Started
nav_order: 11
has_children: true
section: docs
layout: docs
---
{:toc-skip: .h4 data-toc-skip=""}

# Getting Started Creating a Test Kit
This page shows you how to create a Test Kit from scratch. We recommend using the 
[Inferno Template](https://github.com/inferno-framework/inferno-template) repository
as a starting point, since it includes everything you'll need to get started. You may
also [create a new Test Kit](/docs/getting-started/inferno-cli.html#creating-a-new-test-kit) using the Inferno
Command Line Interface (CLI). 

We encourage beginners to visit the
[Test Kit Authoring Tutorial](https://github.com/inferno-training/inferno-tutorial/wiki)
that walks you through creating a basic set of tests for servers that target a common
Implementation Guide.

Tests can be developed either with a local Ruby installation or by using Docker.
We recommended installing Ruby locally for development because:
* When the tests change, it is much faster to restart native Ruby processes than to stop/rebuild/start
  Docker images.
* Ruby lets you set breakpoints and access an interactive debugger inside of
  running tests, which makes test development easier.
* The Inferno Command Line Interface can be used, which includes additional useful
  functionality for developers, such as an interactive console. See 
  [Inferno CLI](/docs/getting-started/inferno-cli.html) for more information.

## Development with Ruby

### Windows Instructions
{:toc-skip}

Windows developers will need to use [WSL](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl#install-wsl-2) in order to interact with 
Inferno.  It is recommended that you also follow [the steps for installing node.js](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl#install-nvm-nodejs-and-npm). 
Once you have WSL (and node.js) set up:

1. Install VS Code and the [WSL Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl).
1. Install [Ubuntu from the Windows Store](https://www.microsoft.com/store/productId/9PDXGNCFSCZV).
1. Open Command Prompt and run `ubuntu`.
	1. You will have to setup a user and password for this linux subsytem.
	2. The password will be used for `sudo` commands later, so remember these credentials!
1.  Install Docker Desktop for Windows.
	1. Follow the steps from Docker to ensure it plays nicely with WSL, see [here](https://docs.docker.com/desktop/wsl/#turn-on-docker-desktop-wsl-2).  
	2. From the Docker settings, Open Resources > WSL Integration, and make sure Ubuntu is selected.  Then, hit "Apply and Restart".
1. From VS Code, press `Ctrl` + `Shift` + `P` to open the command palette, and type "WSL".  Select "Connect to WSL in new Window using distro..." and select Ubuntu.
1.  Open a terminal in the new WSL window and try to `ping google.com`.
  1. If you cannot ping google.com, you may not be able to connect to the internet from within the WSL instance.  The steps at [this stack overflow article](https://stackoverflow.com/questions/55649015/could-not-resolve-host-github-com-only-in-windows-bash#:~:text=It%20could%20be%20that%20your%20/etc/resolv.conf%20file%20is%20corrupt%20%2D%20it%20happened%20to%20me!) should resolve the issue. If it does not, open cmd and run `nslookup`.  Copy the Default Address, then in your wsl instance type `sudo nano /etc/resolv.conf`.  Add the default address as another nameserver.
1. Continue from step 2 in [Set Up Environment](#set-up-environment).
{: .lh-default}

**NOTE:** If, when running Inferno within WSL, the tests begin to stall and the console repeatedly prints `WARN: Your Redis network connection is performing extremely poorly.`,
WSL may be having networking issues.  To resolve this, you can follow the steps in this [WSL Slow Network Issue thread](https://github.com/microsoft/WSL/issues/4901#issuecomment-1724482084).  You can make a `.wslconfig` file from your `%USERDATA%` directory if it does not already exist, and you will need to restart WSL (usually through `wsl --shutdown` in Windows Powershell) before the changes take effect.

### Set Up Environment
{:toc-skip}

1. Install [Docker](https://www.docker.com/get-started).
1. Install Ruby. It is highly recommended that you install Ruby via a [Ruby
   version
   manager](https://www.ruby-lang.org/en/documentation/installation/#managers).
1. Run `gem install inferno_core` to install inferno.
1. Run `gem install foreman` to install foreman, which will be used to run the
   Inferno web and worker processes.
1. Run `gem install rerun` to install rerun, which will be used to enable
   `watch` functionality to reload Inferno when a test has been updated.

### Set Up a New Test Kit
{:toc-skip}

There are two convenient methods to create a new Test Kit. The first is by cloning the 
[Inferno Template](https://github.com/inferno-framework/inferno-template) repository. This
method ensures you will always be starting with the latest Test Kit Template. You can
either clone this repository directly, or click the green "Use this template" button in GitHub
to create your own repository based on the Inferno Template.

The second method is to use the Inferno Command Line Interface. After installing
the `inferno_core` gem, run `inferno new TestKitName` to create a new Test Kit
Template in a directory named `test-kit-name`. See how to [create a new Test
Kit](/docs/getting-started/inferno-cli.html#creating-a-new-test-kit) using the Inferno CLI for more
information and options.

1. Create your Test Kit by cloning the [Inferno Template](https://github.com/inferno-framework/inferno-template)
   or by using the `inferno new` command.
1. Run `bundle install` to install dependencies.
1. Run `bundle exec inferno migrate` to set up the database.

### Run Your Test Kit
{:toc-skip}

1. Run `bundle exec inferno services start` to start the background services. By
   default, these include nginx, Redis, the FHIR validator service, and the FHIR
   validator UI. You can check to make sure they're running by running `docker container ls` in the
   command line, or checking the "Container" tab in Docker Desktop.
1. Run `inferno start --watch` to start Inferno and have it reload any time a file
   changes. Remove the `watch` flag if you would prefer to manually restart
   Inferno.
1. Navigate to `http://localhost:4567` to access Inferno. You should see two test groups on the side
   of the page: "Capability Statement" and "Patient Tests".
   To access the FHIR resource validator, navigate to
   `http://localhost/validator`.
1. When you are done, run `bundle exec inferno services stop` to stop the
   background services.

## Development with Docker Only

### Set Up Environment
{:toc-skip}

1. Install [Docker](https://www.docker.com/get-started).

### Set Up a New Test Kit
{:toc-skip}

1. Create your Test Kit by cloning the [Inferno Template](https://github.com/inferno-framework/inferno-template)
   or by using the `inferno new` command.
1. Run `./setup.sh` in the template repository to retrieve the necessary Docker
   images and create a database.

### Run Your Test Kit
{:toc-skip}

1. Run the `./run.sh` script to start Inferno.
- Navigate to `http://localhost` to access Inferno and run test
  suites.
- Navigate to `http://localhost/validator` to access a
  standalone validator that can be used to validate individual FHIR resources.
   

### Next Steps
{:toc-skip}

Now that Inferno is running, you can:
- Go to [Template Layout](/docs/getting-started/repo-layout-and-organization.html) for
how to update the template for your use case
- Go to [Inferno CLI](/docs/getting-started/inferno-cli.html) for
more information about the `inferno` commands available,
- Go to [Debugging](/docs/getting-started/debugging.html) for
more information about debugging in Inferno,
- Or just jump to [Writing Tests](/docs/writing-tests).
