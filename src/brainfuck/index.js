class BrainFuck {

  decode(input) {
    let sum = 0;
    for (let num of input) {
      if (num == '+') {
        sum++;
      }
    }
    return String.fromCharCode(sum);
  }

  static create() {
    return new BrainFuck();
  }

}

module.exports = BrainFuck;