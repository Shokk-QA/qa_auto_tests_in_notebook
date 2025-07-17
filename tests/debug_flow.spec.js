const { test, expect } = require('@playwright/test');

test('Пошаговый тест с визуальным контролем', async ({ page }) => {
  // 1. Открытие сайта с проверкой
  console.log('Шаг 1: Открытие сайта...');
  await page.goto('https://www.saucedemo.com', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await page.screenshot({ path: 'screenshots/01-page-loaded.png' });
  await expect(page).toHaveTitle('Swag Labs');
  console.log('Сайт успешно загружен');

  // 2. Ввод логина с визуальной проверкой
  console.log('Шаг 2: Ввод логина...');
  await page.fill('#user-name', 'standard_user', { timeout: 20000 });
  await page.screenshot({ path: 'screenshots/02-username-filled.png' });
  console.log('Логин введен');

  // 3. Ввод пароля с паузой
  console.log('Шаг 3: Ввод пароля...');
  await page.waitForTimeout(1000); // Искусственная пауза
  await page.fill('#password', 'secret_sauce', { timeout: 20000 });
  await page.screenshot({ path: 'screenshots/03-password-filled.png' });
  console.log('Пароль введен');

  // 4. Клик по кнопке с ожиданием перехода
  console.log('Шаг 4: Нажатие кнопки входа...');
  await Promise.all([
    page.waitForNavigation({ 
      waitUntil: 'networkidle',
      timeout: 40000 
    }),
    page.click('#login-button', { timeout: 30000 })
  ]);
  await page.screenshot({ path: 'screenshots/04-after-login.png' });
  console.log('Успешный вход');

  // 5. Добавление товара с проверками
  console.log('Шаг 5: Добавление товара в корзину...');
  const product = 'Sauce Labs Backpack';
  await page.click(`text=${product}`, { timeout: 20000 });
  await page.waitForSelector('button:has-text("Add to cart")', { 
    state: 'visible',
    timeout: 20000 
  });
  await page.click('button:has-text("Add to cart")', { timeout: 20000 });
  
  // Альтернативная проверка корзины
  try {
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1', { timeout: 10000 });
  } catch (error) {
    console.log('Проверка корзины не удалась, делаем дополнительный скриншот');
    await page.screenshot({ path: 'screenshots/error-cart-check.png' });
    throw error;
  }
  
  await page.screenshot({ path: 'screenshots/05-item-added.png' });
  console.log('Товар добавлен в корзину');
});