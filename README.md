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

We're using Prisma to manage our database. Having a local Postgres database is easy:

- Run `docker-compose up -d` to setup the database
- Run `yarn db:push` to create your database
