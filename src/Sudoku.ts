import fs = require('fs');

// Fisher–Yates shuffle
function shuffle<A>(a: A[]) {
  for (let i = a.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
}

export class Sudoku {
  private field: number[][];

  constructor() {
    this.reset();
  }

  public set(i: number, j: number, value: number) {
    if (value == null || this.getCandidates(i, j).includes(value)) {
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

  private lock() {
    throw new Error('未実装やで！');
  }

  public solve() {
    const c: { i: number; j: number; candidates: number[] }[] = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.get(i, j) == null) {
          c.push({ i: i, j: j, candidates: this.getCandidates(i, j) });
        }
      }
    }

    if (c.length === 0) {
      return true;
    }

    c.sort((a, b) => {
      return a.candidates.length - b.candidates.length;
    });

    const orig = this.get(c[0].i, c[0].j);
    for (const value of c[0].candidates) {
      this.set(c[0].i, c[0].j, value);
      if (this.solve()) {
        return true;
      }
    }
    this.set(c[0].i, c[0].j, orig);
    return false;
  }

  private getNumberOfSolutions(limit: number) {
    const c: { i: number; j: number; candidates: number[] }[] = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.get(i, j) == null) {
          c.push({ i: i, j: j, candidates: this.getCandidates(i, j) });
        }
      }
    }

    if (c.length === 0) {
      return 1;
    }

    c.sort((a, b) => {
      return a.candidates.length - b.candidates.length;
    });

    const orig = this.get(c[0].i, c[0].j);
    let count = 0;
    for (const value of c[0].candidates) {
      this.set(c[0].i, c[0].j, value);
      count += this.getNumberOfSolutions(limit - count);
      if (count >= limit) {
        break;
      }
    }
    this.set(c[0].i, c[0].j, orig);
    return count;
  }

  // ランダムに盤面を生成
  // オプションで難易度設定とかも実装したい
  public random() {
    this.reset();
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.get(i, j) == null) {
          const candidates = this.getCandidates(i, j);
          shuffle(candidates);
          for (const value of candidates) {
            this.set(i, j, value);
            if (this.getNumberOfSolutions(1) > 0) {
              break;
            }
          }
        }
      }
    }
    // あとで書き直す
    for (let k = 0; k < 200; k++) {
      const i = Math.floor(Math.random() * 9);
      const j = Math.floor(Math.random() * 9);
      const orig = this.get(i, j);
      this.set(i, j, null);
      if (this.getNumberOfSolutions(2) === 2) {
        this.set(i, j, orig);
      }
    }
  }

  public load(path: string) {
    this.reset();
    const s = fs.readFileSync(path, 'utf8');
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

  public save(path: string) {
    let data = '';
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.get(i, j) == null) {
          data += '-';
        } else {
          data += String(this.get(i, j));
        }
        if (j < 8) {
          data += ' ';
        }
      }
      if (i < 8) {
        data += '\n';
      }
    }
    fs.writeFileSync(path, data, 'utf8');
  }

  public copy() {
    const copied = new Sudoku();
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        copied.set(i, j, this.get(i, j));
      }
    }
    return copied;
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
