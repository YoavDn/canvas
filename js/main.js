'use strict'

var gCanvas
var gCtx
var gCurrColor
var gSettings = {
  bg: '#FFFFFF',
  color: '#3A3335',
  shape: 'pen',
  isUploading: false,
  isDrawing: false,
}
var lastX
var lastY

const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function init() {
  gCanvas = document.getElementById('canvas')
  gCtx = gCanvas.getContext('2d')

  gCanvas.width = window.innerWidth
  gCanvas.height = window.innerHeight

  document.addEventListener('ontouchstart', function (ev) {
    e.preventDefault()
  })

  changeBg()

  gCanvas.addEventListener('mousedown', onMouseDown)
  gCanvas.addEventListener('mouseup', onMouseUp)
  gCanvas.addEventListener('mousemove', onMouseMove)

  //handle touch events

  function line(fromX, fromY, toX, toY) {
    gCtx.beginPath()
    gCtx.moveTo(fromX, fromY)
    gCtx.lineTo(toX, toY)
    gCtx.stroke()
    gCtx.closePath()
  }

  gCanvas.ontouchstart = function (event) {
    event.preventDefault()
    lastX = event.touches[0].clientX
    lastY = event.touches[0].clientY
  }

  gCanvas.ontouchmove = function (event) {
    event.preventDefault()
    if (gSettings.shape !== 'pen') {
      draw(event)
    } else {
      var newx = event.touches[0].clientX
      var newy = event.touches[0].clientY

      line(lastX, lastY, newx, newy)

      lastX = newx
      lastY = newy
    }
  }
}

function onMouseDown() {
  gSettings.isDrawing = true
  gCtx.beginPath()
}
function onMouseMove(e) {
  if (!gSettings.isDrawing) return

  const { x, y } = getMousePosition(e)

  if (gSettings.shape === 'pen') {
    gCtx.lineWidth = 3
    gCtx.strokeStyle = gSettings.color
    gCtx.lineCap = 'round'
    gCtx.lineTo(x, y)
    gCtx.stroke()
    gCtx.moveTo(x, y)
  } else {
    draw(e)
  }
}
function onMouseUp() {
  gSettings.isDrawing = false
  gCtx.closePath()
}

function draw(e) {
  if (gTouchEvs.includes(e.type)) {
    var x = e.touches[0].clientX
    var y = e.touches[0].clientY

    drawShape(x, y)
  } else {
    const { offsetX, offsetY } = e
    drawShape(offsetX, offsetY)
  }
}

function drawShape(x, y) {
  gCtx.fillStyle = gSettings.color

  if (gSettings.shape === 'square') {
    gCtx.fillRect(x, y, getRandomInt(30, 80), getRandomInt(30, 80))
  } else if (gSettings.shape === 'circle') {
    drawCircle(x, y)
  } else if (gSettings.shape === 'triangle') {
    drawTriangle(x, y)
  }
}

function getCanvasSettings(e) {
  e.preventDefault()
  if (e.target.type === 'color') {
    gSettings[e.target.name] = e.target.value
  } else {
    gSettings.shape = e.target.value
  }
  changeBg()
}

function downloadImg() {
  var download = document.getElementById('download')
  var img = gCanvas.toDataURL('image/png')

  download.setAttribute('href', img)
}

function changeBg() {
  gCanvas.style.backgroundColor = gSettings.bg
}

function handleImg(e) {
  var reader = new FileReader()
  reader.onload = function (event) {
    var img = new Image()
    img.onload = function () {
      //   gCanvas.width = img.width
      //   gCanvas.height = img.height

      gCanvas.addEventListener('click', e => {
        if (!gSettings.isUploading) return
        const { offsetX, offsetY } = e

        gCtx.drawImage(img, offsetX, offsetY)
        gSettings.isUploading = false
      })
    }
    img.src = event.target.result
  }
  reader.readAsDataURL(e.target.files[0])
}

function drawCircle(x, y) {
  gCtx.beginPath()
  gCtx.arc(x, y, Math.abs(getRandomInt(10, 40)), 0, 2 * Math.PI)
  gCtx.closePath()
  gCtx.fill()
}

function drawTriangle(x, y) {
  gCtx.beginPath()
  gCtx.moveTo(x, y)
  gCtx.lineTo(x, y + getRandomInt(10, 40))
  gCtx.lineTo(x + getRandomInt(10, 49), y + getRandomInt(10, 60))
  gCtx.closePath()
  gCtx.fill()
}

function setUploading() {
  gSettings.isUploading = true
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  const chance = Math.random() > 0.5
  const rendom = Math.floor(Math.random() * (max - min) + min)
  return chance ? rendom * -1 : rendom //The maximum is exclusive and the minimum is inclusive
}

function getMousePosition(e) {
  var mouseX = ((e.offsetX * gCanvas.width) / gCanvas.clientWidth) | 0
  var mouseY = ((e.offsetY * gCanvas.height) / gCanvas.clientHeight) | 0
  return { x: mouseX, y: mouseY }
}
