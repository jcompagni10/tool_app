function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i-- ){
    let rand = Math.floor(Math.random() * (i+1));
    [arr[i], arr[rand]] =  [arr[rand], arr[i]];
  }
  return arr;
}