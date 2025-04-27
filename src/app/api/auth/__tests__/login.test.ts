/**
 * @jest-environment node
 */

// Route handlers touch Node-only APIs (Request/Response, next/headers) that
// don't exist under jsdom, so this file runs in the "node" test environment
// instead of the project default.
//
// Each jest.mock() factory below is fully self-contained - it declares any
// mock functions it needs *inside* the factory, rather than capturing an
// outer `const`. jest.mock() calls get hoisted above every other top-level
// statement in this file (including `const` declarations that appear
// earlier in the source), so a factory that captured an outer
// `const mockX = jest.fn()` hits a temporal-dead-zone ReferenceError the
// moment the real module gets required - which is above where that const
// would otherwise have run. Mock handles are recovered afterwards, below
// the imports, by calling into the now-mocked modules instead.

jest.mock('@prisma/client', () => {
  // Always return the same object from every `new PrismaClient()` call so
  // that login.ts's own singleton instance and the instance this test file
  // inspects share the exact same `findUnique` mock function.
  const mockPrismaClient = {
    user: { findUnique: jest.fn() },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-token'),
}));

jest.mock('next/headers', () => {
  const mockCookieStore = { set: jest.fn() };
  return {
    cookies: jest.fn(() => Promise.resolve(mockCookieStore)),
  };
});

import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { POST } from '../login';

const mockFindUnique = new (PrismaClient as any)().user.findUnique;
const mockCompare = bcrypt.compare as jest.Mock;

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects an email that has no matching account', async () => {
    mockFindUnique.mockResolvedValueOnce(null);

    const res = await POST(makeRequest({ email: 'nobody@example.com', password: 'x' }));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.message).toBe('Invalid credentials');
  });

  it('rejects a valid email with the wrong password', async () => {
    mockFindUnique.mockResolvedValueOnce({ id: '1', email: 'a@a.com', password: 'hashed' });
    mockCompare.mockResolvedValueOnce(false);

    const res = await POST(makeRequest({ email: 'a@a.com', password: 'wrong' }));

    expect(res.status).toBe(401);
  });

  it('signs a token and sets an auth cookie on valid credentials', async () => {
    mockFindUnique.mockResolvedValueOnce({ id: '1', email: 'a@a.com', password: 'hashed' });
    mockCompare.mockResolvedValueOnce(true);

    const res = await POST(makeRequest({ email: 'a@a.com', password: 'right' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.user).toEqual({ id: '1', email: 'a@a.com' });

    const cookieStore = await cookies();
    expect(cookieStore.set).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'token', value: 'mock-token', httpOnly: true })
    );
  });

  it('returns a 500 instead of leaking an unexpected error', async () => {
    mockFindUnique.mockRejectedValueOnce(new Error('database is down'));

    const res = await POST(makeRequest({ email: 'a@a.com', password: 'x' }));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.message).toBe('Internal server error');
  });
});
