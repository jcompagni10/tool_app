var itemPriceModule = (function() {
  return {
    toolkit:1500,
    ladder:1000,
    light:1000, 
    delivery:800
  }
})

class Item {
  constructor(item_name) {
    this.name = item_name
    this.price = itemPriceModule()[item_name]
  }
  
  static isValid(item_name) {
    return $.isNumeric(itemPriceModule()[item_name]);
  }
  
  static doThing(item){
    return true;
  }
}