// Утилитарные функции для работы с языками
export interface LanguageData {
  id: number
  skillLevel: string
  language: {
    id: number
    name: string
  }
  originalLanguageId?: number // для поиска названия в availableLanguages
  languageId?: number // для поддержки формата с прямым languageId
}

// Защитная функция для получения имени языка
export const getLanguageName = (
  lang: LanguageData | any,
  availableLanguages: { id: number; name: string }[] = []
): string => {
  // Если есть название в структуре language
  if (lang?.language?.name) {
    return lang.language.name
  }

  // Работа с исходным форматом данных с languageId
  if (lang?.languageId && availableLanguages.length > 0) {
    const foundLang = availableLanguages.find((al) => al.id === lang.languageId)
    if (foundLang?.name) {
      return foundLang.name
    }
  }

  // Если есть originalLanguageId, ищем в availableLanguages
  if (lang?.originalLanguageId && availableLanguages.length > 0) {
    const foundLang = availableLanguages.find(
      (al) => al.id === lang.originalLanguageId
    )
    if (foundLang?.name) {
      return foundLang.name
    }
  }

  // Если есть language.id, ищем в availableLanguages
  if (lang?.language?.id && availableLanguages.length > 0) {
    const foundLang = availableLanguages.find(
      (al) => al.id === lang.language.id
    )
    if (foundLang?.name) {
      return foundLang.name
    }
  }

  return `Language ${
    lang?.languageId ||
    lang?.language?.id ||
    lang?.originalLanguageId ||
    lang?.id ||
    'Unknown'
  }`
}

// Защитная функция для получения уровня языка
export const getSkillLevel = (lang: LanguageData | any): string => {
  // Проверяем что lang существует и является объектом
  if (!lang || typeof lang !== 'object') {
    return 'default'
  }

  // Проверяем skillLevel (основное поле в нормализованных данных)
  if (lang.skillLevel) {
    return String(lang.skillLevel)
  }

  // Проверяем skillLvl (альтернативное поле)
  if (lang.skillLvl) {
    return String(lang.skillLvl)
  }

  // Проверяем level (еще один возможный вариант)
  if (lang.level) {
    return String(lang.level)
  }

  // Проверяем все возможные варианты полей
  const possibleFields = [
    'skillLevel',
    'skillLvl',
    'level',
    'skill_level',
    'skill_lvl',
  ]

  for (const field of possibleFields) {
    if (lang[field]) {
      return String(lang[field])
    }
  }

  return 'default'
}
