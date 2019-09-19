const canvas = document.getElementById("jsCanvas")
const ctx = canvas.getContext("2d")
const colors = document.getElementsByClassName("jsColor")
const range = document.getElementById("jsRange")
const mode = document.getElementById("jsMode")
const shape = document.getElementById("jsShape")
const saveBtn = document.getElementById("jsSave")

const INITIAL_COLOR = "#2c2c2c"
const CANVAS_SIZE = 700

canvas.width = CANVAS_SIZE
canvas.height = CANVAS_SIZE

const container = canvas.parentNode
const overlay = document.createElement("canvas")
const context = overlay.getContext("2d")
overlay.id = "overlay"
overlay.classList.add("canvas")
overlay.classList.add("overlayCanvas")
overlay.width = CANVAS_SIZE
overlay.height = CANVAS_SIZE
container.appendChild(overlay)

ctx.fillStyle = "white"
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
ctx.strokeStyle = INITIAL_COLOR
ctx.fillStyle = INITIAL_COLOR
ctx.lineWidth = 2.5

let painting = false
let filling = false
let shaping = false
let rectRange = {}

function drawImage() {
  ctx.drawImage(overlay, 0, 0)
  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
}

function startPainting() {
  painting = true
  drawImage()
}

function stopPainting() {
  painting = false
  rectRange = {}
}

function drawLine(x, y) {
  context.lineTo(x, y)
  context.stroke()
}

function drawRect(x, y) {
  if (!rectRange.x) {
    rectRange.x = x
    rectRange.y = y
  } else {
    context.clearRect(rectRange.x, rectRange.y, rectRange.w, rectRange.h)
  }
  rectRange.w = x - rectRange.x
  rectRange.h = y - rectRange.y
  if (filling) {
    context.fillRect(rectRange.x, rectRange.y, rectRange.w, rectRange.h)
  } else {
    context.strokeRect(rectRange.x, rectRange.y, rectRange.w, rectRange.h)
  }
}

function onMouseMove(event) {
  const x = event.offsetX
  const y = event.offsetY
  if (!painting) {
    context.beginPath()
    context.moveTo(x, y)
  } else {
    context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    if (!filling && !shaping) {
      drawLine(x, y)
    } else if (shaping) {
      drawRect(x, y)
    }
  }
}

function handleColorClick(event) {
  const color = event.target.style.backgroundColor
  context.strokeStyle = color
  context.fillStyle = color
}

function handleRangeChange(event) {
  const size = event.target.value
  context.lineWidth = size
}

function handleModeClick(event) {
  if (filling) {
    filling = false
    mode.innerText = "Fill"
  } else {
    filling = true
    mode.innerText = "Paint"
  }
}

function handleShapeClick(event) {
  if (shaping) {
    shaping = false
    shape.innerText = "Off"
  } else {
    shaping = true
    shape.innerText = "Rect"
  }
}

function handleCanvasClick(event) {
  if (filling && !shaping) {
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
}

function handleCM(event) {
  event.preventDefault()
}

function handleSaveClick(event) {
  const image = canvas.toDataURL()
  const link = document.createElement("a")
  link.href = image
  link.download = "PaintJS"
  link.click()
}

if (overlay) {
  overlay.addEventListener("mousemove", onMouseMove)
  overlay.addEventListener("mousedown", startPainting)
  overlay.addEventListener("mouseup", stopPainting)
  overlay.addEventListener("mouseleave", stopPainting)
  overlay.addEventListener("click", handleCanvasClick)
  overlay.addEventListener("contextmenu", handleCM)
}

if (colors) {
  Array.from(colors).forEach(color => color.addEventListener("click", handleColorClick))
}

if (range) {
  range.addEventListener("input", handleRangeChange)
}

if (mode) {
  mode.addEventListener("click", handleModeClick)
}

if (shape) {
  shape.addEventListener("click", handleShapeClick)
}

if (saveBtn) {
  saveBtn.addEventListener("click", handleSaveClick)
}
