import { useState, useEffect, useRef, useCallback } from 'react'

interface ImageSource {
  src: string
  type?: string // 'webp', 'jpeg', 'png'
}

interface UseLazyBackgroundAdvancedOptions {
  threshold?: number
  rootMargin?: string
  placeholder?: string
  sources: ImageSource[] | string
  preloadPriority?: 'high' | 'low'
}

export function useLazyBackgroundAdvanced(
  options: UseLazyBackgroundAdvancedOptions
) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string>('')
  const elementRef = useRef<HTMLElement>(null)

  const {
    threshold = 0.1,
    rootMargin = '50px',
    placeholder,
    sources,
    preloadPriority = 'low',
  } = options

  // Проверка поддержки WebP
  const supportsWebP = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL('image/webp').indexOf('webp') > -1
  }

  // Получение оптимального источника изображения
  const getBestImageSource = useCallback((): string => {
    if (typeof sources === 'string') {
      return sources
    }

    const webpSupported = supportsWebP()

    // Приоритет: WebP (если поддерживается) -> JPEG -> PNG -> первый доступный
    const priorityOrder = webpSupported
      ? ['webp', 'jpeg', 'png']
      : ['jpeg', 'png', 'webp']

    for (const type of priorityOrder) {
      const source = sources.find((s) => s.type === type)
      if (source) return source.src
    }

    // Fallback к первому источнику
    return sources[0]?.src || ''
  }, [sources])

  // Intersection Observer для отслеживания видимости
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

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

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin])

  // Загрузка изображения когда элемент в viewport
  useEffect(() => {
    if (!isInView || isLoaded) return

    const bestSrc = getBestImageSource()
    if (!bestSrc) return

    const img = new Image()

    // Устанавливаем приоритет загрузки
    if ('loading' in img) {
      img.loading = preloadPriority === 'high' ? 'eager' : 'lazy'
    }

    img.onload = () => {
      setCurrentSrc(bestSrc)
      setIsLoaded(true)
      setHasError(false)
    }

    img.onerror = () => {
      // Пробуем следующий источник
      if (typeof sources !== 'string' && sources.length > 1) {
        const remainingSources = sources.filter((s) => s.src !== bestSrc)
        if (remainingSources.length > 0) {
          // Рекурсивная попытка с оставшимися источниками
          // Здесь можно добавить логику для попытки следующего источника
        }
      }
      setHasError(true)
      setIsLoaded(false)
    }

    img.src = bestSrc

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [isInView, sources, isLoaded, preloadPriority, getBestImageSource])

  // Возвращаем CSS стили для background
  const backgroundStyle = {
    backgroundImage:
      isLoaded && currentSrc
        ? `url(${currentSrc})`
        : placeholder
        ? `url(${placeholder})`
        : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: isLoaded ? 'background-image 0.3s ease-in-out' : 'none',
  }

  return {
    ref: elementRef,
    isLoaded,
    isInView,
    hasError,
    backgroundStyle,
    currentSrc,
  }
}
