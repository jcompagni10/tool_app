var cartModule = (function() {
  var cart = [];
  var cart_proxy = new Proxy(cart, {
    set: function(target, property, value) {
      $("#total").text(getTotal()) // opportunity: may run more than once, since some methods like push do a set value and a length (i.e., cart[0] = new_value, cart.length = 1), but if I were to ennumerate all the times I DIDN't want this to run, I'd have hte same kind of issue about enumerating properties being a drag. Best thing is probably to wait until we implement a framework to modify this
      target[property] = value // default action to pass into cart
      return true // always return true so that whatever is called just gets passed through
    }
  })

  function getTotal() { return cart.reduce((sum,object) => sum + object.price, 0); }
  
  return {
    initialize: function(default_item_name) {
      storedCart = JSON.parse(sessionStorage.getItem("cart"));
      if (storedCart && storedCart.length > 0) {
        length = storedCart.length;
        for (i = 0; i < length; i++) { 
          this.toggleItem(storedCart[i].name, true)
          // could straight set cart = storedCart, but if we did that, we'd have to set cart_proxy here, which still wouldn't trigger setter methods, and generally we want to keep cart & cart_proxy in closure
          if (storedCart[i].name !== "toolkit") { this.showDOM(storedCart[i]) }
        }
      } else { 
        if (Item.isValid(default_item_name)) { 
          this.toggleItem(default_item_name, true) 
        }
      }
    },
    showDOM: function(item) {
      $(".toggle_item[data-name='"+item.name+"']").prop("checked", true)
      if (item.name === "delivery") {
        // having the below in a separate method would be a little more SRP and somewhat easier for testing, we can just test that the separate method was called. HOWEVER to do this test, we'd have to make it a public method, which inherently it really shouldn't be. In this case, do not believe the slightly easier testing justifies making an additional public/private method combo, so keeping it here
        for (attribute in item) {
          $("#" + attribute).val(item[attribute]);             
        }
      }
    },
    toggleItem: function(item_name, value) {
      if (item_name == "delivery") { elementVisAndNav.deliverySection(value) } 
      if (value && this.isUnique(item_name)) {
        cart_proxy.push(new Item(item_name)); 
      } else {
        index = cart_proxy.findIndex(object => object.name === item_name);
        if (index > -1) { cart_proxy.splice(index, 1) }
      }
    },
    getTotal: getTotal,
    getItems: function() { 
      return cart.map( object => object.name ); 
    },
    isUnique: function(item_name) {      
      return this.getItems().indexOf(item_name) === -1
    },
    isValid: function() {
      return (this.hasDelivery() ? cart.length > 1 : cart.length > 0)
    },
    hasDelivery: function() {
      return this.getItems().indexOf("delivery") > -1
    },
    save: function() { 
      if (cart.length) { Storage.save("sessionStorage", "cart", cart) }
    },

    // below is purely for spec purposes, because proxy doesn't run in, please see cart_module_spec.js for more info on why
    getProxyTotal: function() {
      return cart_proxy.reduce((sum,object) => sum + object.price, 0);
    },
    getProxyItems: function() { 
      return cart_proxy.map( object => object.name )
    },
    isProxyUnique: function(item_name) {
      return this.getProxyItems().indexOf(item_name) === -1
    },
    isProxyValid: function() {
      return (this.hasProxyDelivery() ? cart_proxy.length > 1 : cart_proxy.length > 0)
    },
    hasProxyDelivery: function() {
      return this.getProxyItems().indexOf("delivery") > -1
    },
    saveProxy: function() {
      if (cart_proxy.length) { Storage.save("sessionStorage", "cart", cart_proxy) }
    },

    clear: function() {
      cart = [];
      cart_proxy = [];
    },
    showadmin: function() {
      return cart
    },
  }
})();