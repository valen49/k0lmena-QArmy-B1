import { Page } from '@playwright/test';

// Locators como funciones que reciben la página
export const firstNameInput = (page: Page) => page.getByRole('textbox', { name: 'First Name*' });
export const lastNameInput = (page: Page) => page.getByRole('textbox', { name: 'Last Name*' });
export const emailInput = (page: Page) => page.getByRole('textbox', { name: 'E-Mail*' });
export const telephoneInput = (page: Page) => page.getByRole('textbox', { name: 'Telephone*' });
export const passwordInput = (page: Page) => page.getByRole('textbox', { name: 'Password*' });
export const confirmPasswordInput = (page: Page) => page.getByRole('textbox', { name: 'Password Confirm*' });

// Para opciones de selección / checkboxes / botones
export const newsletterNoOption = (page: Page) => page.getByText('No', { exact: true });
export const privacyPolicyCheckbox = (page: Page) => page.getByText('I have read and agree to the');
export const continueButton = (page: Page) => page.getByRole('button', { name: 'Continue' });


export const errorEmailExistsMessage = (page: Page) => page.locator('.alert-danger');