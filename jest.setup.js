// Extends Jest's expect() with the jsdom-aware matchers (toBeInTheDocument,
// toHaveClass, toHaveAttribute, etc.) used throughout the component tests.
import '@testing-library/jest-dom/jest-globals'