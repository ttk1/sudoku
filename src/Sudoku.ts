export class Sudoku {
  private field: number[][];

  constructor() {
    this.reset();
  }

  public set(i: number, j: number, value: number): boolean {
    if (this.check(i, j, value)) {
      this.field[i][j] = value;
      return true;
    } else {
      return false;
    }
  }

  public get(i: number, j: number) {
    return this.field[i][j];
  }

  public reset() {
    this.field = [];
    for (let i = 0; i < 9; i++) {
      this.field[i] = [];
      for (let j = 0; j < 9; j++) {
        this.field[i][j] = null;
      }
    }
  }

  private check(i: number, j: number, value: number): boolean {
    // 列
    for (let k = 0; k < 9; k++) {
      if (k === i) {
        continue;
      }
      if (this.field[k][j] === value) {
        return false;
      }
    }

    // 行
    for (let k = 0; k < 9; k++) {
      if (k === j) {
        continue;
      }
      if (this.field[i][k] === value) {
        return false;
      }
    }

    // block
    for (let k = 0; k < 9; k++) {
      if (Math.floor(k / 3) === i % 3 && k % 3 === j % 3) {
        continue;
      }
      if (this.field[i - i % 3 + Math.floor(k / 3)][j - j % 3 + k % 3] === value) {
        return false;
      }
    }

    return true;
  }

  /*
  public solve() {
  }

  public load(path: string) {
  }
  */

  public print() {
    console.log('    0 1 2   3 4 5   6 7 8');
    console.log('  ┌───────┬───────┬───────┐');
    for (let i = 0; i < 9; i++) {
      if (i === 3 || i === 6) {
        console.log('  ├───────┼───────┼───────┤');
      }
      let line = String(i) + ' │';
      for (let j = 0; j < 9; j++) {
        if (j === 3 || j === 6) {
          line += ' │';
        }
        if (this.field[i][j] == null) {
          line += ' -';
        } else {
          line += ' ' + String(this.field[i][j]);
        }
      }
      line += ' │';
      console.log(line);
    }
    console.log('  └───────┴───────┴───────┘');
  }
}
