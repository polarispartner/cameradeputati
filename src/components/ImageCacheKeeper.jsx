import { memo } from 'react'
import { ALL_IMAGES } from '../lib/preloadImages'

function ImageCacheKeeper() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      {ALL_IMAGES.map((url) => (
        <img
          key={url}
          src={url}
          alt=""
          decoding="sync"
          loading="eager"
          draggable={false}
        />
      ))}
    </div>
  )
}

export default memo(ImageCacheKeeper)
