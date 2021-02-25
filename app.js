document.addEventListener("DOMContentLoaded", () => {
  const width = 10;
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  let nextRandom = 0;
  let setTimer
  let score = 0;

  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

   const zTetromino = [
     [0, width, width + 1, width * 2 + 1],
     [width + 1, width + 2, width * 2, width * 2 + 1],
     [0, width, width + 1, width * 2 + 1],
     [width + 1, width + 2, width * 2, width * 2 + 1],
   ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const fiveTetromino = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;
  let random = Math.floor(Math.random() * fiveTetromino.length);
  let current = fiveTetromino[random][0];

  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
    });
  }

  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
    });
  }

//   setTimer = setInterval(moveDown, 500);

  function controls(e){
      if(e.keyCode === 37){
          moveLeft();
      } else if(e.keyCode === 38){
          rotate();
      } else if(e.keyCode === 39){
          moveRight();
      } else if(e.keyCode === 40){
          moveDown();
      }
  }

  document.addEventListener('keyup', controls)

  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    stop();
  }

  function stop() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * fiveTetromino.length);
      current = fiveTetromino[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  function moveLeft(){
    undraw();

    const isAtTheLeftEdge = 
        current.some(index => (currentPosition + index) % width === 0);

    if(!isAtTheLeftEdge) currentPosition -= 1;

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1;
    }

    draw();
  }

  function moveRight(){
    undraw();

    const isAtTheRightEdge =
        current.some(index => (currentPosition + index) % width === width -1);

    if (!isAtTheRightEdge) currentPosition += 1;

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition -= 1;
    }

    draw();
  }

  function rotate(){
      undraw();

      currentRotation ++;

      if(currentRotation === current.length){
          currentRotation = 0;
      }

      current = fiveTetromino[random][currentRotation];

      draw();
  }

  const displaySquares = document.querySelectorAll('.mini-grid div');
  const displayWidth = 4;
  let displayIndex = 0;

  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], 
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2], 
    [0, 1, displayWidth, displayWidth + 1], 
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], 
  ];

  function displayShape(){
      displaySquares.forEach(square => {
          square.classList.remove('tetromino')
      })
      upNextTetrominoes[nextRandom].forEach(index => {
          displaySquares[displayIndex+index].classList.add('tetromino')
      })
  }

  startBtn.addEventListener('click', ()=>{
      if(setTimer) {
          clearInterval(setTimer)
          setTimer = null
      }else{
          draw()
          setTimer = setInterval(moveDown,500)
          nextRandom = Math.floor(Math.random()*fiveTetromino.length)
          displayShape()
      }
  })

  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  function gameOver(){
      if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
          scoreDisplay.innerHTML = 'end'
          clearInterval(setTimer)
      }
  }
});