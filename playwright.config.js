const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 300000, // 5 минут на все тесты
  workers: 1, // Сначала проверим на 1 worker
  fullyParallel: false,
  retries: 0, // Отключаем автоматические повторы для отладки
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    headless: false,
    actionTimeout: 30000, // 30 сек на каждое действие
    navigationTimeout: 40000, // 40 сек на навигацию
    trace: 'on',
    video: 'on',
    screenshot: 'on',
    viewport: { width: 1280, height: 720 },
    launchOptions: {
      slowMo: 1000, // Замедление для визуального контроля
      args: ['--start-maximized']
    }
  }
});