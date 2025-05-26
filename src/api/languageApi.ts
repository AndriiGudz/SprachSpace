import { API_ROOT_URL } from '../config/apiConfig'

export interface Language {
  id: number
  name: string
  // Добавь другие поля, если они есть в ответе API
}

export async function getAllLanguages(
  accessToken: string
): Promise<Language[]> {
  const response = await fetch(`${API_ROOT_URL}/language`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    // Попытка прочитать тело ошибки для более детальной информации
    const errorBody = await response.text()
    console.error(
      'Failed to fetch languages, status:',
      response.status,
      'body:',
      errorBody
    )
    throw new Error(
      `Failed to fetch languages. Status: ${response.status}${
        errorBody ? ` - ${errorBody}` : ''
      }`
    )
  }

  return response.json() as Promise<Language[]>
}
