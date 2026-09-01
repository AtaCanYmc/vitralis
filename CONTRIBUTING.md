# Contributing to Vitralis 🪟✨

Thank you for your interest in contributing to **Vitralis**! We welcome contributions from artisans, developers, designers, and craft enthusiasts worldwide.

---

## 📑 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Conventional Commits](#conventional-commits)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Testing & Quality Verification](#testing--quality-verification)
- [Coding Guidelines](#coding-guidelines)

---

## Code of Conduct

This project and everyone participating in it is governed by the [Vitralis Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or higher
- **Git**

### Clone & Install

```bash
# 1. Fork and clone repository
git clone https://github.com/atacan/vitralis.git
cd vitralis

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Development Workflow

1. **Create a branch**:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
2. **Make your changes**: Ensure code adheres to TypeScript strict typing and ESLint rules.
3. **Run local validation**:
   ```bash
   npm run validate
   ```
   This command automatically runs:
   - `npm run lint` (ESLint 9)
   - `npm run typecheck` (`tsc -b --noEmit`)
   - `npm test` (Vitest unit tests)
   - `npm run build` (Vite & PWA build)

---

## Conventional Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for structured history and automated releases with **Release Please**:

| Prefix | Description | Example |
| :--- | :--- | :--- |
| `feat:` | A new feature or calculation capability | `feat(calculator): add bevel cluster calculation support` |
| `fix:` | A bug fix | `fix(pwa): resolve offline sync cache issue` |
| `docs:` | Documentation changes | `docs: update formulas and artisan guide` |
| `style:` | Code style / formatting (no logic change) | `style: polish responsive drawer sheet spacing` |
| `refactor:` | Code restructuring without feature change | `refactor(context): streamline project state handlers` |
| `perf:` | Performance improvements | `perf: memoize heavy breakdown calculation pipeline` |
| `test:` | Adding or updating unit tests | `test(calculations): add perimeter foil edge cases` |
| `chore:` | Build, tooling, CI/CD changes | `chore: update github action dependencies` |

---

## Submitting a Pull Request

1. Push your branch to GitHub:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch.
3. Fill out the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
4. Ensure all automated GitHub Actions CI checks pass.

---

## Coding Guidelines

- **TypeScript**: Strict typing is enabled. Never use `any` — use proper discriminated unions or interfaces from `src/types/`.
- **Styling**: Use Tailwind CSS utility classes and design tokens defined in `src/index.css`.
- **Pure Math**: Keep cost calculation logic in `src/utils/calculations.ts` pure, deterministic, and covered by Vitest tests.
- **Accessibility & Mobile**: All interactive components must be keyboard accessible (`focus-visible`) and responsive across mobile and desktop.
