import { useState, useRef, useCallback } from 'react'
import { Typography, Paper, Button, Box, TextField, CircularProgress } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import './FillSentencePage.scss'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGetFillSentenceTrainingQuery } from '../../api/trainingApi'
import { useIncrementWordProgressMutation } from '@entities/vocabulary/api/vocabularyApi'

const AMOUNT = 5

type InputState = 'idle' | 'correct' | 'wrong'

export function FillSentencePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [taskIndex, setTaskIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [inputState, setInputState] = useState<InputState>('idle')
  const [hintUsed, setHintUsed] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [correctIds, setCorrectIds] = useState<number[]>([])
  // Флаг: была ли хотя бы одна ошибка на текущем задании
  const hadError = useRef(false)

  const { data, isLoading, isFetching, isError, refetch } = useGetFillSentenceTrainingQuery({ amount: AMOUNT }, { refetchOnMountOrArgChange: true })
  const [incrementWordProgress] = useIncrementWordProgressMutation()

  const tasks = (data?.tasks ?? []).slice(0, 3)
  const currentTask = tasks[taskIndex]

  const goNext = useCallback((nextCorrectIds: number[]) => {
    setTimeout(() => {
      if (taskIndex + 1 >= tasks.length) {
        if (nextCorrectIds.length > 0) {
          incrementWordProgress({ ids: nextCorrectIds })
        }
        setIsDone(true)
      } else {
        setTaskIndex((i) => i + 1)
        setInputValue('')
        setInputState('idle')
        setHintUsed(false)
        setShowHint(false)
        hadError.current = false
      }
    }, 800)
  }, [taskIndex, tasks.length, incrementWordProgress])

  const handleCheck = useCallback(() => {
    if (inputState === 'correct') return
    const isCorrect = inputValue.trim().toLowerCase() === currentTask.answer.toLowerCase()

    if (isCorrect) {
      setInputState('correct')
      setShowHint(false)

      // Засчитываем прогресс только если не было ошибок и не использовалась подсказка
      const nextCorrectIds = (!hadError.current && !hintUsed)
        ? [...correctIds, currentTask.id]
        : correctIds

      if (!hadError.current && !hintUsed) setCorrectIds(nextCorrectIds)
      goNext(nextCorrectIds)
    } else {
      hadError.current = true
      setInputState('wrong')
    }
  }, [inputValue, inputState, currentTask, hintUsed, correctIds, goNext])

  const handleInputChange = (value: string) => {
    setInputValue(value)
    // Сбрасываем ошибку при вводе (F_Train_42 — пользователь переписывает)
    if (inputState === 'wrong') setInputState('idle')
  }

  const handleHint = () => {
    setHintUsed(true)
    setShowHint(true)
    hadError.current = true
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCheck()
  }

  const handleContinue = () => {
    setTaskIndex(0)
    setInputValue('')
    setInputState('idle')
    setHintUsed(false)
    setShowHint(false)
    setCorrectIds([])
    setIsDone(false)
    hadError.current = false
    refetch()
  }

  const getHelperText = (): string => {
    if (showHint) return t('fill_hint_correct', { answer: currentTask.answer })
    if (inputState === 'wrong') return t('fill_wrong_input')
    return ' '
  }

  return (
    <div className="FillSentencePage">
      <div className="FillSentencePage__Header">
        <Typography className="FillSentencePage__Header__Title" variant="h3">
          {t('training_fill')}
        </Typography>
      </div>

      <div className="FillSentencePage__Content">
        <Typography className="FillSentencePage__Content__Description" variant="h5">
          {t('training_fill_desc')}
        </Typography>

        <Paper className="FillSentencePage__Card" variant="outlined" square={false}>

          {(isLoading || isFetching) && (
            <Box className="FillSentencePage__Card__Center">
              <CircularProgress />
            </Box>
          )}

          {isError && (
            <Box className="FillSentencePage__Card__Center">
              <Typography variant="h5" color="error">
                {t('training_load_error')}
              </Typography>
            </Box>
          )}

          {isDone && (
            <Box className="FillSentencePage__Card__Done">
              <Typography variant="h3" sx={{ fontWeight: 700 }} className="FillSentencePage__Card__Done__Title">
                {t('training_complete_title')}
              </Typography>
              <Typography variant="h5" className="FillSentencePage__Card__Done__Subtitle">
                {t('training_complete_fill')}
              </Typography>
              <Box className="FillSentencePage__Card__Done__Actions">
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIosNewIcon />}
                  onClick={handleContinue}
                  className="FillSentencePage__Card__Done__Btn"
                  sx={{ borderRadius: '999px', textTransform: 'none' }}
                >
                  {t('training_continue')}
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForwardIosIcon />}
                  onClick={() => navigate('/trainings')}
                  className="FillSentencePage__Card__Done__Btn"
                  sx={{ borderRadius: '999px', textTransform: 'none' }}
                >
                  {t('training_go_home')}
                </Button>
              </Box>
            </Box>
          )}

          {!isLoading && !isFetching && !isError && !isDone && currentTask && (
            <>
              <Box className="FillSentencePage__Card__Center">
                <Typography variant="h5" className="FillSentencePage__Card__Sentence">
                  {currentTask.sentence}
                </Typography>

                <Box className="FillSentencePage__Card__Controls">
                  <TextField
                    label={t('fill_label')}
                    variant="outlined"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={inputState === 'correct'}
                    error={inputState === 'wrong'}
                    helperText={getHelperText()}
                    className={`FillSentencePage__Card__Controls__Input${showHint ? ' FillSentencePage__Card__Controls__Input--hint' : ''}`}
                    FormHelperTextProps={{
                      className: showHint
                        ? 'FillSentencePage__Card__Controls__HelperHint'
                        : undefined,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: '999px', fontSize: '1rem' },
                      '& .MuiInputLabel-root': { fontSize: '1rem' },
                      '& .MuiFormHelperText-root': { position: 'absolute', bottom: '-22px', whiteSpace: 'nowrap' },
                      position: 'relative',
                      mb: '22px',
                    }}
                  />

                  <Button
                    variant={inputState === 'correct' ? 'contained' : 'outlined'}
                    onClick={handleCheck}
                    disabled={!inputValue.trim()}
                    className={`FillSentencePage__Card__Controls__Check${inputState === 'correct' ? ' FillSentencePage__Card__Controls__Check--correct' : ''}`}
                    sx={{ borderRadius: '999px', textTransform: 'none', fontSize: '1rem', px: 3, py: 1, mb: '22px' }}
                  >
                    {t('check')}
                  </Button>

                  <Button
                    variant={hintUsed ? 'contained' : 'outlined'}
                    onClick={handleHint}
                    disabled={hintUsed}
                    className={`FillSentencePage__Card__Controls__Hint${hintUsed ? ' FillSentencePage__Card__Controls__Hint--used' : ''}`}
                    sx={{ borderRadius: '999px', textTransform: 'none', fontSize: '1rem', px: 3, py: 1, mb: '22px' }}
                  >
                    {t('hint')}
                  </Button>
                </Box>
              </Box>

              <Typography
                className="FillSentencePage__Card__Progress"
                variant="h4"
                sx={{ fontWeight: 700 }}
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
