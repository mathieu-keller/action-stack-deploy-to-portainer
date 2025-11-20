# Portainer Deployment Action

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-black.svg)](https://sonarcloud.io/summary/new_code?id=mathieu-keller_action-stack-deploy-to-portainer)
[![Build](https://github.com/mathieu-keller/action-stack-deploy-to-portainer/actions/workflows/build.yaml/badge.svg)](https://github.com/mathieu-keller/action-stack-deploy-to-portainer/actions/workflows/build.yaml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=mathieu-keller_action-stack-deploy-to-portainer&metric=coverage)](https://sonarcloud.io/summary/new_code?id=mathieu-keller_action-stack-deploy-to-portainer)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=mathieu-keller_action-stack-deploy-to-portainer&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=mathieu-keller_action-stack-deploy-to-portainer)

## Overview

“Portainer Deployment Action” is a GitHub Action that automates the deployment of Docker Compose files to Portainer. It ensures consistent, repeatable deployments and reduces the risk of human error. It’s particularly beneficial for maintaining higher environments where manual deployments can be cumbersome. Enjoy seamless deployments with this action! 😊

## Parameters.

The action takes the following parameters:

| Parameter | Description | Required |
| --- | --- | --- |
| `portainerHost` | The host URL of the Portainer instance | Yes |
| `portainerApiKey` | The API key for the Portainer instance | Yes |
| `portainerStackName` | The name of the stack to be deployed in Portainer | Yes |
| `portainerFilePath` | The file path of the Docker Compose file to be deployed | Yes |
| `portainerEnvVars` | Environment variables to be passed to the stack | No |

## Usage

Here's an example of how to use this action in a GitHub workflow:

```yaml
name: Deploy to Portainer
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Deploy to Portainer
        uses: mathieu-keller/action-deploy-to-portainer@1.0.0
        with:
          portainerHost: ${{ secrets.PORTAINER_HOST }}
          portainerApiKey: ${{ secrets.PORTAINER_API_KEY }}
          portainerStackName: 'my-app'
          portainerFilePath: './docker-compose.yml'
          portainerEnvVars: '[{"name": "name", "value": "value"}]'
```

In this example, the action is triggered whenever there’s a push to the main branch. It checks out your code and then uses your action to deploy a Docker Compose file to Portainer. The necessary parameters are passed to the action, with sensitive information like the host URL and API key being stored as GitHub secrets.
