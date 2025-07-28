const snakeCanvas = document.querySelector('#snakeCanvas')
const scorDisplay = document.querySelector('#scoreDisplay')
const gameStatus = document.querySelector('#gameStatus')
const ctx = snakeCanvas.getContext('2d');

const upBtn = document.querySelector('#upBtn')
const downBtn = document.querySelector('#downBtn')
const rightBtn = document.querySelector('#rightBtn')
const leftBtn = document.querySelector('#leftBtn')
const restartGameBtn = document.querySelector('#restartBtn')
const changeColorBtn = document.querySelector('#changeColorBtn')

const gridSize = 15
let snake = [{x: 10, y : 10}]
let food = {}
let direction = ''
let scor = 0
let gameInterval = null
let gameSpeed = 50
let gameIsOver = false

const themes = [
    { // Tema Default (warna asli)
        name: 'default',
        snakeColor: '#8BC34A', // Warna ular
        snakeStrokeColor: '#689F38', // Warna garis tepi ular
        foodColor: '#3C3A38', // Warna makanan
        bodyClass: '' // Tidak ada kelas CSS khusus untuk tema default
    },
    { // Tema Biru
        name: 'blue',
        snakeColor: '#00BFFF', // SkyBlue
        snakeStrokeColor: '#1E90FF', // DodgerBlue
        foodColor: '#FFD700', // Gold
        bodyClass: 'blue' // Kelas CSS baru untuk tema biru
    },
   { // Tema Cream
        name: 'cream',
        snakeColor: '#6F4F28',       // Ular coklat tua (tetap)
        snakeStrokeColor: '#4A2C2A', // Garis tepi ular lebih gelap (tetap)
        foodColor: '#FF6347',       // Makanan: Warna merah terang (Tomato) agar kontras dengan krem/coklat
        bodyClass: 'cream-theme'
    },
    { // Tema Dark Brown
        name: 'dark-brown',
        snakeColor: '#F5E8C7',       // Ular krem (tetap)
        snakeStrokeColor: '#E0C9A6', // Garis tepi ular sedikit gelap (tetap)
        foodColor: '#32CD32',       // Makanan: Warna hijau cerah (LimeGreen) agar kontras dengan coklat tua/krem
        bodyClass: 'dark-brown-theme'
    }
];

let currentThemeIndex = 0; // Mulai dari tema default

function draw(){
    ctx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height)

    const activeTheme = themes[currentThemeIndex]

    ctx.fillStyle = activeTheme.foodColor
    ctx.fillRect(food.x*gridSize, food.y*gridSize,gridSize,gridSize)
    ctx.fillStyle = activeTheme.snakeColor
    ctx.lineWidth = 5
    snake.forEach(segment =>{
        ctx.fillRect(segment.x*gridSize, segment.y *gridSize, gridSize,gridSize )
        ctx.strokeStyle = activeTheme.snakeStrokeColor
        ctx.strokeRect(segment.x*gridSize, segment.y*gridSize, gridSize,gridSize)
    })
}
function update(){
    if(gameIsOver || direction === ''){
        return
    }
    const head = { x: snake[0].x, y:snake[0].y}
    //memindahkan kepala sesuai arah
    switch (direction) {
        case 'up' : head.y--; break
        case 'down': head.y++;break;
        case 'left': head.x--; break
        case 'right' : head.x++; break
    }

    if(
        head.x< 0 || head.x >= snakeCanvas.width / gridSize ||
        head.y< 0 || head.y >= snakeCanvas.height / gridSize
    ){
        gameOver()
        return
    }

    for (let i = 1; i < snake.length ; i++){
        if(head.x === snake [i].x && head.y === snake[i].y){
            gameOver()
            return
        }
    }

    snake.unshift(head)

    if( head.x === food.x && head.y == food.y){
        scor++
        scorDisplay.textContent = scor;
        generateFood()
        if(scor % 5 ===0 && gameSpeed >30){
            gameSpeed -= 10
            clearInterval(gameInterval)
            gameInterval = setInterval(update, gameSpeed,)
        }
    } else{
        snake.pop()

  }
  draw()  
}

function generateFood(){
    let newFoodPlace
    let collision
    do{
        newFoodPlace={
            x: Math.floor(Math.random()*(snakeCanvas.width/ gridSize)),
            y: Math.floor(Math.random()*(snakeCanvas.height/ gridSize))
        }
        collision = snake.some(segment=> segment.x === newFoodPlace.x && segment.y === newFoodPlace.y )
    } while(collision)
        food = newFoodPlace
}
function gameOver(){
    gameIsOver= true
    clearInterval(gameInterval)
    gameInterval= null
    gameStatus.textContent = `Game Over! Skor akhirmu adalah ${scor}`
    restartGameBtn.style.display ='block'
}

function startGame(){
    snake = [{x : Math.floor(snakeCanvas.width/ (2*gridSize)), y : Math.floor(snakeCanvas.height/(2*gridSize))}]
    direction = ''
    scor = 0
    scorDisplay.textContent = scor
    gameSpeed= 150
    gameIsOver = false
    gameStatus.textContent = `Tekan tombol panah atau kontrol untuk memulai`
    restartGameBtn.style.display = 'none'
    generateFood()
    draw()
    clearInterval(gameInterval)
    gameInterval = null
}
function ensureGameLoopStarted(){
    if(!gameInterval && !gameIsOver && direction !== ''){
        gameInterval = setInterval(update, gameSpeed)
        gameStatus.textContent = `Bermain...`
    }
}
document.addEventListener('keydown', e =>{
    if(gameIsOver && e.key !== 'Enter') return
    if(e.key === 'Enter' && gameIsOver){
        startGame()
        return
    }
    let newDirection = direction 
    switch(e.key){
        case 'ArrowUp' : if(direction !== 'down') newDirection = 'up' ; break
        case 'ArrowDown': if(direction !== 'up') newDirection = 'down' ; break
        case 'ArrowLeft': if(direction !== 'right') newDirection = 'left' ; break
        case 'ArrowRight' : if(direction !== 'left') newDirection = 'right' ; break
        default : return
    }
    if(newDirection !== direction){
        direction = newDirection
        ensureGameLoopStarted()
    }
})

upBtn.addEventListener('click', () => {if(direction !== 'down')direction = 'up'; ensureGameLoopStarted();})
downBtn.addEventListener('click', () => {if(direction !== 'up') direction = 'down'; ensureGameLoopStarted();})
leftBtn.addEventListener('click', () => {if(direction !== 'right') direction = 'left'; ensureGameLoopStarted();})
rightBtn.addEventListener('click', () => {if(direction !== 'left') direction = 'right'; ensureGameLoopStarted();})

restartGameBtn.addEventListener('click', startGame)

changeColorBtn.addEventListener('click', () =>{
    if(themes[currentThemeIndex].bodyClass){
        document.body.classList.remove(themes[currentThemeIndex].bodyClass)
    }
    currentThemeIndex = (currentThemeIndex +1) % themes.length

    if(themes[currentThemeIndex].bodyClass){
        document.body.classList.add(themes[currentThemeIndex].bodyClass)   
    }
    draw()
})

startGame();