import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../services/auth', () => ({
  authErrorMessage: () => 'Google sign-in could not be completed.',
  authService: {
    completeGoogleRedirect: vi.fn().mockRejectedValue(new Error('redirect failed')),
  },
}));

import { AuthScreen } from './AuthScreen';

describe('AuthScreen', () => {
  it('shows redirect completion errors after returning to the app', async () => {
    render(<AuthScreen />);

    expect(await screen.findByText('Google sign-in could not be completed.')).toBeTruthy();
  });
});
