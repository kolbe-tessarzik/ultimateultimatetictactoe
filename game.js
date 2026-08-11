const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const canvasRect = canvas.getBoundingClientRect();

board_contents = Array.from({ length: 9 }, (_, index) => new Board(Array.from({ length: 9 }, (_, index) => new Cell())));

const board = new Board(board_contents);

document.addEventListener("DOMContentLoaded", () => {
});


function getMousePosOnCanvas(event) {
    return [event.clientX - canvasRect.left, event.clientY - canvasRect.top];
}
document.addEventListener('mousemove', (event) => {
  const [x, y] = getMousePosOnCanvas(event);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  board.draw(ctx, 0, 0, 750, x, y);
});

document.addEventListener('click', (event) => {
    const [x, y] = getMousePosOnCanvas(event);
    board.click(x, y, "X");
});
