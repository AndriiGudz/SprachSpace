import { useMemo, useCallback } from 'react'
import { Link as RouterLink } from 'react-router-dom' // Импортируем Link как RouterLink
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material'
import { Share2, Copy } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Meeting } from './types'
import {
  cardStyle,
  cardContentStyle,
  topSectionBoxStyle,
  infoBoxStyle,
  bottomSectionStyle,
  languageContainerStyle,
  ageRestrictionStyle,
  actionButtonsStyle,
  joinButtonStyle,
  participantBoxStyle,
} from './styles'

import defAvatar from '../../assets/default-avatar.png'
import enFlag from '../../assets/flag/en.png'
import deFlag from '../../assets/flag/de.png'
import ukFlag from '../../assets/flag/ua.png'
import ruFlag from '../../assets/flag/ru.png'

const languageFlagsFallback: Record<string, string> = {
  English: enFlag,
  German: deFlag,
  Ukrainian: ukFlag,
  Russian: ruFlag,
}

interface MeetingCardProps {
  meeting: Meeting
}

function MeetingCard({ meeting }: MeetingCardProps) {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    id,
    slug,
    name,
    description,
    category,
    startTime,
    endTime,
    duration,
    minParticipants,
    maxParticipants,
    waitingParticipants,
    language,
    proficiency,
    organizer,
    ageRestriction,
    shareLink,
    roomUrl,
    imageUrl,
    languageFlagIconUrl,
    location,
  } = meeting

  const flagImageSrc = useMemo(
    () => languageFlagIconUrl || languageFlagsFallback[language] || enFlag,
    [languageFlagIconUrl, language]
  )

  const hostAvatarSrc = useMemo(
    () => organizer?.avatarUrl || defAvatar,
    [organizer?.avatarUrl]
  )

  const handleShare = useCallback(() => {
    if (navigator.share && shareLink) {
      navigator
        .share({
          title: name,
          text: description || `Join our meeting: ${name}`,
          url: shareLink,
        })
        .catch((error) => console.error('Error sharing:', error))
    }
  }, [shareLink, name, description])

  const handleCopyLink = useCallback(() => {
    if (shareLink) {
      navigator.clipboard
        .writeText(shareLink)
        .catch((error) => console.error('Error copying link:', error))
    }
  }, [shareLink])

  const formattedStartTime = useMemo(
    () => format(parseISO(startTime), 'dd.MM.yyyy HH:mm'),
    [startTime]
  )

  const formattedEndTime = useMemo(
    () => format(parseISO(endTime), 'dd.MM.yyyy HH:mm'),
    [endTime]
  )

  const cardLink = useMemo(() => `/meetings/${slug || id}`, [slug, id])

  return (
    <Card sx={cardStyle} itemScope itemType="http://schema.org/Event">
      {imageUrl && <meta itemProp="image" content={imageUrl} />}
      <meta itemProp="name" content={name} />
      {description && <meta itemProp="description" content={description} />}
      <meta itemProp="startDate" content={startTime} />
      <meta itemProp="endDate" content={endTime} />
      {location?.url && <meta itemProp="location" content={location.url} />}
      {organizer?.name && (
        <div
          itemProp="organizer"
          itemScope
          itemType="http://schema.org/Person"
          style={{ display: 'none' }}
        >
          <meta itemProp="name" content={organizer.name} />
          {organizer.avatarUrl && (
            <meta itemProp="image" content={organizer.avatarUrl} />
          )}
        </div>
      )}

      <CardContent sx={cardContentStyle}>
        <RouterLink // Используем RouterLink с пропом 'to'
          to={cardLink}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Box
            sx={{
              ...topSectionBoxStyle,
              flexDirection: isMobile ? 'column' : 'row',
            }}
          >
            <Box
              sx={{ ...participantBoxStyle, width: isMobile ? '100%' : '50%' }}
            >
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ textDecoration: 'underline' }}
              >
                {t('meetingCard.titleLabel', 'Title or Subject:')}
              </Typography>
              <Typography
                component="h2" // Семантический заголовок
                variant="h6"
                color="text.secondary"
                // itemProp="name" // Уже есть в meta тегах, здесь можно убрать для чистоты, но не критично
              >
                {name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{ textDecoration: 'underline', mr: 1 }}
                >
                  {t('meetingCard.categoryLabel', 'Category:')}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  itemProp="about" // Для категории
                >
                  {category}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                ...infoBoxStyle,
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <Box sx={participantBoxStyle}>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{ textDecoration: 'underline' }}
                >
                  {t('meetingCard.timeLabel', 'Meeting time:')}
                </Typography>
                <Typography color="text.secondary">
                  {t('meetingCard.startTimeLabel', 'Start:')}{' '}
                  <time dateTime={startTime}>{formattedStartTime}</time>
                </Typography>
                <Typography color="text.secondary">
                  {t('meetingCard.endTimeLabel', 'End:')}{' '}
                  <time dateTime={endTime}>{formattedEndTime}</time>
                </Typography>
                {duration && (
                  <Typography color="text.secondary">
                    {t('meetingCard.durationLabel', 'Duration:')} {duration}
                  </Typography>
                )}
              </Box>

              {(minParticipants !== undefined ||
                maxParticipants !== undefined ||
                waitingParticipants !== undefined) && (
                <Box sx={participantBoxStyle}>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{ textDecoration: 'underline' }}
                  >
                    {t(
                      'meetingCard.participantsLabel',
                      'Number of participants:'
                    )}
                  </Typography>
                  {minParticipants !== undefined && (
                    <Typography
                      color="text.secondary"
                      itemProp="maximumAttendeeCapacity"
                      content={maxParticipants?.toString()}
                    >
                      {' '}
                      {/* Schema.org для макс. участников, если применимо */}
                      {t('meetingCard.minParticipantsLabel', 'Min:')}{' '}
                      {minParticipants}
                    </Typography>
                  )}
                  {maxParticipants !== undefined && (
                    <Typography color="text.secondary">
                      {t('meetingCard.maxParticipantsLabel', 'Max:')}{' '}
                      {maxParticipants}
                    </Typography>
                  )}
                  {waitingParticipants !== undefined && (
                    <Typography color="text.secondary">
                      {t('meetingCard.waitingParticipantsLabel', 'Waiting:')}{' '}
                      {waitingParticipants}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </RouterLink>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{ ...bottomSectionStyle, flexWrap: isMobile ? 'wrap' : 'nowrap' }}
        >
          <Box
            sx={{
              ...languageContainerStyle,
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minWidth: '40px',
              }}
              title={`${language} - ${
                proficiency || t('meetingCard.proficiencyNotSet', 'Не указан')
              }`}
            >
              <LazyLoadImage
                src={flagImageSrc}
                alt={t('meetingCard.languageFlagAlt', `${language} flag`, {
                  language,
                })}
                width={36}
                height={36}
                effect="blur"
                style={{
                  flexShrink: 0,
                  marginRight: 0,
                  minWidth: '36px',
                  minHeight: '36px',
                }}
              />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {proficiency ||
                    t('meetingCard.proficiencyNotSet', 'Не указан')}
                </Typography>
              </Box>
            </Box>

            {organizer && (
              <Tooltip
                title={t(
                  'meetingCard.organizerTooltip',
                  `Организатор: ${organizer.nickname} (${organizer.firstName} ${organizer.lastName}) - Рейтинг: ${organizer.rating}`,
                  {
                    nickname: organizer.nickname,
                    firstName: organizer.firstName,
                    lastName: organizer.lastName,
                    rating: organizer.rating,
                  }
                )}
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: '#0288d1',
                      color: '#fff',
                    },
                  },
                  arrow: {
                    sx: {
                      color: '#0288d1',
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: '40px',
                  }}
                >
                  <LazyLoadImage
                    src={hostAvatarSrc}
                    alt={t(
                      'meetingCard.hostAvatarAlt',
                      `Avatar of ${organizer.name}`,
                      { name: organizer.name }
                    )}
                    width={36}
                    height={36}
                    effect="blur"
                    style={{
                      borderRadius: '50%',
                      flexShrink: 0,
                      marginRight: 0,
                      minWidth: '36px',
                      minHeight: '36px',
                    }}
                  />
                </Box>
              </Tooltip>
            )}

            {/* Возрастное ограничение */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body2"
                color="text.primary"
                sx={{ textDecoration: 'underline' }}
              >
                {t('meetingCard.ageRestrictionLabel', 'Age:')}
              </Typography>
              {ageRestriction && ageRestriction > 0 ? (
                <Typography variant="body1" sx={ageRestrictionStyle}>
                  {ageRestriction}+
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('meetingCard.noAgeRestriction', 'Без ограничений')}
                </Typography>
              )}
            </Box>

            {/* Share */}
            {shareLink && (
              <Tooltip
                title={t('meetingCard.shareTooltip', 'Share')}
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: '#0288d1',
                      color: '#fff',
                    },
                  },
                  arrow: {
                    sx: {
                      color: '#0288d1',
                    },
                  },
                }}
              >
                <IconButton
                  onClick={handleShare}
                  aria-label={t('meetingCard.shareTooltip', 'Share')}
                >
                  <Share2 />
                </IconButton>
              </Tooltip>
            )}
            {shareLink && (
              <Tooltip
                title={t('meetingCard.copyLinkTooltip', 'Copy link')}
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: '#0288d1',
                      color: '#fff',
                    },
                  },
                  arrow: {
                    sx: {
                      color: '#0288d1',
                    },
                  },
                }}
              >
                <IconButton
                  onClick={handleCopyLink}
                  aria-label={t('meetingCard.copyLinkTooltip', 'Copy link')}
                >
                  <Copy />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Box
            sx={{
              ...actionButtonsStyle,
              justifyContent: isMobile ? 'center' : 'flex-end',
              width: isMobile ? '100%' : 'auto',
              mt: isMobile ? 2 : 0,
            }}
          >
            <Button // MUI Button, который рендерится как ссылка
              component={RouterLink} // Используем RouterLink
              to={roomUrl || cardLink} // Используем 'to'
              variant="contained"
              color="primary"
              sx={joinButtonStyle} // Используем 'sx' для стилей MUI
              target="_blank"
              rel="noopener noreferrer"
              // itemProp="url" // Можно добавить, если roomUrl это прямая ссылка на присоединение
            >
              {t('meetingCard.joinButton', 'Join')}
            </Button>
          </Box>
        </Box>
        {description && ( // Отображаем описание, если оно есть
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2 }}
            itemProp="description" // Убедимся, что описание также есть в Schema.org
          >
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default MeetingCard
