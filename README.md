# Siggy App

## Tech stack

- next.js
- react.js
- node.js
- yarn
- typescript
- husky pre-commit hooks
- docker
- postgresSQL

## Getting started

To run the project locally follow the steps after cloning the repository:

- Install required packages with the terminal command `yarn`

## Front-end

- To run the development version run `yarn dev`
- Alternatively, run `yarn build` to create a production build and start the local server with `yarn start`
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication

We make use of Next-auth to authenticate users.

### GitHub

To enable authentication through GitHub,create a `.env.local` with the following:

```
GITHUB_ID=
GITHUB_SECRET=
```

You will need to supply your own GitHub OAuth credentials.

## Database

We're using Prisma to manage our database.

### Running locally

To setup a postgresSQL database locally, run the following:

- Run `docker-compose up -d` to setup the database
- Run `yarn db:push` to create your database

### Migration

If you made any changes to `/prisma/schema.prisma`, you can migrate the database with `yarn db:migrate`.
Append `--name NAME` to the command to specify a name for the migration.

## Products and payment

Plans come straight from Stripe's Products and Prices. Simply create recurrent products on your Stripe account and they will show up when creating a new company.

In order to setup, add your stripe secret key to `.env.local` under the name `STRIPE_SECRET`
