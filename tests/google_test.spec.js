const { test, expect } = require('@playwright/test');

test('Поиск в Google', async ({ page }) => {
  // Открываем Google
  await page.goto('https://www.google.com');
  
  // Вводим запрос в поисковую строку
  await page.fill('textarea[name="q"]', 'Playwright automation');
  
  // Нажимаем Enter
  await page.keyboard.press('Enter');
  
  // Ждем загрузки результатов
  await page.waitForSelector('h3');
  
  // Делаем скриншот (чтобы увидеть результат)
  await page.screenshot({ path: 'google-search.png' });
  
  // Проверяем, что заголовок содержит слово "Playwright"
  await expect(page).toHaveTitle(/Playwright/);
});