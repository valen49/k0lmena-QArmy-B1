import { Page } from '@playwright/test';
export const emailInput = (page: Page) => page.getByRole('textbox', { name: 'E-Mail Address' });
export const passwordInput = (page: Page) => page.getByRole('textbox', { name: 'Password' });
export const loginButton = (page: Page) => page.getByRole('button', { name: 'Login' });
export const warningMessage = (page: Page) => page.getByText('Warning: No match for E-Mail Address and/or Password.');