from playwright.sync_api import sync_playwright

def test_open_google():
    with sync_playwright() as p:
        # Запускаем браузер (по умолчанию Chromium)
        browser = p.chromium.launch(headless=False)  # headless=False чтобы видеть браузер
        page = browser.new_page()
        
        # Открываем страницу Google
        page.goto("https://google.com")
        
        # Проверяем заголовок страницы
        assert "Google" in page.title()
        
        # Закрываем браузер
        browser.close()

if __name__ == "__main__":
    test_open_google()
    print("Тест успешно выполнен!")