import { useEffect, useRef } from 'react'
import { barColor } from '../utils/scores'

export default function ScoreRing({ score, size = 84 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const cx = size / 2, cy = size / 2, rad = size * 0.4, sw = 6

    ctx.clearRect(0, 0, size, size)
    ctx.beginPath()
    ctx.arc(cx, cy, rad, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(128,128,128,0.15)'
    ctx.lineWidth = sw
    ctx.stroke()

    const angle = (score / 100) * Math.PI * 2 - Math.PI / 2
    ctx.beginPath()
    ctx.arc(cx, cy, rad, -Math.PI / 2, angle)
    ctx.strokeStyle = barColor(score)
    ctx.lineWidth = sw
    ctx.lineCap = 'round'
    ctx.stroke()
  }, [score, size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ display: 'block' }}
    />
  )
}
