import Matter from 'matter-js'

const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body, Sleeping } =
  Matter

/**
 * Shared geometry. The SVG bag artwork and the Matter.js walls both read from
 * these ratios, so the visuals and collision geometry can never drift apart.
 * Values are relative to the scene width / height.
 */
export const BAG_GEOMETRY = {
  left: 0.25,
  right: 0.75,
  top: 0.2083,
  floor: 0.8403,
  ground: 0.9583,
}

const COOKIE_CATEGORY = 0x0002
const WALL_CATEGORY = 0x0004

const MAX_SPEED = 26
const MAX_SPIN = 0.75

const COOKIE_PALETTES = [
  { base: '#c88a4e', light: '#e9bc82', edge: '#a26633', rim: '#7f4b22', chip: '#3a2114' },
  { base: '#6d4631', light: '#93654a', edge: '#4b2b1a', rim: '#341b10', chip: '#2a150d' },
  { base: '#a05048', light: '#c4756a', edge: '#7c332e', rim: '#5f2621', chip: '#f3e4cf' },
  { base: '#c99b5f', light: '#e9c591', edge: '#a1773f', rim: '#7f5a2c', chip: '#4f341d' },
  { base: '#d9bb8f', light: '#f2ddbc', edge: '#b39264', rim: '#8b6b45', chip: '#38271c' },
  { base: '#b4b17c', light: '#d8d5a8', edge: '#8d8b58', rim: '#6c6a40', chip: '#485735' },
  { base: '#b97a3f', light: '#dda56d', edge: '#8e5527', rim: '#6d3f1c', chip: '#3a2114' },
  { base: '#7c5239', light: '#9f704e', edge: '#553321', rim: '#3c2316', chip: '#2a150d' },
  { base: '#d7af6c', light: '#f0d69d', edge: '#b18a4b', rim: '#8b6938', chip: '#6a4929' },
  { base: '#b77b46', light: '#dba56f', edge: '#8f582b', rim: '#6c411f', chip: '#4a2c18' },
]

const mulberry32 = (seed) => {
  let value = seed
  return () => {
    value |= 0
    value = (value + 0x6d2b79f5) | 0
    let t = Math.imul(value ^ (value >>> 15), 1 | value)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const makeCookieArtwork = (seed, palette) => {
  const random = mulberry32(seed * 7919 + 13)
  const edge = Array.from({ length: 24 }, (_, index) => ({
    angle: (index / 24) * Math.PI * 2,
    scale: 0.955 + random() * 0.075,
  }))
  const chipCount = 7 + Math.floor(random() * 4)
  const chips = Array.from({ length: chipCount }, () => {
    const angle = random() * Math.PI * 2
    const distance = 0.12 + random() * 0.58
    const size = 0.09 + random() * 0.075
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rx: size,
      ry: size * (0.72 + random() * 0.35),
      rot: random() * Math.PI,
    }
  })
  const specks = Array.from({ length: 16 }, () => {
    const angle = random() * Math.PI * 2
    const distance = random() * 0.78
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      r: 0.012 + random() * 0.022,
      light: random() > 0.55,
    }
  })
  return { edge, chips, specks, palette }
}

const removeMouseListeners = (mouse, canvas) => {
  if (!mouse || !canvas) return
  canvas.removeEventListener('mousemove', mouse.mousemove)
  canvas.removeEventListener('mousedown', mouse.mousedown)
  canvas.removeEventListener('mouseup', mouse.mouseup)
  canvas.removeEventListener('wheel', mouse.mousewheel)
  canvas.removeEventListener('touchmove', mouse.mousemove)
  canvas.removeEventListener('touchstart', mouse.mousedown)
  canvas.removeEventListener('touchend', mouse.mouseup)
  Mouse.clearSourceEvents(mouse)
}

/**
 * Creates one Matter.js world, bound to a single canvas and container.
 *
 * Ownership is strict: Matter.js owns every cookie transform. The scene never
 * reads scroll progress, never releases bodies in waves and never accepts a
 * transform from GSAP. Cookies are spawned above the bag once, fall under
 * gravity, settle, and stay inside the pouch.
 */
