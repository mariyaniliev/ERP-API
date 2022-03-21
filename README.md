<h1><p align="center">
  Generic Soft <br/>
  REST API
</p></h1>

<p align="center">
  <a href="https://genericsoft.bg/" target="blank"><img src="https://ibb.co/NYTZ0HV" width="320" alt="generic-soft logo" /></a>
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

## Create the Database Instance in Docker

```shell
docker-compose -d --build
```

## Initialize the Database with Prisma Migration scripts

This is needed first time only. We use [Prisma](https://www.prisma.io/) as Database management and versioning tool the following migration command will init the database from the schema.prisma file. See Database Development Guidelines below for further details.

```shell
# Generate the prisma clients
# This is needed if schema.prisma file is modified
yarn prisma generate

# Migrate your changes to database
yarn prisma migrate dev

```

Happy coding !!!
