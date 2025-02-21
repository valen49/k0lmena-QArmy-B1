module.exports = { googleSearch };

async function googleSearch(page) {
    await page.goto('https://www.google.com');
    await page.waitForSelector('//textarea[contains(@name,"q")]');
    await page.fill('//textarea[contains(@name,"q")]', 'k0lmena framework');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
}