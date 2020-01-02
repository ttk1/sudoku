import { Sudoku } from './Sudoku';

const sudoku = new Sudoku();

console.log(sudoku.set(6, 7, 8));
console.log(sudoku.set(7, 8, 8));
console.log(sudoku.set(8, 7, 6));

sudoku.print();
