import fs = require('fs');

export class Sudoku {
  private field: number[][];

  constructor() {
    this.reset();
  }

  public set(i: number, j: number, value: number) {
    if (value == null || this.check(i, j, value)) {
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

  private check(i: number, j: number, value: number) {
    for (let k = 0; k < 9; k++) {
      if (k === i) {
        continue;
      }
      if (this.get(k, j) === value) {
        return false;
      }
    }

    for (let k = 0; k < 9; k++) {
      if (k === j) {
        continue;
      }
      if (this.get(i, k) === value) {
        return false;
      }
    }

    for (let k = 0; k < 9; k++) {
      if (Math.floor(k / 3) === i % 3 && k % 3 === j % 3) {
        continue;
      }
      if (this.get(i - i % 3 + Math.floor(k / 3), j - j % 3 + k % 3) === value) {
        return false;
      }
    }

    return true;
  }

  private getCandidates(i: number, j: number) {
    const s = new Set();
    for (let k = 0; k < 9; k++) {
      if (k === i) {
        continue;
      }
      s.add(this.get(k, j));
    }

    for (let k = 0; k < 9; k++) {
      if (k === j) {
        continue;
      }
      s.add(this.get(i, k));
    }

    for (let k = 0; k < 9; k++) {
      if (Math.floor(k / 3) === i % 3 && k % 3 === j % 3) {
        continue;
      }
      s.add(this.get(i - i % 3 + Math.floor(k / 3), j - j % 3 + k % 3));
    }

    const candidates: number[] = [];
    for (let k = 1; k < 10; k++) {
      if (!s.has(k)) {
        candidates.push(k);
      }
    }
    return candidates;
  }

  public solve() {
    const f = () => {
      const c: { i: number; j: number; candidates: number[] }[] = [];
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (this.get(i, j) == null) {
            c.push({
              i: i,
              j: j,
              candidates: this.getCandidates(i, j)
            });
          }
        }
      }

      // cの長さが0なら、解けた
      if (c.length === 0) {
        return true;
      }

      // 候補の数が少ない順にソート
      c.sort((a, b) => {
        return a.candidates.length - b.candidates.length;
      });

      // 候補を順に試す
      const i = c[0].i;
      const j = c[0].j;
      const tmp = this.get(i, j);
      for (const value of c[0].candidates) {
        if (this.set(i, j, value) && f()) {
          return true;
        }
      }
      this.set(i, j, tmp);
      return false;
    };
    return f();
  }

  /*
  public lock() {
  }
  */

  public load(path: string) {
    const s = fs.readFileSync(path, 'utf-8');
    let i = 0;
    for (const l of s.split('\n')) {
      let j = 0;
      for (const c of l.split(' ')) {
        if (/^[1-9]$/.test(c)) {
          this.set(i, j, Number(c));
        }
        j++;
      }
      i++;
    }
  }

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
        if (this.get(i, j) == null) {
          line += ' -';
        } else {
          line += ' ' + String(this.get(i, j));
        }
      }
      line += ' │';
      console.log(line);
    }
    console.log('  └───────┴───────┴───────┘');
  }
}
