 function mapXY(data, x, y) {
    return data.map(d => [d[x], d[y]]);
  }


function guessDataType(column) {
  let type;
  
  let n = column.length;
  
  let numeric = column.filter((d)=>{isNaN(+d);});
  
  let numNumeric = numeric.length;
  
  let isNumeric = numNumeric/n > 0.7;
  
  let unique = new Set();
  
  column.forEach((d)=>{set.add(d);});
  
  let numUnique = unique.size;
  
  let isCategorical = numUnique > 10 || !isNumeric;
  
  
  
  
}