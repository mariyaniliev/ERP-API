<h1><p align="center">
  REST API
</p></h1>

<p align="center">
  <a href="https://genericsoft.bg/" target="blank"><img src="https://i.postimg.cc/hj6JSw-tv/gs.png" width="320" alt="generic-soft logo" /></a>
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
docker-compose up --build -d
```

## Initialize the Database with Prisma Migration scripts

This is needed first time only. We use [Prisma](https://www.prisma.io/) as Database management and versioning tool the following migration command will init the database from the schema.prisma file. See Database Development Guidelines below for further details.

```shell
# Generate the prisma clients
yarn prisma generate

# Migrate your changes to database
yarn prisma migrate dev

```
