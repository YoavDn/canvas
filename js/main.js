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

function init() {
  gCanvas = document.getElementById('canvas')
  gCtx = gCanvas.getContext('2d')

  gCanvas.width = window.innerWidth
  gCanvas.height = window.innerHeight

  changeBg()
  gCanvas.addEventListener('mousedown', onMouseDown)
  gCanvas.addEventListener('mouseup', onMouseUp)
  gCanvas.addEventListener('mousemove', onMouseMove)
  gCanvas.addEventListener('touchstart', onMouseDown)
  gCanvas.addEventListener('touchend', onMouseUp)
  gCanvas.addEventListener('touchend', onMouseMove)
}

function onMouseDown() {
  gSettings.isDrawing = true
  gCtx.beginPath()
}
function onMouseMove(e) {
  if (!gSettings.isDrawing) return

  if (gSettings.shape === 'pen') {
    gCtx.lineWidth = 4
    gCtx.strokeStyle = gSettings.color
    gCtx.lineCap = 'round'
    gCtx.lineTo(e.offsetX, e.offsetY)
    gCtx.stroke()
    gCtx.moveTo(e.offsetX, e.offsetY)
  } else {
    draw(e)
  }
}
function onMouseUp() {
  gSettings.isDrawing = false
  gCtx.closePath()
}

function draw(e) {
  const { offsetX, offsetY } = e
  drawShape(offsetX, offsetY)
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
  gCtx.arc(x, y, Math.abs(getRandomInt(20, 70)), 0, 2 * Math.PI)
  gCtx.closePath()
  gCtx.fill()
}

function drawTriangle(x, y) {
  gCtx.beginPath()
  gCtx.moveTo(x, y)
  gCtx.lineTo(x, y + getRandomInt(40, 100))
  gCtx.lineTo(x + getRandomInt(40, 100), y + getRandomInt(40, 100))
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
