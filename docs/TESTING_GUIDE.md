# Testing Guide

## Overview

This document describes the testing strategy and how to run tests for the "AI or Not?" game.

## Testing Stack

- **Unit/Integration Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **Coverage**: Jest Coverage

## Test Structure

```
├── src/
│   ├── lib/__tests__/          # Unit tests for utilities
│   ├── hooks/__tests__/         # Unit tests for custom hooks
│   ├── components/__tests__/    # Component tests
│   └── services/__tests__/      # Service/API tests
├── e2e/                         # End-to-end tests
├── jest.config.js               # Jest configuration
├── jest.setup.js                # Jest setup and mocks
└── playwright.config.ts         # Playwright configuration
```

## Running Tests

### Unit & Integration Tests

```bash
# Run tests in watch mode (for development)
npm test

# Run tests once (for CI)
npm run test:ci

# Run tests with coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI (interactive mode)
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug
```

## Test Coverage Goals

- **Branches**: 60%+
- **Functions**: 60%+
- **Lines**: 60%+
- **Statements**: 60%+

## Writing Tests

### Unit Tests Example

```typescript
// src/lib/__tests__/example.test.ts
import { myFunction } from '../example'

describe('myFunction', () => {
  it('should return expected result', () => {
    const result = myFunction('input')
    expect(result).toBe('expected output')
  })

  it('should handle edge cases', () => {
    expect(() => myFunction(null)).toThrow()
  })
})
```

### Component Tests Example

```typescript
// src/components/__tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent prop="value" />)
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### E2E Tests Example

```typescript
// e2e/feature.spec.ts
import { test, expect } from '@playwright/test'

test('should perform user action', async ({ page }) => {
  await page.goto('/')
  
  await page.click('button[name="action"]')
  
  await expect(page.getByText('Result')).toBeVisible()
})
```

## Test Categories

### 1. Unit Tests

Test individual functions and utilities in isolation:
- Utility functions (`lib/`)
- Custom hooks (`hooks/`)
- Helper functions

### 2. Component Tests

Test React components with React Testing Library:
- Component rendering
- User interactions
- Props handling
- State management

### 3. Integration Tests

Test how multiple units work together:
- API service integration
- Database operations (mocked)
- Component interactions

### 4. E2E Tests

Test complete user workflows:
- Game flow (load image → make choice → see results → next image)
- Navigation between pages
- Leaderboard functionality
- Mobile responsiveness
- Keyboard shortcuts
- Cross-browser compatibility

## Continuous Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Deployment pipeline

### CI Configuration

```yaml
# Example GitHub Actions workflow
- name: Run unit tests
  run: npm run test:ci

- name: Run E2E tests
  run: npm run test:e2e
```

## Best Practices

### 1. Test Organization
- Group related tests with `describe()`
- Use clear, descriptive test names
- Follow AAA pattern: Arrange, Act, Assert

### 2. Mocking
- Mock external dependencies
- Mock API calls in unit tests
- Use real APIs in E2E tests (with test data)

### 3. Assertions
- Test both happy path and error cases
- Test edge cases and boundary conditions
- Use specific matchers (not just `toBeTruthy()`)

### 4. Test Data
- Use realistic test data
- Clean up after tests
- Don't rely on order of test execution

### 5. Performance
- Keep unit tests fast (<100ms each)
- Use `beforeEach/afterEach` for setup/teardown
- Parallelize E2E tests when possible

## Debugging Tests

### Jest Tests

```bash
# Run specific test file
npx jest src/lib/__tests__/haptics.test.ts

# Run tests matching pattern
npx jest --testNamePattern="should trigger success"

# Debug mode with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Playwright Tests

```bash
# Run specific test
npx playwright test e2e/game.spec.ts

# Run with headed browser (see what's happening)
npx playwright test --headed

# Debug with Playwright Inspector
npx playwright test --debug

# Generate trace for failed tests
npx playwright test --trace on
```

## Coverage Reports

After running `npm run test:coverage`, view the coverage report:

```bash
# HTML report (open in browser)
open coverage/lcov-report/index.html

# Console summary
npm run test:coverage
```

## Known Issues & Workarounds

### Issue: Jest + Next.js 15

Next.js 15 uses experimental features that may cause warnings. These are safe to ignore in tests.

### Issue: Playwright Timeout

If tests timeout:
1. Increase timeout in `playwright.config.ts`
2. Use `{ timeout: 60000 }` in specific tests
3. Check if dev server is running

### Issue: Flaky Tests

If tests fail intermittently:
1. Add explicit waits (`waitFor`)
2. Use `retry` configuration
3. Check for race conditions

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated**: October 18, 2025

