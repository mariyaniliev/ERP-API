<h1><p align="center">
  Generic Soft <br/>
  REST API
</p></h1>

<p align="center">
  <a href="https://genericsoft.bg/" target="blank"><img src="https://media-exp1.licdn.com/dms/image/C4D0BAQGICTRcAXWpSw/company-logo_200_200/0/1625574654319?e=1655942400&v=beta&t=wRhYFavVRCCf3Lti3-9gdEjziP36uz88pk7bf-WrfRA" width="320" alt="generic-soft logo" /></a>
</p>

## Initial setup

```shell
git clone https://github.com/mariyaniliev/ERP-API.git
cd ERP-API

# Install dependencies
yarn

# Start the project
yarn dev
```

## Initialize the Database with Prisma Migration scripts

This is needed first time only. We use [Prisma](https://www.prisma.io/) as Database management and versioning tool the following migration command will init the database from the schema.prisma file. See Database Development Guidelines below for further details.

```shell
# Generate the prisma clients
yarn prisma generate

# Migrate your changes to database
yarn prisma migrate dev

```

## Create the Database Instance in Docker

```shell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```
