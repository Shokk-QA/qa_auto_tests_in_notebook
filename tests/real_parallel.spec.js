const { test, expect } = require('@playwright/test');

// Улучшенная конфигурация сценариев
const SCENARIOS = [
  {
    id: 1,
    user: 'standard_user',
    steps: [
      { action: 'add', product: 'Sauce Labs Backpack', retry: 3 },
      { action: 'checkout', retry: 2 }
    ]
  },
  {
    id: 2,
    user: 'problem_user',
    steps: [
      { action: 'add', product: 'Sauce Labs Bike Light', retry: 3 }
    ]
  },
  {
    id: 3,
    user: 'performance_glitch_user',
    steps: [
      { action: 'add', product: 'Sauce Labs Bolt T-Shirt', retry: 3 },
      { action: 'remove', retry: 2 }
    ]
  }
];

test.describe.configure({ mode: 'parallel' }); // Явное указание параллельного режима

SCENARIOS.forEach(scenario => {
  test(`Сценарий ${scenario.id} (${scenario.user})`, async ({ page }) => {
    // Увеличенные таймауты для этого теста
    test.slow();
    
    try {
      // 1. Авторизация с улучшенными ожиданиями
      await page.goto('https://www.saucedemo.com', { waitUntil: 'networkidle' });
      await page.waitForSelector('#user-name', { state: 'visible', timeout: 15000 });
      await page.fill('#user-name', scenario.user);
      await page.fill('#password', 'secret_sauce');
      
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.click('#login-button')
      ]);
      
      // 2. Выполнение шагов сценария
      for (const step of scenario.steps) {
        await executeStep(page, step);
      }
      
      // 3. Фиксация результата
      await page.screenshot({ path: `screenshots/scenario-${scenario.id}-done.png` });
    } catch (error) {
      await page.screenshot({ path: `screenshots/scenario-${scenario.id}-error.png` });
      throw error;
    }
  });
});

// ===== УЛУЧШЕННЫЕ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

async function executeStep(page, step) {
  for (let attempt = 1; attempt <= (step.retry || 1); attempt++) {
    try {
      switch(step.action) {
        case 'add':
          await addToCart(page, step.product);
          return;
        case 'remove':
          await removeFromCart(page);
          return;
        case 'checkout':
          await completeCheckout(page);
          return;
      }
    } catch (error) {
      if (attempt === (step.retry || 1)) throw error;
      await page.reload();
    }
  }
}

async function addToCart(page, productName) {
  await page.click(`text=${productName}`);
  await page.waitForSelector('button:has-text("Add to cart")', { state: 'visible', timeout: 10000 });
  await page.click('button:has-text("Add to cart")');
  
  // Улучшенная проверка корзины
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1', { timeout: 10000 });
  await page.click('[data-test="back-to-products"]');
}

async function removeFromCart(page) {
  await page.click('.shopping_cart_link');
  await page.waitForSelector('button:has-text("Remove")', { state: 'visible', timeout: 10000 });
  await page.click('button:has-text("Remove")');
  await expect(page.locator('.shopping_cart_badge')).not.toBeVisible({ timeout: 5000 });
}

async function completeCheckout(page) {
  await page.click('.shopping_cart_link');
  await page.click('#checkout');
  
  await page.waitForSelector('#first-name', { state: 'visible', timeout: 10000 });
  await page.fill('#first-name', 'TestUser');
  await page.fill('#last-name', 'Testov');
  await page.fill('#postal-code', '123456');
  
  await page.click('#continue');
  await page.waitForSelector('#finish', { state: 'visible', timeout: 10000 });
  await page.click('#finish');
  
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!', { timeout: 15000 });
}