function drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function getRectCollision(cursorX, cursorY, rect) {
    return cursorX >= rect.left && cursorX <= rect.right && cursorY >= rect.top && cursorY <= rect.bottom;
}

function getMousePosOnCanvas(canvas, event) {
    return [event.clientX - canvas.getBoundingClientRect().left, event.clientY - canvas.getBoundingClientRect().top];
}
