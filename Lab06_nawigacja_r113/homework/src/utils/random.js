export class Random {
  static choice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}
