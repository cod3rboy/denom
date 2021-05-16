# Denom (Deno Manager)

Denom is not a package manager and instead is a wrapper around [Deno](https://deno.land/) to setup and manage deno projects with each project having its own local deno binary.

It is currently a Proof-of-Concept (POC) project and is looking forward to the feedback from Deno community.

## Goals

-   The main goal of this project is to avoid the global installation of deno binary to run deno projects.
-   Another goal is to prevent multiple deno projects from sharing the same deno binary.
-   It also aims to keep all the deno generated code related to a project inside that project itself.

## Features

The main high level features provided by this project are as below :-

-   Create and setup a new project with deno binary automatically downloaded inside project folder.
-   Configures the project to keep all generated code inside project folder.
-   Provides a proxy interface to interact with the local deno binary e.g. a proxy for `deno run` command to execute project code.

Other than main features, Denom also provides possibilities for the following features :-

-   Ability to manage project dependencies in a better way.
-   Project configuration file support.
-   Tasks execution before/after running the project.
-   Permissions management through configuration.
-   Integration with IDEs.
-   Easy deployment of deno project + deno runtime.
-   Management of multiple versions of deno binary in the project.

## How to use ?

This project is built using deno binary v1.9.0.

### Compiling the project

Run the following command to compile this project and generate denom binary in the project root folder -

`deno compile -A --import-map=import_map.json --unstable -o denom ./src/main.ts`

### Creating a Deno project using Denom

1. Create a new project folder.
2. Copy the generated denom binary inside that folder.
3. Open terminal or command prompt inside the folder and run the following command to initialize new Deno project -

    (Windows)

    `./denom.exe`

    (Linux/MacOS)

    `./denom`

### Running Deno project using Denom

1. Create a `main.ts` file inside project root folder with following code inside it -

    ```typescript
    console.log("Hello, Denom!");
    ```

2. Run the project with following command -

    (Windows)

    `./denom.exe --run`

    (Linux/MacOS)

    `./denom --run`

3. Program should print the following output to console -

    `Hello, Denom!`
