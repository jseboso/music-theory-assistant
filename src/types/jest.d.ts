// jest.setup.js runs `import '@testing-library/jest-dom/jest-globals'` at
// test *runtime*, but jest.setup.js is a plain .js file that's never part of
// the TypeScript program (it's only referenced from jest.config.js, not
// imported by any .ts/.tsx file). That means the type augmentation that
// import provides - adding toBeInTheDocument/toHaveClass/etc. to the
// '@jest/expect' Matchers interface - never reaches the compiler.
//
// This file exists purely so tsc includes that same import somewhere in the
// compiled graph (it's picked up automatically because it matches the
// "**/*.ts" include pattern), which is enough for the module augmentation
// to apply project-wide.
import '@testing-library/jest-dom/jest-globals';
