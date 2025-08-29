# Contributing to Project Nidhi

Thank you for considering contributing to Project Nidhi! We welcome contributions from developers of all skill levels.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/nidhi.git
   cd nidhi
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables** by copying `.env.example` to `.env.local`
5. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

### Branch Naming Convention

- **Features**: `feature/description-of-feature`
- **Bug fixes**: `bugfix/description-of-bug`
- **Documentation**: `docs/description-of-changes`
- **Refactoring**: `refactor/description-of-refactor`

### Commit Message Format

Follow the conventional commit format:

```
type(scope): brief description

Detailed description if necessary

- Additional notes or breaking changes
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(campaigns): add campaign filtering by category
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
```

## Pull Request Process

1. **Update documentation** for any new features
2. **Run tests and linting**:
   ```bash
   npm run lint
   npm run build
   ```
3. **Ensure responsive design** works on mobile and desktop
4. **Test blockchain integrations** on testnets
5. **Update the README** if you've made significant changes
6. **Create a pull request** with:
   - Clear title and description
   - Screenshots for UI changes
   - Test results
   - Breaking changes noted

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Blockchain functionality tested on testnet

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## Coding Standards

### TypeScript

- Use **TypeScript** for all new files
- Define interfaces for props and data structures
- Use proper type annotations
- Avoid `any` types when possible

### React/Next.js

- Use **functional components** with hooks
- Follow React best practices
- Use Next.js App Router conventions
- Implement proper error boundaries

### Styling

- Use **Tailwind CSS** for styling
- Follow mobile-first responsive design
- Use Radix UI components when possible
- Maintain consistent spacing and typography

### Code Organization

```
├── app/                    # Next.js app router pages
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   └── ...               # Feature-specific components
├── lib/                  # Utility functions and configurations
├── context/              # React context providers
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

### File Naming

- **Components**: PascalCase (`UserProfile.tsx`)
- **Pages**: kebab-case (`create-campaign/page.tsx`)
- **Utilities**: camelCase (`firebase.ts`)
- **Types**: camelCase (`user.types.ts`)

## Testing Guidelines

### Manual Testing Checklist

- [ ] **Authentication Flow**
  - [ ] Sign in with Google works
  - [ ] Sign out functionality
  - [ ] Protected routes redirect properly

- [ ] **Campaign Management**
  - [ ] Create campaign with AI validation
  - [ ] Browse campaigns page loads
  - [ ] Campaign details page displays correctly
  - [ ] Contribution process works

- [ ] **Blockchain Integration**
  - [ ] MetaMask connection
  - [ ] Smart contract interactions
  - [ ] Transaction confirmations
  - [ ] Error handling for failed transactions

- [ ] **Responsive Design**
  - [ ] Mobile navigation works
  - [ ] All pages responsive on different screen sizes
  - [ ] Touch interactions work properly

### Browser Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Issue Reporting

When reporting issues, include:

1. **Clear description** of the problem
2. **Steps to reproduce** the issue
3. **Expected behavior**
4. **Actual behavior**
5. **Environment details**:
   - Browser and version
   - Operating system
   - Node.js version
   - Network used (mainnet, testnet)

### Issue Template

```markdown
## Bug Description
A clear description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows, Ubuntu]
- Browser: [e.g., Chrome 120, Firefox 121]
- Node.js: [e.g., 18.17.0]
- Network: [e.g., Goerli testnet]

## Screenshots
Add screenshots if applicable
```

## Development Environment Setup

### Required Tools

- **Node.js 18+**
- **npm or yarn**
- **Git**
- **MetaMask browser extension**
- **VS Code** (recommended)

### Recommended VS Code Extensions

- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Auto Rename Tag
- Bracket Pair Colorizer

### Environment Variables

Ensure all required environment variables are set:
- Firebase configuration
- Smart contract addresses
- API keys
- Network configurations

## Smart Contract Development

### Guidelines

- Use **Solidity best practices**
- Include comprehensive tests
- Document all functions
- Follow security audit recommendations
- Test on testnets before mainnet

### Deployment Process

1. Test contracts on local network
2. Deploy to testnet
3. Verify contract functionality
4. Update contract addresses in app
5. Test full integration
6. Deploy to mainnet (production only)

## Documentation

### What to Document

- **New features**: How to use and configure
- **API changes**: Updated endpoints or parameters
- **Breaking changes**: Migration guide
- **Complex logic**: Code comments and explanations

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep README and other docs updated

## Questions and Support

If you have questions:

1. Check existing issues and discussions
2. Search documentation and README
3. Ask in GitHub Discussions
4. Contact maintainers if necessary

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes
- Project acknowledgments

Thank you for contributing to Project Nidhi! 🚀