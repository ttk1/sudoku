import { Sudoku } from './Sudoku';

const sudoku = new Sudoku();

sudoku.random();
sudoku.print();

sudoku.solve();
sudoku.print();
