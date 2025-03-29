# Contributing to the Public Services Portal

Thank you for your interest in contributing to the Public Services Portal project. This document provides guidelines and instructions for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

### Setting up the Development Environment
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/public-services-portal.git
   cd public-services-portal
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

1. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix-name
   ```

2. Make your changes, following the coding standards

3. Run tests to ensure your changes don't break existing functionality:
   ```bash
   npm test
   ```

4. Add and commit your changes with a meaningful commit message

5. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a pull request from your branch to the main repository

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update the documentation if necessary
3. Include tests for new functionality
4. Ensure all tests pass
5. Submit your pull request with a clear title and description
6. Respond to any feedback from code reviewers
7. Once approved, a maintainer will merge your pull request

## Coding Standards

### JavaScript/TypeScript
- Follow the ESLint configuration provided in the project
- Use TypeScript for type safety
- Use async/await for asynchronous code
- Write self-documenting code with clear variable and function names

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use appropriate component organization
- Follow the existing pattern for component structure

### CSS/Styling
- Use Tailwind CSS classes following the project's conventions
- Follow BEM naming convention for custom CSS classes
- Ensure responsive design

### Internationalization
- All user-facing strings should be internationalized
- Add strings to the appropriate locale files
- Use the `useTranslation` hook from react-i18next

## Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- feat: A new feature
- fix: A bug fix
- docs: Documentation changes
- style: Changes that don't affect code functionality (formatting, etc.)
- refactor: Code changes that neither fix a bug nor add a feature
- perf: Performance improvements
- test: Adding or updating tests
- chore: Changes to build process or auxiliary tools

Example:
```
feat(auth): add password reset functionality

Add password reset capability through email verification.
Includes email service integration and reset token generation.

Closes #123
```

## Issue Reporting

### Bug Reports
When reporting a bug, please include:
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment information

### Feature Requests
When suggesting a feature:
- Clearly describe the feature
- Explain why it would be valuable
- Provide examples of how it would be used
- Consider potential implementation approaches

## Feature Requests

We welcome feature requests! To suggest a new feature:
1. First check if the feature has already been suggested
2. Create a new issue with the "feature request" label
3. Describe the feature in detail
4. Explain the benefits and use cases
5. If possible, outline how it might be implemented

## Localization

This project supports multiple languages. When adding new features:
1. Add all user-facing strings to the locale files
2. Ensure formatting is consistent
3. Consider cultural differences when designing features

## Documentation

When adding or changing features:
1. Update the README.md if necessary
2. Update the DOCUMENTATION.md with details about the feature
3. Add JSDoc comments to functions and components
4. Update API documentation if applicable

## Questions or Need Help?

If you have questions or need help with your contribution:
1. Check the documentation
2. Look for similar issues in the issue tracker
3. Ask for help in the issue comments
4. Contact the maintainers

Thank you for contributing to the Public Services Portal!