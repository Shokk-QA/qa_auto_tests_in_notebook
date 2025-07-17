const { test, expect } = require('@playwright/test');

// Конфигурация теста
const config = {
  baseUrl: 'https://www.saucedemo.com',
  credentials: {
    valid: { username: 'standard_user', password: 'secret_sauce' },
    invalid: { username: 'locked_out_user', password: 'wrong_password' }
  },
  products: ['Sauce Labs Backpack', 'Sauce Labs Bike Light']
};

test('Надёжный тест интернет-магазина', async ({ page }) => {
  // Устанавливаем таймаут для всех ожиданий
  test.setTimeout(12000);

  // 1. Переход на сайт с проверкой
  await page.goto(config.baseUrl, { waitUntil: 'networkidle' });
  await expect(page).toHaveTitle('Swag Labs');
  await page.screenshot({ path: 'screenshots/01-page-loaded.png' });

  // 2. Ввод логина с проверкой поля
  await page.fill('#user-name', config.credentials.valid.username);
  await expect(page.locator('#user-name')).toHaveValue(config.credentials.valid.username);
  
  // 3. Ввод пароля с задержкой и проверкой
  await page.fill('#password', config.credentials.valid.password);
  await page.waitForTimeout(1000); // Искусственная пауза
  await expect(page.locator('#password')).not.toBeEmpty();
  await page.screenshot({ path: 'screenshots/02-credentials-filled.png' });

  // 4. Клик по кнопке с ожиданием перехода
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('#login-button')
  ]);

  // 5. Проверка успешного входа
  await expect(page.locator('.inventory_list')).toBeVisible();
  await page.screenshot({ path: 'screenshots/03-login-success.png' });

  // 6. Добавление товара в корзину
  const product = config.products[0];
  await page.click(`text=${product}`);
  await page.click('button:has-text("Add to cart")');
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  await page.screenshot({ path: 'screenshots/04-product-added.png' });

  // 7. Оформление заказа
  await page.click('.shopping_cart_link');
  await page.click('#checkout');
  await page.fill('#first-name', 'Test');
  await page.fill('#last-name', 'User');
  await page.fill('#postal-code', '12345');
  await page.click('#continue');
  await page.screenshot({ path: 'screenshots/05-checkout.png' });

  // 8. Завершение заказа
  await page.click('#finish');
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  await page.screenshot({ path: 'screenshots/06-order-complete.png' });
});