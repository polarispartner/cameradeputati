import { useEffect, useState } from 'react'

function decodeOne(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (img.decode) img.decode().then(resolve, resolve)
      else resolve()
    }
    img.onerror = () => resolve()
    img.src = url
  })
}

// Resolves to true once every URL in `urls` has been fetched and decoded.
// Re-runs when the set of URLs changes.
export function useImagesReady(urls) {
  const key = (urls ?? []).join('|')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(false)
    const list = urls ?? []
    if (list.length === 0) {
      setReady(true)
      return
    }
    let cancelled = false
    Promise.all(list.map(decodeOne)).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return ready
}
