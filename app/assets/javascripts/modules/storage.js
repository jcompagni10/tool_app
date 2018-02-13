class Storage {
  static save(type, name, value) {
    if (type === "sessionStorage") {
      sessionStorage.setItem(name, JSON.stringify(value));
    }
  }
}
