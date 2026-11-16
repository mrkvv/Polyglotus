import { useState, useCallback } from 'react'
import { Typography, Paper, Button, Box, CircularProgress } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import './WordToTranslationPage.scss'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGetSimpleTrainingQuery } from '../../api/trainingApi'
import { useIncrementWordProgressMutation } from '@entities/vocabulary/api/vocabularyApi'

const AMOUNT = 5

export function WordToTranslationPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [taskIndex, setTaskIndex] = useState(0)
  // Набор опций, которые уже отмечены неверными для текущего задания
  const [wrongOptions, setWrongOptions] = useState<Set<string>>(new Set())
  const [correctOption, setCorrectOption] = useState<string | null>(null)
  const [isDone, setIsDone] = useState(false)
  // Флаг: была ли первая попытка на текущем задании ошибочной
  const [firstAttemptWrong, setFirstAttemptWrong] = useState(false)
  // id слов, угаданных с первой попытки
  const [correctIds, setCorrectIds] = useState<number[]>([])

  const { data, isLoading, isError, refetch } = useGetSimpleTrainingQuery({ to: 'ru', amount: AMOUNT })
  const [incrementWordProgress] = useIncrementWordProgressMutation()

  const tasks = data?.tasks ?? []
  const currentTask = tasks[taskIndex]

  const handleOptionClick = useCallback((option: string) => {
    // Уже выбран верный — ничего не делаем
    if (correctOption !== null) return
    // Повторный клик по уже красному варианту — игнорируем
    if (wrongOptions.has(option)) return

    const isCorrect = option === currentTask.answer

    if (isCorrect) {
      setCorrectOption(option)

      // Собираем id для incrementWordProgress только если первая попытка верная
      if (!firstAttemptWrong) {
        setCorrectIds((prev) => [...prev, currentTask.id])
      }

      setTimeout(() => {
        if (taskIndex + 1 >= tasks.length) {
          // Тренировка завершена — отправляем прогресс
          const nextCorrectIds = firstAttemptWrong
            ? correctIds
            : [...correctIds, currentTask.id]

          if (nextCorrectIds.length > 0) {
            incrementWordProgress({ ids: nextCorrectIds })
          }
          setIsDone(true)
        } else {
          setTaskIndex((i) => i + 1)
          setCorrectOption(null)
          setWrongOptions(new Set())
          setFirstAttemptWrong(false)
        }
      }, 800)
    } else {
      // Первая ошибка на этом задании
      if (wrongOptions.size === 0) {
        setFirstAttemptWrong(true)
      }
      setWrongOptions((prev) => new Set(prev).add(option))
    }
  }, [correctOption, wrongOptions, currentTask, taskIndex, tasks.length, firstAttemptWrong, correctIds, incrementWordProgress])

  const handleContinue = () => {
    setTaskIndex(0)
    setCorrectOption(null)
    setWrongOptions(new Set())
    setFirstAttemptWrong(false)
    setCorrectIds([])
    setIsDone(false)
    refetch()
  }

  const handleGoHome = () => {
    navigate('/trainings')
  }

  const getButtonVariant = (option: string): 'outlined' | 'contained' => {
    if (option === correctOption) return 'contained'
    if (wrongOptions.has(option)) return 'contained'
    return 'outlined'
  }

  const getButtonClass = (option: string): string => {
    const base = 'WordToTranslationPage__Card__Options__Btn'
    if (option === correctOption) return `${base} ${base}--correct`
    if (wrongOptions.has(option)) return `${base} ${base}--wrong`
    return base
  }

  const isOptionDisabled = (option: string): boolean => {
    if (correctOption !== null) return true
    return false
  }

  return (
    <div className="WordToTranslationPage">
      <div className="WordToTranslationPage__Header">
        <Typography className="WordToTranslationPage__Header__Title" variant="h3">
          {t('training_word_to_translation')}
        </Typography>
      </div>

      <div className="WordToTranslationPage__Content">
        <Typography className="WordToTranslationPage__Content__Description" variant="h5">
          {t('training_word_to_translation_desc')}
        </Typography>

        <Paper className="WordToTranslationPage__Card" variant="outlined" square={false}>

          {isLoading && (
            <Box className="WordToTranslationPage__Card__Center">
              <CircularProgress />
            </Box>
          )}

          {isError && (
            <Box className="WordToTranslationPage__Card__Center">
              <Typography variant="h5" color="error">
                {t('training_load_error')}
              </Typography>
            </Box>
          )}

          {isDone && (
            <Box className="WordToTranslationPage__Card__Done">
              <Typography variant="h3" sx={{fontWeight: 700}} className="WordToTranslationPage__Card__Done__Title">
                {t('training_complete_title')}
              </Typography>
              <Typography variant="h5" className="WordToTranslationPage__Card__Done__Subtitle">
                {t('training_complete_word_to_translation')}
              </Typography>
              <Box className="WordToTranslationPage__Card__Done__Actions">
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIosNewIcon />}
                  onClick={handleContinue}
                  className="WordToTranslationPage__Card__Done__Btn"
                  sx={{ borderRadius: '999px', textTransform: 'none' }}
                >
                  {t('training_continue')}
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForwardIosIcon />}
                  onClick={handleGoHome}
                  className="WordToTranslationPage__Card__Done__Btn"
                  sx={{ borderRadius: '999px', textTransform: 'none' }}
                >
                  {t('training_go_home')}
                </Button>
              </Box>
            </Box>
          )}

          {!isLoading && !isError && !isDone && currentTask && (
            <>
              <Box className="WordToTranslationPage__Card__Center">
                <Typography variant="h1" sx={{fontWeight: 700}}>
                  {currentTask.word}
                </Typography>
              </Box>

              <Box className="WordToTranslationPage__Card__Options">
                {currentTask.options.map((option) => (
                  <Button
                    key={option}
                    variant={getButtonVariant(option)}
                    className={getButtonClass(option)}
                    disabled={isOptionDisabled(option)}
                    onClick={() => handleOptionClick(option)}
                    sx={{ borderRadius: '999px', textTransform: 'none', fontSize: '1.5rem', px: 3, py: 1 }}
                  >
                    {option}
                  </Button>
                ))}
              </Box>

              <Typography
                className="WordToTranslationPage__Card__Progress"
                variant="h4"
                sx={{fontWeight: 700}}
              >
                {taskIndex + 1}/{tasks.length}
              </Typography>
            </>
          )}

        </Paper>
      </div>
    </div>
  )
}
