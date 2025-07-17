const { test, expect } = require('@playwright/test');

// Уникальные данные для каждого пользователя
const USERS = [
  { 
    id: 1,
    username: 'standard_user',
    password: 'secret_sauce',
    actions: ['add_laptop', 'checkout']
  },
  {
    id: 2,
    username: 'problem_user',
    password: 'secret_sauce',
    actions: ['add_tshirt']
  },
  {
    id: 3,
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    actions: ['add_bikelight', 'remove_item']
  }
];

// Продукты для теста
const PRODUCTS = {
  laptop: 'Sauce Labs Backpack',
  bikelight: 'Sauce Labs Bike Light',
  tshirt: 'Sauce Labs Bolt T-Shirt'
};

USERS.forEach(user => {
  test(`Пользователь #${user.id} (${user.username})`, async ({ page }) => {
    // 1. Логин
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', user.username);
    await page.fill('#password', user.password);
    await page.click('#login-button');
    await expect(page.locator('.inventory_list')).toBeVisible();

    // 2. Выполняем действия пользователя
    for (const action of user.actions) {
      switch(action) {
        case 'add_laptop':
          await addProduct(page, PRODUCTS.laptop);
          break;
        case 'add_bikelight':
          await addProduct(page, PRODUCTS.bikelight);
          break;
        case 'add_tshirt':
          await addProduct(page, PRODUCTS.tshirt);
          break;
        case 'remove_item':
          await removeProduct(page);
          break;
        case 'checkout':
          await checkout(page);
          break;
      }
    }

    // 3. Скриншот результата
    await page.screenshot({ path: `screenshots/user-${user.id}-done.png` });
  });
});

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

async function addProduct(page, productName) {
  await page.click(`text=${productName}`);
  await page.click('button:has-text("Add to cart")');
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  await page.click('[data-test="back-to-products"]');
}

async function removeProduct(page) {
  await page.click('.shopping_cart_link');
  await page.click('button:has-text("Remove")');
  await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
}

async function checkout(page) {
  await page.click('.shopping_cart_link');
  await page.click('#checkout');
  
  // Заполняем форму случайными данными
  await page.fill('#first-name', `User${Date.now().toString().slice(-3)}`);
  await page.fill('#last-name', 'Test');
  await page.fill('#postal-code', '12345');
  
  await page.click('#continue');
  await page.click('#finish');
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
}