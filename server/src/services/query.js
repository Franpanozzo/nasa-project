const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;  // porque si a le pasas 0 como limite de pagina a mongo te retorna todo (y eso es lo que queremos si no nos pasan limite)

function getPagination(query) { 
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER; 
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT; //ademas de sacar el abs , te parsea a num si pasas un string  
  const skip = (page - 1) * limit;                          // y si pasas un string que no tiene numeros da NaN, osea un falsy y va por el default

  return {
    skip,
    limit
  };
}

module.exports = {
  getPagination
}