const { test, expect } = require('@playwright/test');

// Локальные тестовые данные
const TEST_DATA = {
  users: [
    { user: 'standard_user', pass: 'secret_sauce' },
    { user: 'problem_user', pass: 'secret_sauce' }
  ],
  products: ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'],
  firstNames: ['Иван', 'Алексей', 'Мария', 'Екатерина'],
  lastNames: ['Иванов', 'Петров', 'Сидорова', 'Кузнецова'],
  zipCodes: ['123456', '654321', '111111', '222222']
};

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

test('Многоразовый тест с вариациями', async ({ page }) => {
  const TEST_RUNS = 3; // Количество повторов
  
  for (let i = 0; i < TEST_RUNS; i++) {
    console.log(`\n=== Запуск ${i+1}/${TEST_RUNS} ===`);

    // 1. Рандомный логин
    const user = getRandomItem(TEST_DATA.users);
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', user.user);
    await page.fill('#password', user.pass);
    await page.click('#login-button');
    await page.waitForSelector('.inventory_list');

    // 2. Добавление товара
    const product = getRandomItem(TEST_DATA.products);
    await page.click(`text=${product}`);
    await page.click('button:has-text("Add to cart")');
    await page.click('[data-test="back-to-products"]');

    // 3. Случайное дополнительное действие
    if (Math.random() > 0.5) {
      await page.click('button:has-text("Add to cart") >> nth=1');
      console.log('Добавлен второй товар');
    }

    // 4. Оформление заказа
    await page.click('.shopping_cart_link');
    await page.click('#checkout');
    await page.fill('#first-name', getRandomItem(TEST_DATA.firstNames));
    await page.fill('#last-name', getRandomItem(TEST_DATA.lastNames));
    await page.fill('#postal-code', getRandomItem(TEST_DATA.zipCodes));
    await page.click('#continue');
    await page.click('#finish');

    // 5. Выход и скриншот
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await page.screenshot({ path: `screenshots/run-${i+1}.png` });
  }
});