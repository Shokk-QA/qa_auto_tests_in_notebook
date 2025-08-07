//твой код тут
function parseJSON(str){
    try{
return JSON.parse(str)
}catch(error){
return 'Invalid JSON'}
}
//
console.log(parseJSON(str));