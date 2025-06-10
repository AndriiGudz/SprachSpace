import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  FormHelperText,
  CircularProgress,
  Alert,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import {
  containerStyle,
  createButtonStyle,
  filterItemStyle,
  loaderWrapperStyle,
} from './styles'
import {
  createRoomSchema,
  CreateRoomFormData,
} from '../../validationSchemas/CreateRoomSchema'
import type { RootState, AppDispatch } from '../../store/store'
import Loader from '../Loader/Loader'
import {
  createRoom,
  clearRoomError,
} from '../../store/redux/roomSlice/roomSlice'
import {
  CreateRoomApiRequest,
  ApiRoom,
} from '../../store/redux/roomSlice/roomTypes'
import { getAllCategories, Category } from '../../api/categoryApi'
import { getAllLanguages, Language } from '../../api/languageApi'

const LEVEL_OPTIONS = [
  { value: 'beginner', labelKey: 'createRoomForm.levels.beginner' },
  { value: 'intermediate', labelKey: 'createRoomForm.levels.intermediate' },
  { value: 'advanced', labelKey: 'createRoomForm.levels.advanced' },
]

export type Room = {
  id: number
  name: string
  category: string
  openAt: Date
  closeAt: Date
  minParticipants: number
  maxParticipants?: number
  ageLimit?: number
  roomUrl: string
  language: string
  proficiency: string | null
  privateRoom: boolean
}

type Props = {
  onRoomCreated: (room: Room) => void
}

