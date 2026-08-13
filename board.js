const boardPadding = 0.05;

class Box {
    constructor() {
        this.hoverRect = null;
    }

    setHoverRect(x, y, size) {
        this.hoverRect = new DOMRectReadOnly(x, y, size, size);
    }
}

class Cell extends Box {
    constructor(value = "") {
        super();
        this.value = value;
    }

    click(value) {
        if (!this.value) {
            this.value = value;
            return [];
        } else {
            return undefined;
        }
    }

    /**
     * Draw the Tic-Tac-Toe cell letter.
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {number} x - The left boundary of the grid.
     * @param {number} y - The top boundary of the grid.
     * @param {number} size - The size of the cell (length of side).
     * @param {boolean} highlight - Whether to highlight the cell (for hover effect).
     */

    draw(ctx, x, y, size, highlight = false) {
        ctx.strokeStyle = '#007bff';
        ctx.lineWidth = 5;

        switch (this.value) {
            case "X":
                drawLine(ctx, x + 0.1*size, y + 0.1*size, x + 0.9*size, y + 0.9*size);
                drawLine(ctx, x + 0.9*size, y + 0.1*size, x + 0.1*size, y + 0.9*size);
                break;
            case "O":
                drawCircle(ctx, x + 0.5*size, y + 0.5*size, 0.4*size);
                break;
            case "":
                break;
            default:
                console.warn(`Unknown cell value: ${this.value}`);
                break;
        }

        if (!this.value && highlight) {
            ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
            ctx.fillRect(this.hoverRect.left, this.hoverRect.top, this.hoverRect.width, this.hoverRect.height);
        }
    }
}

class Board extends Box {
    constructor(contents) {
        super();
        this.contents = contents;
        this.allowedBoard = undefined;
    }

    /**
     * Gets the cell at the specified coordinates (zero-based, +x to the right, y down).
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @return {number} The value of the cell at the specified coordinates.
     */

    cellAt(x, y) {
        return this.contents[y*3 + x];
    }

    clearAllowedBoard() {
        this.allowedBoard = undefined;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = this.cellAt(i, j);
                if (cell instanceof Board) {
                    cell.clearAllowedBoard();
                }
            }
        }
    }

    /**
     * Set which board the user is allowed to play in.
     * @param {Array} posList - The list of positions (each position in the list is a level deeper than the last).
     */

    setAllowedBoard(posList) {
        const pos = posList.shift();
        const cell = this.cellAt(pos[0], pos[1]);
        if (posList.length !== 0) {
            cell.setAllowedBoard(posList);
        }
        this.allowedBoard = pos;
    }

    /**
     * Inform the board of a click at the specified coordinates (zero-based, +x to the right, y down).
     * This will set the value of the cell at the specified coordinates to the specified value.
     * @param {number} mouseX - The x-coordinate.
     * @param {number} mouseY - The y-coordinate.
     * @param {string} value - The value to set the cell to.
     * @returns {Array | boolean} True if the cell was set, false if the cell was already set or the click was outside the board.
     */

    click(mouseX, mouseY, value) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                console.log(this.allowedBoard);
                if (this.allowedBoard && (this.allowedBoard[0] !== i || this.allowedBoard[1] !== j)) {
                    continue;
                }
                const cell = this.cellAt(i, j);
                if (getRectCollision(mouseX, mouseY, cell.hoverRect)) {
                    if (cell instanceof Cell) {
                        return cell.click(value) ? [[i, j]] : false;
                    } else {
                        const result = cell.click(mouseX, mouseY, value)
                        return result ? [[i, j], ...result] : false;
                    }
                }
            }
        }
        return false;
    }

     /**
     * Draw the Tic-Tac-Toe grid (will not pad automatically).
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {number} left - The left boundary of the grid.
     * @param {number} right - The right boundary of the grid.
     * @param {number} top - The top boundary of the grid.
     * @param {number} bottom - The bottom boundary of the grid.
     */

    drawGrid(ctx, left, right, top, bottom) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        const cellSize = (right - left) / 3;

        // Draw vertical lines
        drawLine(ctx, left + cellSize, top, left + cellSize, bottom);
        drawLine(ctx, left + 2*cellSize, top, left + 2*cellSize, bottom);

        // Draw horizontal lines
        drawLine(ctx, left, top + cellSize, right, top + cellSize);
        drawLine(ctx, left, top + 2*cellSize, right, top + 2*cellSize);
    }

     /**
     * Draw the Tic-Tac-Toe board and its contents. This will automatically pad the board by 5% of the size on all sides.
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {number} x - The left boundary of the grid.
     * @param {number} y - The top boundary of the grid.
     * @param {number} size - The size of the grid.
     * @param {number} mouseX - The x-coordinate of the mouse (for hover highlight).
     * @param {number} mouseY - The y-coordinate of the mouse (for hover highlight).
     */

    draw(ctx, x, y, size, mouseX = -1, mouseY = -1) {
        const cellSize = (size / 3) *(1 - 2*boardPadding);

        const left = x + size*boardPadding;
        const right = x + size*(1 - boardPadding);
        const top = y + size*boardPadding;
        const bottom = y + size*(1 - boardPadding);

        this.drawGrid(ctx, left, right, top, bottom);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = this.cellAt(i, j);
                if (!cell.hoverRect) {
                    cell.setHoverRect(left + i*cellSize, top + j*cellSize, cellSize);
                }

                if (cell instanceof Cell) {
                    cell.draw(ctx, left + i*cellSize, top + j*cellSize, cellSize, getRectCollision(mouseX, mouseY, cell.hoverRect));
                } else {
                    const passHighlight = !this.allowedBoard || (this.allowedBoard[0] === i && this.allowedBoard[1] === j);
                    cell.draw(ctx, left + i*cellSize, top + j*cellSize, cellSize, passHighlight ? mouseX : -1, passHighlight ? mouseY : -1);
                    if (this.allowedBoard && this.allowedBoard[0] === i && this.allowedBoard[1] === j && !cell.allowedBoard) {
                        // All of the allowed moves are within this board, box it so the user knows what's going on
                        ctx.strokeStyle = "orange";
                        ctx.lineWidth = 3;
                        ctx.strokeRect(left + i*cellSize, top + j*cellSize, cellSize, cellSize);
                    }
                }
            }
        }
    }
}
