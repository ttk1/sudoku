import { Sudoku } from './Sudoku';

const sudoku = new Sudoku();

sudoku.load('./problems/01.txt');
sudoku.print();

sudoku.solve();
sudoku.print();