const CreateRoomForm: React.FC<Props> = ({ onRoomCreated }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, id: userIdFromAuth } = useSelector(
    (state: RootState) => state.user
  )
  const { isLoading: isRoomCreating, error: roomCreationError } = useSelector(
    (state: RootState) => state.rooms
  )

  const [languages, setLanguages] = useState<Language[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [isLoadingLanguages, setIsLoadingLanguages] = useState<boolean>(true)
  const [languageError, setLanguageError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    control,
    watch,
  } = useForm<CreateRoomFormData>({
    resolver: yupResolver(createRoomSchema(t)) as any,
    mode: 'onChange',
    defaultValues: {
      name: '',
      category: '',
      language: '',
      proficiency: '',
      openAt: '',
      closeAt: '',
      minParticipants: 4,
      maxParticipants: null,
      ageLimit: null,
      privateRoom: false,
    },
  })

  const isPrivateRoom = watch('privateRoom')

  useEffect(() => {
    if (roomCreationError) {
      toast.error(roomCreationError)
      dispatch(clearRoomError())
    }
  }, [roomCreationError, dispatch])

  useEffect(() => {
    if (!isAuthenticated) {
      setLanguageError(t('common.unauthorized'))
      setIsLoadingLanguages(false)
      return
    }

    async function fetchLanguages() {
      try {
        setIsLoadingLanguages(true)
        const fetchedLanguages = await getAllLanguages()
        setLanguages(fetchedLanguages)
        setLanguageError(null)
      } catch (error) {
        console.error('Error fetching languages:', error)
        if (error instanceof Error) {
          setLanguageError(error.message)
        } else {
          setLanguageError(String(t('common.errorFetchingLanguages')))
        }
      } finally {
        setIsLoadingLanguages(false)
      }
    }

    fetchLanguages()
  }, [isAuthenticated, t])

  useEffect(() => {
    async function fetchCategories() {
      if (!isAuthenticated) {
        setCategoryError(t('common.unauthorized'))
        setIsLoadingCategories(false)
        return
      }
      try {
        setIsLoadingCategories(true)
        const fetchedCategories = await getAllCategories()
        setCategories(fetchedCategories)
        setCategoryError(null)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        if (error instanceof Error) {
          setCategoryError(error.message)
        } else {
          setCategoryError(
            t(
              'createRoomForm.errorFetchingCategories',
              'Error fetching categories'
            )
          )
        }
      } finally {
        setIsLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [isAuthenticated, t])

  const onSubmit: SubmitHandler<CreateRoomFormData> = async (data) => {
    if (!userIdFromAuth) {
      toast.error(t('common.unauthorized'))
      return
    }

    const roomApiRequest: CreateRoomApiRequest = {
      topic: data.name,
      startTime: new Date(data.openAt).toISOString(),
      endTime: new Date(data.closeAt).toISOString(),
      status: true,
      age:
        data.ageLimit === null || data.ageLimit === undefined
          ? 0
          : Number(data.ageLimit),
      language: data.language,
      languageLvl: data.proficiency,
      category: data.category,
      privateRoom: data.privateRoom,
      minQuantity: data.minParticipants,
      maxQuantity:
        data.maxParticipants === null
          ? data.minParticipants
          : Number(data.maxParticipants),
    }

    try {
      const createdApiRoom = (await dispatch(
        createRoom({ roomData: roomApiRequest, userId: String(userIdFromAuth) })
      ).unwrap()) as ApiRoom

      toast.success(t('createRoomForm.roomCreatedSuccess'))

      onRoomCreated({
        id: createdApiRoom.id,
        name: createdApiRoom.topic,
        category: createdApiRoom.category.name,
        openAt: new Date(createdApiRoom.startTime),
        closeAt: new Date(createdApiRoom.endTime),
        minParticipants: createdApiRoom.minQuantity,
        maxParticipants: createdApiRoom.maxQuantity,
        ageLimit: createdApiRoom.age,
        roomUrl: createdApiRoom.roomUrl,
        language: createdApiRoom.language,
        proficiency: createdApiRoom.languageLvl,
        privateRoom: createdApiRoom.privateRoom,
      })

      reset()
    } catch (error: any) {
      console.error('Failed to create room (onSubmit):', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <Box sx={containerStyle}>
        <Typography variant="h6" color="error">
          {t('common.pleaseLogin')}
        </Typography>
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={containerStyle}>
      {isRoomCreating && (
        <Box sx={loaderWrapperStyle}>
          <Loader />
        </Box>
      )}
      <Typography variant="h3" gutterBottom>
        {t('createRoomForm.createRoom')}
      </Typography>

      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <TextField
          variant="outlined"
          label={`${t('createRoomForm.roomName')}*`}
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          sx={filterItemStyle}
          disabled={isRoomCreating}
        />

        <Controller
          name="category"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              select
              variant="outlined"
              label={`${t('createRoomForm.category')}*`}
              {...field}
              error={!!errors.category}
              helperText={errors.category?.message}
              sx={filterItemStyle}
              disabled={
                isLoadingCategories || !!categoryError || isRoomCreating
              }
              fullWidth
            >
              {isLoadingCategories && (
                <MenuItem value="" disabled>
                  <CircularProgress size={20} />
                  &nbsp;{t('common.loading')}
                </MenuItem>
              )}
              {categoryError && (
                <MenuItem value="" disabled>
                  <Alert
                    severity="error"
                    sx={{ width: '100%', boxSizing: 'border-box' }}
                  >
                    {categoryError}
                  </Alert>
                </MenuItem>
              )}
              {!isLoadingCategories &&
                !categoryError &&
                categories.length === 0 && (
                  <MenuItem value="" disabled>
                    {t(
                      'createRoomForm.noCategoriesAvailable',
                      'No categories available'
                    )}
                  </MenuItem>
                )}
              {!isLoadingCategories &&
                !categoryError &&
                categories.length > 0 && (
                  <MenuItem value="" disabled>
                    <em>
                      {t(
                        'createRoomForm.selectCategoryPlaceholder',
                        'Select a category'
                      )}
                    </em>
                  </MenuItem>
                )}
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <TextField
            variant="outlined"
            label={`${t('createRoomForm.roomLanguage')}*`}
            select
            {...register('language')}
            error={!!errors.language}
            helperText={errors.language?.message}
            sx={filterItemStyle}
            disabled={isRoomCreating || isLoadingLanguages || !!languageError}
            defaultValue=""
          >
            {isLoadingLanguages && (
              <MenuItem value="" disabled>
                <CircularProgress size={20} />
                &nbsp;{t('common.loading')}
              </MenuItem>
            )}
            {languageError && (
              <MenuItem value="" disabled>
                <Alert
                  severity="error"
                  sx={{ width: '100%', boxSizing: 'border-box' }}
                >
                  {
                    languageError /* Linter should be fine as this block is only entered if languageError is not null (truthy) */
                  }
                </Alert>
              </MenuItem>
            )}
            {!isLoadingLanguages &&
              !languageError &&
              languages.length === 0 && (
                <MenuItem value="" disabled>
                  {t(
                    'createRoomForm.noLanguagesAvailable',
                    'No languages available'
                  )}
                </MenuItem>
              )}
            {!isLoadingLanguages && !languageError && languages.length > 0 && (
              <MenuItem value="" disabled>
                <em>
                  {t(
                    'createRoomForm.selectLanguagePlaceholder',
                    'Select a language'
                  )}
                </em>
              </MenuItem>
            )}
            {languages.map((lang) => (
              <MenuItem key={lang.id} value={lang.name}>
                {lang.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            variant="outlined"
            label={`${t('createRoomForm.proficiency')}*`}
            select
            {...register('proficiency')}
            error={!!errors.proficiency}
            helperText={errors.proficiency?.message}
            sx={filterItemStyle}
            disabled={isRoomCreating}
            defaultValue=""
          >
            {LEVEL_OPTIONS.map((level) => (
              <MenuItem key={level.value} value={level.value}>
                {t(level.labelKey)}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <TextField
            variant="outlined"
            label={`${t('createRoomForm.openTime')}*`}
            type="datetime-local"
            {...register('openAt')}
            error={!!errors.openAt}
            helperText={errors.openAt?.message}
            InputLabelProps={{ shrink: true }}
            sx={filterItemStyle}
            disabled={isRoomCreating}
          />

          <TextField
            variant="outlined"
            label={`${t('createRoomForm.closeTime')}*`}
            type="datetime-local"
            {...register('closeAt')}
            error={!!errors.closeAt}
            helperText={errors.closeAt?.message}
            InputLabelProps={{ shrink: true }}
            sx={filterItemStyle}
            disabled={isRoomCreating}
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <TextField
            variant="outlined"
            label={`${t('createRoomForm.minParticipants')}*`}
            type="number"
            {...register('minParticipants')}
            error={!!errors.minParticipants}
            helperText={errors.minParticipants?.message}
            sx={filterItemStyle}
            disabled={isRoomCreating}
            inputProps={{ min: 4 }}
          />

          <TextField
            variant="outlined"
            label={`${t('createRoomForm.maxParticipants')}*`}
            type="number"
            {...register('maxParticipants')}
            error={!!errors.maxParticipants}
            helperText={errors.maxParticipants?.message}
            sx={filterItemStyle}
            disabled={isRoomCreating}
            inputProps={{ min: 4, max: 100 }}
          />
        </Box>

        <TextField
          variant="outlined"
          label={t('createRoomForm.ageLimit')}
          type="number"
          {...register('ageLimit')}
          error={!!errors.ageLimit}
          helperText={
            errors.ageLimit?.message ||
            t(
              'createRoomForm.ageLimitHelperText',
              'Оставьте пустым для открытого доступа (без ограничений)'
            )
          }
          placeholder={t('createRoomForm.ageLimitPlaceholder', 'Например: 18')}
          sx={filterItemStyle}
          disabled={isRoomCreating}
          inputProps={{ min: 0, max: 100 }}
        />

        <FormControlLabel
          control={
            <Controller
              name="privateRoom"
              control={control}
              render={({ field }) => (
                <Switch
                  {...field}
                  checked={field.value}
                  disabled={isRoomCreating}
                />
              )}
            />
          }
          labelPlacement="start"
          label={t('createRoomForm.privateRoomLabel')}
          sx={{
            alignSelf: 'flex-start',
            ml: 0,
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '500px',
          }}
        />
        <FormHelperText
          sx={{
            alignSelf: 'flex-start',
            mt: -0.5,
            mb: 1,
            width: '100%',
            maxWidth: '500px',
          }}
        >
          {isPrivateRoom
            ? t('createRoomForm.privateRoomHelperTextPrivate')
            : t('createRoomForm.privateRoomHelperTextPublic')}
        </FormHelperText>

        <Button
          type="submit"
          variant="contained"
          sx={createButtonStyle}
          disabled={isRoomCreating || !isValid || !isDirty}
        >
          {isRoomCreating
            ? t('common.loading')
            : t('createRoomForm.createRoomButton')}
        </Button>
      </Stack>
    </Box>
  )
}

export default CreateRoomForm
