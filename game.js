const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

board_contents = Array.from({ length: 9 }, (_, index) => new Board(Array.from({ length: 9 }, (_, index) => new Board(Array.from({ length: 9 }, (_, index) => new Cell())))));

const board = new Board(board_contents);

board.setAllowedBoard([[1, 1]]);

let turn = "X";

function writeTurnStatus() {
    ctx.font = "30px Arial";
    ctx.fillStyle = '#000000';

    const metrics = ctx.measureText(`${turn}'s turn`);
    const textWidth = metrics.width;
    // measure the text height by adding the farthest distance above and below the central line of the text
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    ctx.fillText(`${turn}'s turn`, (canvas.width - textWidth) / 2, textHeight);
}

function updateTurn() {
    turn = turn === "X" ? "O" : "X";
}

function draw(cursorX, cursorY) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  board.draw(ctx, 0, 0, 750, cursorX, cursorY, turn === "X" ? xHighlight : oHighlight);
  writeTurnStatus();
}

document.addEventListener('mousemove', (event) => {
  const [x, y] = getMousePosOnCanvas(canvas, event);

  draw(x, y);
});

document.addEventListener('click', (event) => {
    const [x, y] = getMousePosOnCanvas(canvas, event);
    const result = board.click(x, y, turn, turn === "X" ? xColor : oColor);
    if (result) {
        updateTurn();
        draw();
        result.shift();
        board.setAllowedBoard(result);
    }
});