export function createCookieScene({
  canvas,
  container,
  cookieCount = 12,
  reducedMotion = false,
  onGrabChange = () => {},
  onFirstGrab = () => {},
  onActivity = () => {},
}) {
  if (!canvas || !container) return null

  const context = canvas.getContext('2d')
  if (!context) return null

  const engine = Engine.create({
    enableSleeping: !reducedMotion,
    positionIterations: 8,
    velocityIterations: 6,
    constraintIterations: 3,
  })
  engine.gravity.y = 1.02
  const world = engine.world

  let width = 0
  let height = 0
  let dpr = 1
  let radius = 20
  let walls = []
  let cookies = []
  let runner = null
  let mouse = null
  let mouseConstraint = null
  let resizeObserver = null
  let resizeFrame = 0
  let destroyed = false
  let running = false
  let firstGrabFired = false
  let viewScale = 1
  let floorLayer = null
  let shadowSprite = null
  let lastActive = false
  let lastActivityAt = 0

  const bagPixels = () => ({
    left: width * BAG_GEOMETRY.left,
    right: width * BAG_GEOMETRY.right,
    top: height * BAG_GEOMETRY.top,
    floor: height * BAG_GEOMETRY.floor,
    ground: height * BAG_GEOMETRY.ground,
  })

  const setupCanvas = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.max(1, Math.round(width * dpr))
    canvas.height = Math.max(1, Math.round(height * dpr))
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.setAttribute('data-pixel-ratio', String(dpr))
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (mouse) mouse.pixelRatio = dpr
  }

  const makeWallOptions = (thickness) => ({
    isStatic: true,
    friction: 0.6,
    frictionStatic: 0.9,
    restitution: 0.02,
    collisionFilter: { category: WALL_CATEGORY },
    chamfer: { radius: Math.min(8, thickness / 2) },
    render: { visible: false },
  })

  const buildWalls = () => {
    const bag = bagPixels()
    const thickness = Math.max(12, width * 0.024)
    const innerWidth = bag.right - bag.left
    const wallHeight = bag.floor - bag.top
    const options = makeWallOptions(thickness)

    const leftWall = Bodies.rectangle(
      bag.left - thickness / 2,
      bag.top + wallHeight / 2,
      thickness,
      wallHeight,
      options,
    )
    const rightWall = Bodies.rectangle(
      bag.right + thickness / 2,
      bag.top + wallHeight / 2,
      thickness,
      wallHeight,
      options,
    )
    const bagFloor = Bodies.rectangle(
      (bag.left + bag.right) / 2,
      bag.floor + thickness / 2,
      innerWidth + thickness * 2,
      thickness,
      { ...options, friction: 0.85 },
    )
    const ground = Bodies.rectangle(
      width / 2,
      bag.ground + thickness / 2,
      width * 1.4,
      thickness,
      { ...options, friction: 0.95 },
    )
    const leftGuard = Bodies.rectangle(-thickness / 2, height / 2, thickness, height * 2, options)
    const rightGuard = Bodies.rectangle(
      width + thickness / 2,
      height / 2,
      thickness,
      height * 2,
      options,
    )

    // Long, invisible folded shoulders above the opening. They read as the
    // natural funnel of a paper bag and make it impossible for a released
    // cookie to come to rest outside the pouch.
    const funnelLength = Math.max(78, Math.min(innerWidth * 0.95, width * 0.26))
    const funnelAngle = 0.72
    const funnelThickness = Math.max(10, thickness * 0.72)
    const funnelOptions = {
      ...options,
      chamfer: { radius: 3 },
      friction: 0.35,
      restitution: 0.02,
    }

    const leftFunnel = Bodies.rectangle(
      bag.left - (Math.cos(funnelAngle) * funnelLength) / 2,
      bag.top - (Math.sin(funnelAngle) * funnelLength) / 2,
      funnelLength,
      funnelThickness,
      { ...funnelOptions, angle: funnelAngle },
    )
    const rightFunnel = Bodies.rectangle(
      bag.right + (Math.cos(funnelAngle) * funnelLength) / 2,
      bag.top - (Math.sin(funnelAngle) * funnelLength) / 2,
      funnelLength,
      funnelThickness,
      { ...funnelOptions, angle: -funnelAngle },
    )

    return [
      leftWall,
      rightWall,
      bagFloor,
      ground,
      leftGuard,
      rightGuard,
      leftFunnel,
      rightFunnel,
    ]
  }

  const makeCookie = (x, y, index, isStatic = false) => {
    const palette = COOKIE_PALETTES[index % COOKIE_PALETTES.length]
    const artwork = makeCookieArtwork(index + 1, palette)
    // A little size variation keeps the pile from looking manufactured.
    const sizeVariation = 0.9 + mulberry32(index * 53 + 7)() * 0.18
    const cookieRadius = radius * sizeVariation
    const body = Bodies.circle(x, y, cookieRadius, {
      isStatic,
      density: 0.0018,
      friction: 0.46,
      frictionStatic: 0.78,
      frictionAir: 0.016,
      restitution: 0.055,
      slop: 0.035,
      sleepThreshold: 58,
      collisionFilter: { category: COOKIE_CATEGORY },
      render: { visible: false },
    })
    body.plugin = { artwork, index, sizeVariation, sprite: null }
    Body.setAngle(body, artwork.edge[0].scale * index * 0.7)
    Body.setAngularVelocity(body, (mulberry32(index + 3)() - 0.5) * 0.05)
    return body
  }

  const layoutStaticCookies = () => {
    const bag = bagPixels()
    const columns = Math.min(4, Math.max(3, Math.floor((bag.right - bag.left) / (radius * 2.1))))
    cookies.forEach((body, index) => {
      const row = Math.floor(index / columns)
      const column = index % columns
      const rowCount = Math.min(columns, cookies.length - row * columns)
      const offset = ((rowCount - 1) / 2) * radius * 2.08
      const jitter = (mulberry32(index * 19 + 3)() - 0.5) * radius * 0.24
      const x = (bag.left + bag.right) / 2 - offset + column * radius * 2.08 + jitter
      const y = bag.floor - radius * 1.04 - row * radius * 1.72
      Body.setPosition(body, { x, y })
      Body.setAngle(body, (index * 0.9) % (Math.PI * 2))
    })
  }

  const spawnCookies = () => {
    const bag = bagPixels()
    const innerWidth = bag.right - bag.left
    const count = Math.max(3, Math.min(cookieCount, 18))
    const random = mulberry32(97)

    cookies = Array.from({ length: count }, (_, index) => {
      const bodyRadius = radius * (0.9 + mulberry32(index * 53 + 7)() * 0.18)
      if (reducedMotion) {
        return makeCookie(0, 0, index, true)
      }
      const usable = Math.max(1, innerWidth - bodyRadius * 2)
      const x = bag.left + bodyRadius + ((index * 0.61803398875) % 1) * usable
      const layer = index % 5
      const y = -bodyRadius - layer * radius * 2.3 - Math.floor(index / 5) * radius * 1.4
      return makeCookie(x, y, index)
    })

    Composite.add(world, cookies)

    if (reducedMotion) {
      layoutStaticCookies()
    } else {
      // A little horizontal drift gives the entrance life without faking gravity.
      cookies.forEach((body, index) => {
        Body.setVelocity(body, { x: (random() - 0.5) * 0.8, y: 0 })
        if (index > 5) Body.setPosition(body, { x: body.position.x, y: body.position.y - radius })
      })
    }
  }

  /**
   * User-triggered reset. Lifts every cookie above the opening so the pile can
   * fall in again naturally. This is the only place a cookie position is set
   * outside of resize handling, and it is never tied to scroll.
   */
  const refill = () => {
    if (reducedMotion || !cookies.length) return false
    const bag = bagPixels()
    const innerWidth = bag.right - bag.left
    const random = mulberry32(4242)

    cookies.forEach((body, index) => {
      const r = body.circleRadius || radius
      const usable = Math.max(1, innerWidth - r * 2)
      Body.setStatic(body, false)
      Body.setPosition(body, {
        x: bag.left + r + ((index * 0.61803398875) % 1) * usable,
        y: bag.top - r - (index % 5) * r * 2.2 - Math.floor(index / 5) * r * 1.4,
      })
      Body.setAngle(body, random() * Math.PI * 2)
      Body.setVelocity(body, { x: (random() - 0.5) * 0.7, y: 0.4 })
      Body.setAngularVelocity(body, (random() - 0.5) * 0.1)
      Sleeping.set(body, false)
    })

    lastActive = false
    lastActivityAt = 0
    render()
    return true
  }

  /**
   * Drops one settled cookie back in through the open top. This gives touch and
   * keyboard users an explicit way to trigger the same physics as a drag.
   */
  const dropCookie = (index = 0) => {
    if (reducedMotion || !cookies.length) return false
    const bag = bagPixels()
    const body = cookies[Math.abs(index) % cookies.length]
    const random = mulberry32(body.id * 17 + 5)
    Body.setStatic(body, false)
    Body.setPosition(body, {
      x: (bag.left + bag.right) / 2 + (random() - 0.5) * (bag.right - bag.left) * 0.38,
      y: bag.top - radius * 2.1,
    })
    Body.setAngle(body, random() * Math.PI * 2)
    Body.setVelocity(body, { x: (random() - 0.5) * 1.1, y: 1.3 })
    Body.setAngularVelocity(body, (random() - 0.5) * 0.18)
    Sleeping.set(body, false)
    lastActive = false
    lastActivityAt = 0
    return true
  }

  const setViewScale = (nextScale = 1) => {
    viewScale = clamp(Number(nextScale) || 1, 0.5, 1.6)
    if (mouse) Mouse.setScale(mouse, { x: 1 / viewScale, y: 1 / viewScale })
  }

  const makeSprite = (artwork, r) => {
    const size = Math.max(8, Math.ceil(r * 2 + 4))
    const sprite = document.createElement('canvas')
    sprite.width = Math.max(1, Math.ceil(size * dpr))
    sprite.height = Math.max(1, Math.ceil(size * dpr))
    const spriteContext = sprite.getContext('2d')
    if (!spriteContext) return null

    spriteContext.setTransform(dpr, 0, 0, dpr, 0, 0)
    spriteContext.translate(size / 2, size / 2)

    const trace = () => {
      spriteContext.beginPath()
      artwork.edge.forEach((point, index) => {
        const pointRadius = r * point.scale
        const x = Math.cos(point.angle) * pointRadius
        const y = Math.sin(point.angle) * pointRadius
        if (index === 0) spriteContext.moveTo(x, y)
        else spriteContext.lineTo(x, y)
      })
      spriteContext.closePath()
    }

    trace()
    const gradient = spriteContext.createRadialGradient(-r * 0.36, -r * 0.4, r * 0.1, 0, 0, r * 1.14)
    gradient.addColorStop(0, artwork.palette.light)
    gradient.addColorStop(0.52, artwork.palette.base)
    gradient.addColorStop(1, artwork.palette.edge)
    spriteContext.fillStyle = gradient
    spriteContext.fill()

    trace()
    spriteContext.strokeStyle = `${artwork.palette.rim}88`
    spriteContext.lineWidth = Math.max(1, r * 0.035)
    spriteContext.stroke()

    artwork.chips.forEach((chip) => {
      spriteContext.save()
      spriteContext.translate(chip.x * r, chip.y * r)
      spriteContext.rotate(chip.rot)
      spriteContext.beginPath()
      spriteContext.ellipse(0, 0, chip.rx * r, chip.ry * r, 0, 0, Math.PI * 2)
      spriteContext.fillStyle = artwork.palette.chip
      spriteContext.fill()
      spriteContext.beginPath()
      spriteContext.ellipse(
        -chip.rx * r * 0.25,
        -chip.ry * r * 0.25,
        chip.rx * r * 0.32,
        chip.ry * r * 0.24,
        0,
        0,
        Math.PI * 2,
      )
      spriteContext.fillStyle = 'rgba(255, 244, 226, 0.14)'
      spriteContext.fill()
      spriteContext.restore()
    })

    artwork.specks.forEach((speck) => {
      spriteContext.beginPath()
      spriteContext.arc(speck.x * r, speck.y * r, speck.r * r, 0, Math.PI * 2)
      spriteContext.fillStyle = speck.light
        ? 'rgba(255, 236, 205, 0.16)'
        : 'rgba(64, 36, 18, 0.2)'
      spriteContext.fill()
    })

    spriteContext.beginPath()
    spriteContext.arc(0, 0, r * 0.72, -2.55, -1.32)
    spriteContext.strokeStyle = 'rgba(255, 242, 219, 0.2)'
    spriteContext.lineWidth = Math.max(1, r * 0.05)
    spriteContext.lineCap = 'round'
    spriteContext.stroke()

    return { canvas: sprite, size }
  }

  const buildSprites = () => {
    cookies.forEach((body) => {
      body.plugin.sprite = makeSprite(body.plugin.artwork, body.circleRadius || radius)
    })
  }

  const buildShadowSprite = () => {
    const size = 96
    const sprite = document.createElement('canvas')
    sprite.width = size
    sprite.height = size
    const spriteContext = sprite.getContext('2d')
    if (!spriteContext) return null
    const gradient = spriteContext.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    )
    gradient.addColorStop(0, 'rgba(22, 13, 7, 0.44)')
    gradient.addColorStop(0.55, 'rgba(22, 13, 7, 0.2)')
    gradient.addColorStop(1, 'rgba(22, 13, 7, 0)')
    spriteContext.fillStyle = gradient
    spriteContext.fillRect(0, 0, size, size)
    return sprite
  }

  const buildFloorLayer = () => {
    if (width < 2 || height < 2) return
    const layer = document.createElement('canvas')
    layer.width = Math.max(1, Math.round(width * dpr))
    layer.height = Math.max(1, Math.round(height * dpr))
    const layerContext = layer.getContext('2d')
    if (!layerContext) return

    layerContext.setTransform(dpr, 0, 0, dpr, 0, 0)
    const bag = bagPixels()
    const innerWidth = bag.right - bag.left
    const shadow = layerContext.createLinearGradient(0, bag.floor - radius * 1.4, 0, bag.floor + 2)
    shadow.addColorStop(0, 'rgba(24, 14, 8, 0)')
    shadow.addColorStop(1, 'rgba(24, 14, 8, 0.26)')
    layerContext.fillStyle = shadow
    layerContext.fillRect(bag.left, bag.floor - radius * 1.4, innerWidth, radius * 1.4)

    const random = mulberry32(41)
    for (let index = 0; index < 22; index += 1) {
      const x = bag.left + random() * innerWidth
      const y = bag.floor - random() * radius * 0.35
      layerContext.beginPath()
      layerContext.arc(x, y, 0.7 + random() * 1.6, 0, Math.PI * 2)
      layerContext.fillStyle = random() > 0.5 ? 'rgba(74, 45, 25, 0.35)' : 'rgba(38, 22, 13, 0.28)'
      layerContext.fill()
    }

    floorLayer = layer
  }

  const render = () => {
    if (destroyed) return
    context.clearRect(0, 0, width, height)
    if (floorLayer) context.drawImage(floorLayer, 0, 0, width, height)

    const ordered = [...cookies].sort((a, b) => a.position.y - b.position.y)
    const visible = ordered.filter((body) => body.position.y < height + radius * 3)

    if (shadowSprite) {
      visible.forEach((body) => {
        const r = body.circleRadius || radius
        context.drawImage(
          shadowSprite,
          body.position.x - r * 1.18,
          body.position.y - r * 0.62,
          r * 2.36,
          r * 1.74,
        )
      })
    }

    visible.forEach((body) => {
      const sprite = body.plugin?.sprite
      if (!sprite) return
      context.save()
      context.translate(body.position.x, body.position.y)
      context.rotate(body.angle)
      context.drawImage(sprite.canvas, -sprite.size / 2, -sprite.size / 2, sprite.size, sprite.size)
      context.restore()
    })

    if (mouseConstraint?.body) {
      const body = mouseConstraint.body
      context.save()
      context.beginPath()
      context.moveTo(mouse.position.x, mouse.position.y)
      context.lineTo(body.position.x, body.position.y)
      context.setLineDash([3, 5])
      context.strokeStyle = 'rgba(166, 107, 60, 0.45)'
      context.lineWidth = 1
      context.stroke()
      context.restore()
    }
  }

  const reportActivity = () => {
    if (reducedMotion) return
    const now = performance.now()
    if (now - lastActivityAt < 200) return
    lastActivityAt = now

    let active = false
    for (const body of cookies) {
      if (body.isStatic || body.isSleeping) continue
      if (body.speed > 0.4 || Math.abs(body.angularVelocity) > 0.03) {
        active = true
        break
      }
    }

    if (active !== lastActive) {
      lastActive = active
      onActivity({ active })
    }
  }

  /**
   * Last-resort containment. Physics does the real work; this only catches the
   * rare tunnelled body and keeps velocities in a stable range.
   */
  const clampBodies = () => {
    if (!cookies.length) return
    const bag = bagPixels()
    cookies.forEach((body) => {
      if (body.isStatic) return
      const velocity = body.velocity
      const speed = Math.hypot(velocity.x, velocity.y)
      if (speed > MAX_SPEED) {
        Body.setVelocity(body, {
          x: (velocity.x / speed) * MAX_SPEED,
          y: (velocity.y / speed) * MAX_SPEED,
        })
      }
      if (Math.abs(body.angularVelocity) > MAX_SPIN) {
        Body.setAngularVelocity(body, Math.sign(body.angularVelocity) * MAX_SPIN)
      }

      const r = body.circleRadius || radius
      if (body.position.y > bag.top + r * 0.6) {
        const minX = bag.left + r * 0.55
        const maxX = bag.right - r * 0.55
        if (body.position.x < minX) {
          Body.setPosition(body, { x: minX, y: body.position.y })
          Body.setVelocity(body, { x: Math.max(0.4, Math.abs(velocity.x) * 0.3), y: velocity.y * 0.5 })
        } else if (body.position.x > maxX) {
          Body.setPosition(body, { x: maxX, y: body.position.y })
          Body.setVelocity(body, { x: -Math.max(0.4, Math.abs(velocity.x) * 0.3), y: velocity.y * 0.5 })
        }
      }

      if (body.position.y > height + r * 2 || body.position.y < -height * 3) {
        Body.setPosition(body, { x: width / 2, y: bag.top - r * 2 })
        Body.setVelocity(body, { x: 0, y: 0 })
        Sleeping.set(body, false)
      }
    })
  }

  const attachMouse = () => {
    if (reducedMotion) return
    mouse = Mouse.create(canvas)
    mouse.pixelRatio = dpr
    Mouse.setScale(mouse, { x: 1 / viewScale, y: 1 / viewScale })
    // Matter's wheel listener would block page scrolling over the scene.
    canvas.removeEventListener('wheel', mouse.mousewheel)

    mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.17,
        damping: 0.1,
        angularStiffness: 0,
        render: { visible: false },
      },
    })
    mouseConstraint.collisionFilter.mask = COOKIE_CATEGORY
    Composite.add(world, mouseConstraint)

    Events.on(mouseConstraint, 'startdrag', ({ body }) => {
      if (body) Sleeping.set(body, false)
      onGrabChange(true)
      if (!firstGrabFired) {
        firstGrabFired = true
        onFirstGrab()
      }
    })
    Events.on(mouseConstraint, 'enddrag', () => onGrabChange(false))
  }

  const handleResize = () => {
    if (destroyed) return
    const rect = container.getBoundingClientRect()
    if (rect.width < 2 || rect.height < 2) return

    const nextWidth = rect.width
    const nextHeight = rect.height
    const previousWidth = width
    const previousHeight = height
    const previousRadius = radius

    width = nextWidth
    height = nextHeight
    setupCanvas()
    if (mouse) Mouse.setScale(mouse, { x: 1 / viewScale, y: 1 / viewScale })

    radius = Math.max(14, Math.min(38, width * 0.05))
    const radiusScale = previousRadius > 0 ? radius / previousRadius : 1

    if (walls.length) Composite.remove(world, walls)
    walls = buildWalls()
    Composite.add(world, walls)

    if (previousWidth > 1 && previousHeight > 1) {
      const scaleX = width / previousWidth
      const scaleY = height / previousHeight
      cookies.forEach((body) => {
        const r = (body.circleRadius || previousRadius) * radiusScale
        Body.setPosition(body, {
          x: clamp(body.position.x * scaleX, r, width - r),
          y: clamp(body.position.y * scaleY, -height * 3, height - r),
        })
        Body.scale(body, radiusScale, radiusScale)
        if (!body.isStatic) {
          Body.setVelocity(body, {
            x: clamp(body.velocity.x, -MAX_SPEED, MAX_SPEED),
            y: clamp(body.velocity.y, -MAX_SPEED, MAX_SPEED),
          })
          Sleeping.set(body, false)
        }
      })
    } else {
      cookies.forEach((body) => Body.scale(body, radiusScale, radiusScale))
    }

    if (reducedMotion) layoutStaticCookies()
    buildSprites()
    buildFloorLayer()
    render()
  }

  const setup = () => {
    const rect = container.getBoundingClientRect()
    width = Math.max(1, rect.width)
    height = Math.max(1, rect.height)
    radius = Math.max(14, Math.min(38, width * 0.05))
    setupCanvas()
    walls = buildWalls()
    Composite.add(world, walls)
    spawnCookies()
    buildSprites()
    shadowSprite = buildShadowSprite()
    buildFloorLayer()
    attachMouse()
    render()
    container.dataset.physics = 'ready'
    container.dataset.cookieCount = String(cookies.length)

    resizeObserver = new ResizeObserver(() => {
      if (resizeFrame) return
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0
        handleResize()
      })
    })
    resizeObserver.observe(container)
  }

  const tick = () => {
    clampBodies()
    render()
    reportActivity()
  }

  const start = () => {
    if (destroyed || reducedMotion || running) return
    if (!runner) {
      runner = Runner.create()
      Events.on(engine, 'afterUpdate', tick)
    }
    lastActivityAt = 0
    Runner.run(runner, engine)
    running = true
  }

  const pause = () => {
    if (!runner || !running) return
    Runner.stop(runner)
    running = false
    render()
  }

  const destroy = () => {
    if (destroyed) return
    destroyed = true
    if (resizeObserver) resizeObserver.disconnect()
    if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
    if (runner) {
      Events.off(engine, 'afterUpdate', tick)
      Runner.stop(runner)
      runner = null
    }
    if (mouseConstraint) {
      Events.off(mouseConstraint)
      Composite.remove(world, mouseConstraint)
    }
    removeMouseListeners(mouse, canvas)
    mouse = null
    mouseConstraint = null
    Composite.clear(world, false, true)
    Engine.clear(engine)
    cookies = []
    walls = []
    floorLayer = null
    shadowSprite = null
    context.clearRect(0, 0, canvas.width, canvas.height)
    delete container.dataset.physics
    delete container.dataset.cookieCount
    delete canvas.__mcPhysics
  }

  try {
    setup()
  } catch (error) {
    // A static, rendered fallback is still available through the bag artwork.
    console.warn('Cookie physics could not be initialised:', error)
    destroy()
    return null
  }

  const getState = () => ({
    width,
    height,
    radius,
    viewScale,
    running,
    reducedMotion,
    active: lastActive,
    settled: !lastActive,
    bag: bagPixels(),
    bodies: cookies.map((body) => ({
      id: body.id,
      index: body.plugin?.index ?? -1,
      x: body.position.x,
      y: body.position.y,
      angle: body.angle,
      vx: body.velocity.x,
      vy: body.velocity.y,
      speed: body.speed,
      radius: body.circleRadius,
      isStatic: body.isStatic,
      isSleeping: body.isSleeping,
    })),
    walls: walls.map((wall) => ({
      id: wall.id,
      x: wall.position.x,
      y: wall.position.y,
      angle: wall.angle,
      bounds: { ...wall.bounds },
    })),
  })

  const api = {
    start,
    pause,
    resize: handleResize,
    destroy,
    engine,
    refill,
    dropCookie,
    setViewScale,
    getState,
  }

  // Read-only-ish development hook used by the browser test suite to verify
  // collisions, stacking and containment without inspecting private React state.
  canvas.__mcPhysics = {
    getState,
    refill,
    dropCookie,
    setViewScale,
  }

  return api
}
