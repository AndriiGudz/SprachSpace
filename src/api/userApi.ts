import { API_ROOT_URL } from '../config/apiConfig' // Import from new config

// Construct the base URL for user-specific endpoints
export const API_BASE_URL = `${API_ROOT_URL}/users`

interface UploadAvatarResponse {
  foto: string // Теперь здесь будет только имя файла, например, '796d67b6-f380-4fd7-a09e-bbec03a595c8.png'
}

export async function uploadAvatar(
  userId: number | string,
  file: File,
  token: string | null // Добавляем токен для возможной авторизации
): Promise<UploadAvatarResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const uploadUrl = `${API_BASE_URL}/uploadAvatar?userId=${userId}`

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
    headers, // Добавляем заголовки
  })

  if (!response.ok) {
    let errorMessage = 'Failed to upload avatar'
    try {
      const errorText = await response.text()
      errorMessage = errorText || errorMessage
    } catch (e) {
      // Оставить errorMessage по умолчанию, если не удалось получить текст ошибки
    }
    throw new Error(errorMessage)
  }

  // Сервер возвращает строку: "Uploaded successfully. URL: /api/user/avatar/FILENAME.png"
  const successMessage = await response.text()

  const urlPrefix = 'URL: '
  const urlStartIndex = successMessage.indexOf(urlPrefix)

  if (urlStartIndex === -1) {
    throw new Error('Invalid server response format: URL not found.')
  }

  const relativePathWithLeadingSlash = successMessage.substring(
    urlStartIndex + urlPrefix.length
  )

  // relativePath будет, например, "/api/user/avatar/796d67b6-f380-4fd7-a09e-bbec03a595c8.png"

  // Извлекаем только имя файла из пути
  const fileName = relativePathWithLeadingSlash.split('/').pop()

  if (!fileName) {
    throw new Error(
      'Invalid server response format: Could not extract filename.'
    )
  }

  return { foto: fileName }
}

// Теперь первый параметр это ID пользователя, для которого получаем аватар
export async function getAvatarUrl(
  userIdForAvatar: string | number | null, // Изменили имя параметра и его суть
  token: string | null
): Promise<string | undefined> {
  if (!userIdForAvatar || !token) {
    return undefined
  }

  // Проверка на полный URL больше не релевантна, если мы всегда строим URL по userId
  // Если state.user.foto мог содержать старые полные URL, эту логику нужно пересмотреть
  // или убедиться, что foto всегда содержит только имя файла.

  const fetchUrl = `${API_BASE_URL}/avatar/${userIdForAvatar}` // Используем userIdForAvatar

  try {
    const response = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      // Можно добавить более специфическую обработку ошибок, если нужно
      // Например, на основе response.status
      return undefined
    }

    const imageBlob = await response.blob()
    const objectURL = URL.createObjectURL(imageBlob)
    return objectURL
  } catch (error) {
    // Можно добавить обработку специфических сетевых ошибок
    return undefined
  }
}
