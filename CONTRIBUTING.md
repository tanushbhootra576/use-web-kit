# Contributing to use-web-kit

Thanks for helping improve `use-web-kit`. This document describes the preferred workflow, code style, testing, and PR expectations.

## Scope

- `use-web-kit` is a library of focused React hooks. Keep changes small and focused — one behavioral change or feature per PR.

## Getting started

1. Fork the repository and create a feature branch from `main`:

```bash
git clone https://github.com/your-username/use-web-kit.git
git checkout -b feat/your-feature
```

2. Install dependencies (if any) and run the test suite locally. This repo is intentionally minimal; use the project's scripts:

```bash
npm install
npm test
```

## Development guidelines

- Prefer small, well-named PRs. Each PR should implement a single logical change.
- Write clear commit messages and use conventional, descriptive headlines.
- Keep hook APIs stable and backward compatible when possible. If breaking changes are required, document them in the PR and bump the version accordingly.
- Use TypeScript types for public APIs and keep runtime logic minimal and well-tested.

## Code style

- Follow existing project formatting and lint rules (if present). If the repo has no tooling, match the existing style.
- Keep functions small and pure where possible. Hooks should return stable references when appropriate and clean up effects.

## Testing

- Add unit tests for new behaviour and edge cases. Tests should be deterministic and fast.
- If you add a new hook, include tests that exercise:
  - correct initial state
  - expected updates on events (visibility, network, intersection, etc.)
  - edge cases and cleanup

## Pull request checklist

- [ ] PR description explains the motivation and the approach.
- [ ] All tests pass locally.
- [ ] New code includes unit tests where applicable.
- [ ] Public API changes documented in the PR (and README/docs updated if necessary).
- [ ] Code follows repository conventions and is linted/formatted.

## Issue reporting

- Create a minimal reproduction demonstrating the problem. Include environment details (browser/node version) and steps to reproduce.
- Tag the issue with a concise title and link any related PRs.

## License & contribution terms

By contributing you agree to license your contributions under the project MIT License.

## Contact

If you need help, open an issue or contact the maintainers via the repository discussions or PR comments.

Thank you for improving `use-web-kit`.
