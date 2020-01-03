export class Sudoku {
  private field: number[][];

  constructor() {
    this.reset();
  }

  public set(i: number, j: number, value: number): boolean {
    const tmp = this.field[i][j];
    this.field[i][j] = value;
    if (this.check(i, j)) {
      return true;
    } else {
      this.field[i][j] = tmp;
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

  private check(i: number, j: number): boolean {
    // 行のチェック
    const s = new Set();
    for (let k = 0; k < 9; k++) {
      const value = this.field[i][k];
      if (value == null) {
        continue;
      } else if (s.has(value)) {
        return false;
      } else {
        s.add(value);
      }
    }

    // 列のチェック
    s.clear();
    for (let k = 0; k < 9; k++) {
      const value = this.field[k][j];
      if (value == null) {
        continue;
      } else if (s.has(value)) {
        return false;
      } else {
        s.add(value);
      }
    }

    // グループのチェック
    s.clear();
    i -= i % 3;
    j -= j % 3;
    for (let k = 0; k < 9; k++) {
      const value = this.field[i + Math.floor(k / 3)][j + k % 3];
      if (value == null) {
        continue;
      } else if (s.has(value)) {
        return false;
      } else {
        s.add(value);
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
