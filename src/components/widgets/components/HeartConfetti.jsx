"use client"

import confetti from 'canvas-confetti'
import React, { useEffect, useRef } from 'react'

const heartShape = (globalThis?.window !== undefined) ? confetti.shapeFromPath({
  path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
  matrix: [0.03333333333333333, 0, 0, 0.03333333333333333, -5.566666666666666, -5.533333333333333]
}) : undefined;

function HeartConfetti() {
  const canvasRef = useRef(null)
  useEffect(() => {
    if(globalThis?.window === undefined) return
    const canvasCurrent = canvasRef.current
    const myCanvas = confetti.create(canvasCurrent, {
      resize: true,
      useWorker: true
    })

    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
      myCanvas({
        ...defaults,
        ...opts,
        shapes: [heartShape],
        scalar: 1.5,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [canvasRef])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 10000
      }}
    ></canvas>
  )
}

export default HeartConfetti