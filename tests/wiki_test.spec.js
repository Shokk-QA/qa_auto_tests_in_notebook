const { test, expect } = require('@playwright/test');

test('Поиск на Wikipedia', async ({ page }) => {
  // Шаг 1: Открываем Wikipedia
  await page.goto('https://www.wikipedia.org/');
  await page.waitForTimeout(1000); // Пауза для наглядности

  // Шаг 2: Меняем язык на русский
  await page.click('#js-link-box-ru');
  await expect(page).toHaveURL(/ru.wikipedia.org/);
  await page.waitForTimeout(1000);

  // Шаг 3: Вводим поисковый запрос
  await page.fill('#searchInput', 'Автоматизированное тестирование');
  await page.waitForTimeout(500);
  
  // Шаг 4: Нажимаем кнопку поиска
  await page.click('#searchButton');
  await page.waitForTimeout(1000);

  // Шаг 5: Проверяем результат
  await expect(page.locator('h1')).toHaveText('Автоматизированное тестирование');
  await expect(page.locator('text=Программное обеспечение')).toBeVisible();

  // Шаг 6: Делаем скриншот
  await page.screenshot({ path: 'wikipedia-result.png', fullPage: true });
});