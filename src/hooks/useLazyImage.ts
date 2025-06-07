import { useState, useEffect, useRef } from 'react'

interface UseLazyImageOptions {
  threshold?: number
  rootMargin?: string
  placeholder?: string
}

export function useLazyImage(
  src: string,
  alt: string = '',
  options: UseLazyImageOptions = {}
) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>('')
  const imgRef = useRef<HTMLImageElement>(null)

  const { threshold = 0.1, rootMargin = '50px', placeholder } = options

  // Intersection Observer для отслеживания видимости
  useEffect(() => {
    const imgElement = imgRef.current
    if (!imgElement) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(imgElement)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin])

  // Загрузка изображения когда элемент в viewport
  useEffect(() => {
    if (!isInView || isLoaded) return

    const img = new Image()

    img.onload = () => {
      setImageSrc(src)
      setIsLoaded(true)
      setHasError(false)
    }

    img.onerror = () => {
      setHasError(true)
      setIsLoaded(false)
    }

    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [isInView, src, isLoaded])

  // Начальный src - placeholder или прозрачный пиксель
  const currentSrc = isLoaded
    ? imageSrc
    : placeholder ||
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

  return {
    ref: imgRef,
    src: currentSrc,
    alt,
    isLoaded,
    isInView,
    hasError,
    style: {
      opacity: isLoaded ? 1 : 0.3,
      transition: 'opacity 0.3s ease-in-out',
    },
  }
}
