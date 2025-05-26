import { API_ROOT_URL } from '../config/apiConfig' // Import from new config

// Construct the base URL for category-specific endpoints
const CATEGORY_API_BASE_URL = `${API_ROOT_URL}`

export interface Category {
  id: number
  name: string
}

export async function getAllCategories(): Promise<Category[]> {
  const response = await fetch(
    `${CATEGORY_API_BASE_URL}/category/allCategory`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    // You might want to throw a more specific error or handle different statuses
    const errorBody = await response.text()
    throw new Error(
      `Failed to fetch categories: ${response.status} ${errorBody}`
    )
  }

  return response.json()
}
