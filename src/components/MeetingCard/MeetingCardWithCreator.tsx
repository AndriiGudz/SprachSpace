import { useEffect, useMemo } from 'react'
import { Meeting, Organizer } from './types'
import MeetingCard from './MeetingCard'
import { useUserData } from '../../hooks/useUserData'

// Логируем отсутствие данных организатора только один раз на ID
const warnedOrganizerIds = new Set<number>()

// Type guard для проверки, является ли объект UserData
function isUserData(
  obj: any
): obj is { email: string; surname: string; avatar: string | null } {
  return obj && typeof obj.email === 'string'
}

interface MeetingCardWithCreatorProps {
  meeting: Meeting & {
    privateRoom: boolean
  }
  isPast?: boolean
}

function MeetingCardWithCreator({
  meeting,
  isPast = false,
}: MeetingCardWithCreatorProps) {
  const { fetchUserData, getUserData } = useUserData()

  // Получаем ID организатора из creator
  const organizerId = useMemo(() => {
    // Проверяем, есть ли creator в данных встречи (может быть в разных форматах)
    if (typeof meeting.creator === 'number') {
      return meeting.creator
    }

    // Если creator это объект с id
    if (
      meeting.creator &&
      typeof meeting.creator === 'object' &&
      'id' in meeting.creator
    ) {
      return meeting.creator.id
    }

    return null
  }, [meeting.creator])

  // Загружаем данные организатора если нужно
  useEffect(() => {
    if (organizerId) {
      fetchUserData(organizerId)
    }
  }, [organizerId, fetchUserData])

  // Получаем данные организатора из кэша
  const organizerData = useMemo(() => {
    if (organizerId) {
      return getUserData(organizerId)
    }
    return null
  }, [organizerId, getUserData])

  // Создаем обновленную встречу с данными организатора
  const meetingWithOrganizer = useMemo(() => {
    if (!organizerData) {
      return meeting
    }

    // Используем type guard для безопасного доступа к свойствам
    const userData = isUserData(organizerData) ? organizerData : null

    // В UserData поле называется 'avatar', а в Organizer мы ожидаем 'avatarFileName'
    const avatarFileName =
      organizerData.avatar || (organizerData as Organizer).avatarFileName

    const organizer = {
      id: organizerData.id,
      name:
        organizerData.name ||
        organizerData.nickname ||
        userData?.email ||
        'Unknown',
      nickname: organizerData.nickname || undefined,
      firstName: organizerData.name || undefined,
      lastName: userData?.surname || undefined,
      avatarFileName: avatarFileName,
      rating: organizerData.rating,
    }

    return {
      ...meeting,
      organizer,
    }
  }, [meeting, organizerData])

  // Больше не блокируем карточку лоадером — рендерим сразу без организатора, он догрузится

  // Если не удалось загрузить данные организатора, показываем карточку без аватара
  if (organizerId && !organizerData && !warnedOrganizerIds.has(organizerId)) {
    console.debug(`Organizer data not loaded for user ID: ${organizerId}`)
    warnedOrganizerIds.add(organizerId)
  }

  return <MeetingCard meeting={meetingWithOrganizer} isPast={isPast} />
}

export default MeetingCardWithCreator
