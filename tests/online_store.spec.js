const { test, expect } = require('@playwright/test');

test('Тест интернет-магазина', async ({ page }) => {
  // Увеличиваем таймауты
  test.slow();
  
  // 1. Открываем сайт
  await page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'step1-login-page.png' });

  // 2. Логин (используем стандартные тестовые данные)
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await page.waitForSelector('.inventory_list', { state: 'visible' });
  await page.screenshot({ path: 'step2-after-login.png' });

  // 3. Выбираем товар
  const product = await page.locator('.inventory_item_name').first().textContent();
  await page.click('button:has-text("Add to cart") >> nth=0');
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  await page.screenshot({ path: 'step3-item-added.png' });

  // 4. Переходим в корзину
  await page.click('.shopping_cart_link');
  await expect(page.locator('.cart_item')).toHaveCount(1);
  await expect(page.locator('.inventory_item_name')).toHaveText(product);
  await page.screenshot({ path: 'step4-cart.png' });

  // 5. Оформляем заказ
  await page.click('#checkout');
  await page.fill('#first-name', 'Test');
  await page.fill('#last-name', 'User');
  await page.fill('#postal-code', '12345');
  await page.click('#continue');
  await page.screenshot({ path: 'step5-checkout.png' });

  // 6. Завершаем заказ
  await page.click('#finish');
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  await page.screenshot({ path: 'step6-complete.png' });
});