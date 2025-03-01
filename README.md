## Development

### Prerequisites
1. Node JS 20, version 20.9.0 or later
2. pnpm package manager ([installation guide](https://pnpm.io/installation))
   1. For people of restiance `npm install -g pnpm@latest-10`

### Installing the dependencies
Run `pnpm install` to install all the necessary dependencies for the project

### Setting up env vars
Create a new file that is not tracked by git, `.env` in the root of the project. Make sure to populate it will all the required environmental variables (example of those with corresponding values can be seen in [`.env.example`](./.env.example)). (yes, you can just copy it)

If you add a new env var to the application, please describe it in [`.env.example`](./.env.example) file as well

### Starting the development server
Run `pnpm run dev` to start a developer server at http://localhost:3000

## Working with Database

Project is using an SQLite database by default, which will be located in the root of the project. If the `dev.db` file is not present or you suspect it's "behind" the current version of the database schema, it is advised to run `pnpm run reset` to apply the migrations and generate files for the client module.

### Modifying the schema

[`schema.prisma`](./prisma/schema.prisma) contains the schema of the database, as well as information about the providers, adapters and generators. You are free to modify the schema to suit you needs.

When you want to test if the schema you created works as expected, you can use `pnpm run push` to update your database schema and generate prisma client, without create a new migration. Use it for prototyping until you are sure that your changes work flawlessly.

When finished, you need to make your schema changes persistant by running `pnpm run migrate:new <name_of_the_migration>` to create a new migration. Treat migrations as commits in Git - each migration should represent an unit of work.

> [!WARNING]
> Migration files should not be edited manually. Content of `prisma/migrations` is auto-generated and any changes to it might be overwritten.

### Seeding the Database

By default, local database is created empty. To reduce the amount of time spent on putting useful data into it there exists [`seed.ts`](./prisma/seed.ts) file. The sole purpose of this file is to provide an easy way for dummy data to be inserted into the database. To seed the database using this file, run `pnpm run seed`.

When modifying the schema (by adding new fileds, tables, relations) it is advised to also modify the `seed.ts` file so that the person who works with the new schema will be able to easily integrate those changes into their database.

## Commiting your changes

Project uses ESLint and Prettier to enforce consistent code style. Before pushing your code to the remote repository, it is advised to fix all the errors and warnings reported by ESLint. Running `pnpm run lint:fix` will fix simple errors, while `pnpm run lint` will pinpoint all remaining issues. You cannot push your changes if ESLint reports any error.

### Pull requests, code review and testing

Project uses Woodpecker CI and Netlify to streamline the process of reviewing and testing your changes.

After you create a Pull Request on Github, two things will happen:
1. Woodpecker CI should start a pipeline which will run basic tests and check the consistency of the code - if those tests won't pass, **you won't be able to merge the pull request**.
2. Netlify will deploy and host your version of the app under a publically accesible domain, so you can test it in a more "production-ready" environment, without the need to run the project locally.

To be able to merge your changes, you need to pass the tests imposed by Woodpecker, as well as get at least one approve from any member of the project.

### Deploying your changes
TBA