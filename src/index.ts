import { setupGrid } from './grid-generator';

window.addEventListener("load", () => main());

function main() {
  let grid = document.getElementById("grid") as HTMLElement;
  setupGrid(grid);  
}
