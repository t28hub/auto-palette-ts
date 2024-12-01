# Contributing to `auto-palette-ts`

This project welcomes contributions from the community. Below are guidelines on how to participate effectively.

## Issues

This project uses [GitHub Issues](https://github.com/t28hub/auto-palette-ts/issues) to track bugs and feature requests.
Please search the existing issues before filing new ones to avoid duplicates.

## Pull Requests

`auto-palette-ts` is written in [TypeScript](https://www.typescriptlang.org/) and uses [pnpm](https://pnpm.io/) as a package manager.  
Please follow these steps to contribute to the project:

1. **Fork and clone the repository:**

```sh
# Clone the repository
git clone git@github.com:t28hub/auto-palette-ts.git

# Create a new branch
git checkout -b your-branch-name 
```

2. **Install the latest LTS version of [Node.js](https://nodejs.org/en)**

3. **Set up the development environment:**

```sh
# Enable Corepack
corepack enable

# Install dependencies
pnpm install
```

4. **Make your changes and write tests.**

```sh
# Run unit tests and watch for changes
pnpm dev
```

5. **Test and lint your changes:**

```sh
# Run all tests
pnpm test

# Run unit tests
pnpm test:unit

# Run e2e tests
pnpm test:e2e:install && pnpm test:e2e

# Lint the code
pnpm lint
```

6. **Ensure your changes do not break any existing functionality.**
7. **Update the documentation if necessary.**
8. **Create a pull request.**

### Code Style

Please ensure consistency by following general TypeScript style guidelines, and run the following commands before creating a pull request:

```sh
pnpm format
```

### Commit Messages

Please follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification when writing commit messages.

### License

By contributing to this project, you agree that your contributions will be licensed under the [LICENSE](LICENSE) file in this repository.