import { beforeEach, describe, expect, it, vi } from 'vitest';

const authMocks = vi.hoisted(() => ({
  getRedirectResult: vi.fn(),
}));

vi.mock('firebase/auth', async (importOriginal) => ({
  ...await importOriginal<typeof import('firebase/auth')>(),
  getRedirectResult: authMocks.getRedirectResult,
}));

vi.mock('./firebase', () => ({ auth: {}, db: null }));

import { authErrorMessage, authService } from './auth';

describe('authErrorMessage', () => {
  it('does not expose the Firebase hidden database error', () => {
    expect(authErrorMessage(new Error('Database is closing/hidden'))).toBe(
      'Sign-in was interrupted. Please try again.',
    );
  });
});

describe('completeGoogleRedirect', () => {
  beforeEach(() => {
    authMocks.getRedirectResult.mockReset();
  });

  it('consumes the redirect result once and returns the authenticated user', async () => {
    const user = { uid: 'google-user' };
    authMocks.getRedirectResult.mockResolvedValue({ user });

    const first = authService.completeGoogleRedirect();
    const second = authService.completeGoogleRedirect();

    await expect(first).resolves.toBe(user);
    await expect(second).resolves.toBe(user);
    expect(authMocks.getRedirectResult).toHaveBeenCalledTimes(1);
  });
});
