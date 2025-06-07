import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  validateTokens,
  loadUserAvatar,
} from '../../store/redux/userSlice/userSlice'
import { RootState, AppDispatch } from '../../store/store'

interface AuthGuardProps {
  children: React.ReactNode
}

function AuthGuard({ children }: AuthGuardProps) {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.user)

  useEffect(() => {
    // Проверяем токены при каждом монтировании компонента
    if (user.isAuthenticated && user.accessToken && user.refreshToken) {
      dispatch(
        validateTokens({
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        })
      )
    }
  }, [dispatch, user.accessToken, user.refreshToken, user.isAuthenticated])

  useEffect(() => {
    // Загружаем аватар когда пользователь авторизован и есть foto
    if (
      user.isAuthenticated &&
      user.id &&
      user.foto &&
      user.accessToken &&
      !user.avatarDisplayUrl
    ) {
      dispatch(
        loadUserAvatar({ userId: user.id, accessToken: user.accessToken })
      )
    }
  }, [
    dispatch,
    user.isAuthenticated,
    user.id,
    user.foto,
    user.accessToken,
    user.avatarDisplayUrl,
  ])

  return <>{children}</>
}

export default AuthGuard
