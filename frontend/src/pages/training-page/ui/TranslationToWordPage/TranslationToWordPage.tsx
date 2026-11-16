import { useState, useCallback } from 'react'
import { Typography, Paper, Button, Box, CircularProgress } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import './TranslationToWordPage.scss'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGetSimpleTrainingQuery } from '../../api/trainingApi'
import { useIncrementWordProgressMutation } from '@entities/vocabulary/api/vocabularyApi'

const AMOUNT = 5

export function TranslationToWordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [taskIndex, setTaskIndex] = useState(0)
  const [wrongOptions, setWrongOptions] = useState<Set<string>>(new Set())
  const [correctOption, setCorrectOption] = useState<string | null>(null)
  const [isDone, setIsDone] = useState(false)
  const [firstAttemptWrong, setFirstAttemptWrong] = useState(false)
  const [correctIds, setCorrectIds] = useState<number[]>([])

  const { data, isLoading, isError, refetch } = useGetSimpleTrainingQuery({ to: 'en', amount: AMOUNT })
  const [incrementWordProgress] = useIncrementWordProgressMutation()

  const tasks = data?.tasks ?? []
  const currentTask = tasks[taskIndex]

  const handleOptionClick = useCallback((option: string) => {
    if (correctOption !== null) return
    if (wrongOptions.has(option)) return

    const isCorrect = option === currentTask.answer

    if (isCorrect) {
      setCorrectOption(option)

      if (!firstAttemptWrong) {
        setCorrectIds((prev) => [...prev, currentTask.id])
      }

      setTimeout(() => {
        if (taskIndex + 1 >= tasks.length) {
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

  const handleGoTrainings = () => {
    navigate('/trainings')
  }

  const getButtonVariant = (option: string): 'outlined' | 'contained' => {
    if (option === correctOption) return 'contained'
    if (wrongOptions.has(option)) return 'contained'
    return 'outlined'
  }

  const getButtonClass = (option: string): string => {
    const base = 'TranslationToWordPage__Card__Options__Btn'
    if (option === correctOption) return `${base} ${base}--correct`
    if (wrongOptions.has(option)) return `${base} ${base}--wrong`
    return base
  }

  const isOptionDisabled = (): boolean => correctOption !== null

  return (
    <div className="TranslationToWordPage">
      <div className="TranslationToWordPage__Header">
        <Typography className="TranslationToWordPage__Header__Title" variant="h3">
          {t('training_translation_to_word')}
        </Typography>
      </div>

      <div className="TranslationToWordPage__Content">
        <Typography className="TranslationToWordPage__Content__Description" variant="h5">
          {t('training_translation_to_word_desc')}
        </Typography>

        <Paper className="TranslationToWordPage__Card" variant="outlined" square={false}>

          {isLoading && (
            <Box className="TranslationToWordPage__Card__Center">
              <CircularProgress />
            </Box>
          )}

          {isError && (
            <Box className="TranslationToWordPage__Card__Center">
              <Typography variant="h5" color="error">
                {t('training_load_error')}
              </Typography>
            </Box>
          )}

          {isDone && (
            <Box className="TranslationToWordPage__Card__Done">
              <Typography variant="h3" sx={{fontWeight: 700}} className="TranslationToWordPage__Card__Done__Title">
                {t('training_complete_title')}
              </Typography>
              <Typography variant="h5" className="TranslationToWordPage__Card__Done__Subtitle">
                {t('training_complete_translation_to_word')}
              </Typography>
              <Box className="TranslationToWordPage__Card__Done__Actions">
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIosNewIcon />}
                  onClick={handleContinue}
                  className="TranslationToWordPage__Card__Done__Btn"
                  sx={{ borderRadius: '999px', textTransform: 'none' }}
                >
                  {t('training_continue')}
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForwardIosIcon />}
                  onClick={handleGoTrainings}
                  className="TranslationToWordPage__Card__Done__Btn"
                  sx={{ borderRadius: '999px', textTransform: 'none' }}
                >
                  {t('training_go_home')}
                </Button>
              </Box>
            </Box>
          )}

          {!isLoading && !isError && !isDone && currentTask && (
            <>
              <Box className="TranslationToWordPage__Card__Center">
                <Typography variant="h1" sx={{fontWeight: 700}}>
                  {currentTask.word}
                </Typography>
              </Box>

              <Box className="TranslationToWordPage__Card__Options">
                {currentTask.options.map((option) => (
                  <Button
                    key={option}
                    variant={getButtonVariant(option)}
                    className={getButtonClass(option)}
                    disabled={isOptionDisabled()}
                    onClick={() => handleOptionClick(option)}
                    sx={{ borderRadius: '999px', textTransform: 'none', fontSize: '1.5rem', px: 3, py: 1 }}
                  >
                    {option}
                  </Button>
                ))}
              </Box>

              <Typography
                className="TranslationToWordPage__Card__Progress"
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
