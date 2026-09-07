import { describe, expect, it } from 'vitest';
import { authErrorMessage } from './auth';

describe('authErrorMessage', () => {
  it('does not expose the Firebase hidden database error', () => {
    expect(authErrorMessage(new Error('Database is closing/hidden'))).toBe(
      'Sign-in was interrupted. Please try again.',
    );
  });
});
