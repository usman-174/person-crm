# Project Name

## Overview

This project consists of two main folders: `client` and `server`. The `client` folder contains a Next.js application, while the `server` folder contains an Express.js application written in TypeScript.

## Prerequisites

- Node.js

## Setup

### Client (Next.js)

1. Navigate to the `client` directory:

    ```bash
    cd client
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

### Server (Express.js with TypeScript)

1. Navigate to the `server` directory:

    ```bash
    cd server
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Update the Prisma database driver in `prisma/schema.prisma`:

    ```prisma
    // Change the provider to either mysql or postgres
    provider = "postgres"
    ```

4. Generate Prisma client:

    ```bash
    npx prisma generate
    ```

## Running Locally

### Server

1. Start the TypeScript watcher to compile TypeScript files:

    ```bash
    npm run watch
    ```

2. In a new terminal, start the server:

    ```bash
    npm run dev
    ```

### Client

1. Navigate to the `client` directory if not already there:

    ```bash
    cd client
    ```

2. Start the Next.js application:

    ```bash
    npm run dev
    ```

## Additional Notes

- Make sure to have your database server running before starting the server.
- If you encounter any issues, please refer to the documentation or raise an issue in the repository.

## Contributors

- [Usman](https://github.com/usman-174)


