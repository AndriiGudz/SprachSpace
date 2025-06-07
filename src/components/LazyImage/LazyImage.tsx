import { forwardRef } from 'react'
import { useLazyImage } from '../../hooks/useLazyImage'
import { Box, Skeleton } from '@mui/material'

interface LazyImageProps {
  src: string
  alt?: string
  width?: string | number
  height?: string | number
  sx?: object
  threshold?: number
  rootMargin?: string
  placeholder?: string
  showSkeleton?: boolean
  className?: string
}

const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>(
  (
    {
      src,
      alt = '',
      width = 'auto',
      height = 'auto',
      sx = {},
      threshold = 0.1,
      rootMargin = '50px',
      placeholder,
      showSkeleton = true,
      className,
      ...rest
    },
    forwardedRef
  ) => {
    const {
      ref,
      src: currentSrc,
      isLoaded,
      hasError,
      style,
    } = useLazyImage(src, alt, {
      threshold,
      rootMargin,
      placeholder,
    })

    if (hasError) {
      return (
        <Box
          sx={{
            width,
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#999',
            fontSize: '14px',
            ...sx,
          }}
        >
          Изображение не загрузилось
        </Box>
      )
    }

    return (
      <Box sx={{ position: 'relative', width, height, ...sx }}>
        {/* Skeleton во время загрузки */}
        {!isLoaded && showSkeleton && (
          <Skeleton
            variant="rectangular"
            width={width}
            height={height}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              borderRadius: 'inherit',
            }}
          />
        )}

        {/* Само изображение */}
        <img
          ref={(node) => {
            // Связываем оба ref'а
            if (typeof forwardedRef === 'function') {
              forwardedRef(node)
            } else if (forwardedRef) {
              forwardedRef.current = node
            }

            if (ref && 'current' in ref) {
              ;(
                ref as React.MutableRefObject<HTMLImageElement | null>
              ).current = node
            }
          }}
          src={currentSrc}
          alt={alt}
          className={className}
          loading="lazy" // Нативная ленивая загрузка как fallback
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            ...style,
          }}
          {...rest}
        />
      </Box>
    )
  }
)

LazyImage.displayName = 'LazyImage'

export default LazyImage
