import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import {
  loadUserAvatar,
  setAvatarDisplayUrl,
} from '../store/redux/userSlice/userSlice'

/**
 * Хук для автоматической загрузки аватара пользователя
 * Загружает аватар если:
 * - пользователь аутентифицирован
 * - есть ID пользователя
 * - есть foto (имя файла аватара)
 * - есть access token
 * - нет загруженного avatarDisplayUrl
 */
export function useAvatarLoader() {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.user)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    const shouldLoadAvatar =
      user.isAuthenticated &&
      user.id &&
      user.foto &&
      user.accessToken &&
      !user.avatarDisplayUrl &&
      !isLoadingRef.current

    if (shouldLoadAvatar) {
      isLoadingRef.current = true

      dispatch(
        loadUserAvatar({
          fotoFileName: user.foto!,
          accessToken: user.accessToken!,
        })
      ).finally(() => {
        isLoadingRef.current = false
      })
    }
  }, [
    dispatch,
    user.isAuthenticated,
    user.id,
    user.foto,
    user.accessToken,
    user.avatarDisplayUrl,
  ])

  // Отдельный эффект для очистки невалидных blob URL
  useEffect(() => {
    if (user.avatarDisplayUrl?.startsWith('blob:')) {
      // Пытаемся загрузить изображение для проверки валидности blob URL
      const img = new Image()
      let timeoutId: NodeJS.Timeout

      img.onload = () => {
        clearTimeout(timeoutId)
      }

      img.onerror = () => {
        clearTimeout(timeoutId)
        dispatch(setAvatarDisplayUrl(null))
      }

      // Устанавливаем таймаут на случай если изображение не загружается
      timeoutId = setTimeout(() => {
        dispatch(setAvatarDisplayUrl(null))
      }, 1000)

      img.src = user.avatarDisplayUrl

      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [dispatch, user.avatarDisplayUrl])

  // Сбрасываем флаг загрузки при изменении пользователя
  useEffect(() => {
    if (!user.isAuthenticated || !user.id) {
      isLoadingRef.current = false
    }
  }, [user.isAuthenticated, user.id])

  return {
    avatarUrl: user.avatarDisplayUrl,
    isAuthenticated: user.isAuthenticated,
    hasAvatar: !!user.foto,
  }
}
 