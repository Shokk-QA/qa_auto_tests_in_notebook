const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Введите 4 числа через пробел (тариф, лимит, доплата, трафик): ', (input) => {
  const [tariffCost, tariffLimit, extraCost, plannedTraffic] = input.split(' ').map(Number);
  
  // Вычисляем дополнительные мегабайты (если трафик превышает лимит)
  const extraTraffic = Math.max(0, plannedTraffic - tariffLimit);
  
  // Считаем общую стоимость
  const totalCost = tariffCost + (extraTraffic * extraCost);
  
  console.log(`Суммарные расходы Кости: ${totalCost} рублей`);
  
  rl.close();
});