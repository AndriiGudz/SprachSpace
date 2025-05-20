export interface Organizer {
  name: string // Имя или никнейм для отображения, может быть composite
  nickname: string
  firstName?: string
  lastName?: string
  rating?: number | string // Рейтинг может быть числом или строкой (например, "N/A")
  avatarUrl?: string // Используется для hostAvatar
  // url?: string; // Ссылка на профиль организатора, если есть
}

export interface MeetingLocation {
  name: string // Например, 'Online' или название платформы
  // address?: string; // Если есть физический адрес
  // virtual?: boolean; // Явно указать, что это виртуальная встреча
  url?: string // Ссылка на комнату встречи, может совпадать с roomUrl
}

export interface Meeting {
  id: number
  slug: string // Для ЧПУ
  name: string // Бывший title, для Schema.org Event.name
  description?: string // Для Schema.org Event.description и мета-тегов
  category: string
  startTime: string // ISO string, для Schema.org Event.startDate
  endTime: string // ISO string, для Schema.org Event.endDate
  duration?: string // Может вычисляться из startTime и endTime, или оставаться для отображения
  minParticipants: number
  maxParticipants?: number
  waitingParticipants?: number
  language: string // Для Schema.org Language, itemprop="inLanguage"
  proficiency: string | null
  organizer?: Organizer // Для Schema.org Event.organizer (Person)
  location?: MeetingLocation // Для Schema.org Event.location
  ageRestriction?: number | null
  shareLink: string // Для кнопки "Поделиться"
  roomUrl: string // Для кнопки "Join" и Schema.org Event.location.url или Event.url
  imageUrl?: string // Опциональное основное изображение для карточки (для <Image /> и Schema.org)
  languageFlagIconUrl?: string // Если хотим передавать URL флага вместо логики внутри компонента
  privateRoom: boolean
}
