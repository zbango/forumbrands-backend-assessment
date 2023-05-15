# Brandable Serverless Backend

This project is a Serverless Express API built using TypeORM, AWS Lambda and the Serverless Framework. It's designed to interact with a PostgreSQL database.

## Getting Started

These instructions will guide you through setting up the project locally and deploying it to AWS Lambda.

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (v18.14.0 or higher)
2. Install [Docker](https://www.docker.com/get-started) (for running the PostgreSQL database locally)
3. Install [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/) globally: `npm install -g serverless`

### Setting up the environment

1. Clone this repository.
2. Create a `.env` file in the project root directory.
```DB_HOST=localhost```
```DB_USER=postgres```
```DB_PASSWORD=postgres```
```DB_NAME=postgres```
```DB_PORT=5432```


### Running the PostgreSQL database

Run the PostgreSQL database using Docker Compose:

```docker-compose up -d```

This command will start the PostgreSQL container and expose it on port 5432.

### Installing dependencies

Install the project dependencies by running:

```npm install```

### Running migration

Run the migration command to create the notes table in Postgress DB

```npm run migration:run```

### Running the API locally

Run the API locally using the Serverless Offline plugin:

```npm start```

This command will start the local API server on port 3000 by default. It's set up with Nodemon and has hotloading enabled.

### Testing

Run the test command

```npm run test```
