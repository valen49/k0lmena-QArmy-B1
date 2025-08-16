import { Page } from '@playwright/test';
export const yourNameInput = (page: Page) => page.getByRole('textbox', { name: 'Your Name' });
export const yourReviewInput = (page: Page) => page.getByRole('textbox', { name: 'Your Review' });
export const writeReviewButton = (page: Page) => page.getByRole('button', { name: 'Write Review' });
export const warningMessage = (page: Page) => page.getByText('Warning: Please select a review rating!');