//Создание ошибки с new Error
//Самый простой способ создать ошибку — использовать new Error().

function divide(a, b) {
    if (b === 0) {
        throw new Error("Деление на ноль запрещено!");
    }
    return a / b;
}

try {
    console.log(divide(10, 0)); // Ошибка!
} catch (error) {
    console.error("Ошибка:", error.message);
}
//Здесь, если b === 0, создается ошибка с текстом "Деление на ноль запрещено!", и она перехватывается в catch.


//Создание собственного класса ошибки
//JavaScript позволяет создавать собственные классы ошибок, унаследовав их от Error. Это удобно, если нужно различать ошибки по типам.
//Пример: Создаем класс ValidationError

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

function checkAge(age) {
    if (age < 18) {
        throw new ValidationError("Возраст должен быть не меньше 18 лет!");
    }
    return "Доступ разрешен!";
}

try {
    console.log(checkAge(16)); // Ошибка ValidationError
} catch (error) {
    console.error(error.name + ": " + error.message);
}
//Здесь создается класс ValidationError, который ведет себя как обычная ошибка, но с собственным названием.


//Несколько видов пользовательских ошибок
//Можно создать разные типы ошибок для разных ситуаций.

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}

class PermissionError extends Error {
    constructor(message) {
        super(message);
        this.name = "PermissionError";
    }
}

function getUser(id) {
    if (id !== 1) {
        throw new NotFoundError("Пользователь не найден!");
    }
    return { id: 1, name: "Иван" };
}

try {
    console.log(getUser(2)); // Ошибка NotFoundError
} catch (error) {
    console.error(error.name + ": " + error.message);
}
//В этом примере есть две ошибки: NotFoundError (если пользователь не найден) и PermissionError (если нет доступа).

