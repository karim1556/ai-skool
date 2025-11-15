"use client"
import React, { useEffect, useRef, useState } from 'react'

type Props = {
  path: string // relative path in protected-videos, e.g. "courseId/file.mp4"
}

export default function SecureVideoPlayer({ path }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<number | null>(null)

  async function fetchToken() {
    const res = await fetch('/api/media/get-signed-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    })
    if (!res.ok) throw new Error('Failed to get token')
    const data = await res.json()
    setSignedUrl(`/api/media/stream?token=${encodeURIComponent(data.token)}`)
    setExpiresAt(data.expiresAt)
    return data
  }

  // Initial token
  useEffect(() => {
    let cancelled = false
    fetchToken().catch((e) => {
      if (!cancelled) console.error(e)
    })
    return () => { cancelled = true }
  }, [path])

  // Refresh loop
  useEffect(() => {
    if (!expiresAt) return
    const now = Math.floor(Date.now() / 1000)
    const msUntilRefresh = Math.max(0, (expiresAt - now - 20) * 1000)
    const t = setTimeout(async () => {
      const vid = videoRef.current
      const currentTime = vid?.currentTime || 0
      const isPlaying = vid ? !vid.paused : false
      try {
        const data = await fetchToken()
        // new signedUrl will be set by fetchToken
        // restore playback state when new src loads
        const onLoad = () => {
          if (!vid) return
          vid.currentTime = currentTime
          if (isPlaying) vid.play().catch(() => {})
          vid.removeEventListener('loadedmetadata', onLoad)
        }
        vid?.addEventListener('loadedmetadata', onLoad)
      } catch (e) {
        console.error('token refresh failed', e)
      }
    }, msUntilRefresh)
    return () => clearTimeout(t)
  }, [expiresAt])

  return (
    <video
      ref={videoRef}
      src={signedUrl ?? undefined}
      controls
      style={{ width: '100%', maxHeight: 720 }}
    />
  )
}
