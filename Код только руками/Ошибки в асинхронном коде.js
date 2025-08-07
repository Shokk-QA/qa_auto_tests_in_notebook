//Создайте функцию fetchUserData, которая принимает имя пользователя. Если имя не передано, отклоняйте промис с ошибкой "Username is required". В противном случае промис должен выполняться с объектом пользователя { name: username, age: 25 } через 1 секунду. Используйте async/await и try...catch для обработки ошибок.
async function fetchUserData(name) {
    try {
        if (name.length === 0) {
            throw new Error('Username is required');
        }
        await setTimeout(() => 1000);
        return {name: name, age: 25};
    } catch(error) {
        return error.message;
    }
}
//
console.log(await fetchUserData(username));

//Создайте функцию checkStock, которая принимает название товара и возвращает количество. Если товара нет в stock, отклоняйте промис с ошибкой "Item not found". Используйте async/await и обработайте ошибку.