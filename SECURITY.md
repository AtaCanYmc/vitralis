# Security Policy 🔒

## Supported Versions

We actively provide security updates and patches for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

---

## Reporting a Vulnerability

We take the security of **Vitralis** and user workshop data seriously. If you discover a security vulnerability, please report it responsibly:

1. **Do not create a public GitHub issue.**
2. Use GitHub's private vulnerability reporting feature on the repository:
   - Navigate to **Security** ➔ **Advisories** ➔ **Report a vulnerability**.
   - Or email us at `security@vitralis.app`.
3. Provide a detailed description of the vulnerability, reproduction steps, and potential impact.

---

## Response Timeline

- **Initial Acknowledgement**: Within 48 hours.
- **Vulnerability Assessment & Triage**: Within 5 business days.
- **Fix & Public Advisory**: Released as a patch version via automated release pipeline.

---

## Client-Side Security & Privacy

- **Zero-Cloud Storage**: Vitralis operates 100% locally in the user's browser using `localStorage`. No formulas, recipes, or client quotes are transmitted to external servers.
- **Content Security**: All inputs are sanitized, and PDF quotation exports are rendered directly in the DOM using print stylesheets.
