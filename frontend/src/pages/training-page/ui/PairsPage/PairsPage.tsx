import { useState, useCallback, useMemo } from 'react'
import { Typography, Paper, Button, Box, CircularProgress } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import './PairsPage.scss'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGetPairsTrainingQuery } from '../../api/trainingApi'
import type { Pair } from '../../model/types'

import { useIncrementWordProgressMutation } from '@entities/vocabulary/api/vocabularyApi'

const AMOUNT = 3

export function PairsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [taskIndex, setTaskIndex] = useState(0)
  const [selectedEnId, setSelectedEnId] = useState<number | null>(null)
  const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set())
  const [wrongRuId, setWrongRuId] = useState<number | null>(null)
  const [isDone, setIsDone] = useState(false)
  // id EN-слов, по которым была ошибка хотя бы раз
  const [triedIds, setTriedIds] = useState<Set<number>>(new Set())
  // id пар, угаданных с первой попытки (накапливается по всем заданиям)
  const [correctIds, setCorrectIds] = useState<number[]>([])

  const { data, isLoading, isError, refetch } = useGetPairsTrainingQuery({ amount: AMOUNT })
  const [incrementWordProgress] = useIncrementWordProgressMutation()

  const tasks = data?.tasks ?? []
  const currentTask = tasks[taskIndex]
  const pairs: Pair[] = currentTask?.pairs ?? []

  // Перемешиваем переводы один раз при смене задания
  const shuffledTranslations = useMemo(() => {
    return [...pairs].sort(() => Math.random() - 0.5)
  }, [taskIndex, pairs.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleEnClick = useCallback((id: number) => {
    if (matchedIds.has(id)) return
    setSelectedEnId((prev) => (prev === id ? null : id))
    setWrongRuId(null)
  }, [matchedIds])

  const handleRuClick = useCallback((pair: Pair) => {
    if (matchedIds.has(pair.id)) return
    if (selectedEnId === null) return

    if (selectedEnId === pair.id) {
      // Верная пара — если EN не был в triedIds, записываем id
      const firstAttempt = !triedIds.has(pair.id)
      const newCorrectIds = firstAttempt ? [...correctIds, pair.id] : correctIds
      if (firstAttempt) setCorrectIds(newCorrectIds)

      const newMatched = new Set(matchedIds).add(pair.id)
      setMatchedIds(newMatched)
      setSelectedEnId(null)
      setWrongRuId(null)

      if (newMatched.size === pairs.length) {
        setTimeout(() => {
          if (taskIndex + 1 >= tasks.length) {
            if (newCorrectIds.length > 0) {
              incrementWordProgress({ ids: newCorrectIds })
            }
            setIsDone(true)
          } else {
            setTaskIndex((i) => i + 1)
            setMatchedIds(new Set())
            setSelectedEnId(null)
            setTriedIds(new Set())
          }
        }, 600)
      }
    } else {
      // Неверная пара — фиксируем ошибку для текущего EN
      setTriedIds((prev) => new Set(prev).add(selectedEnId))
      setWrongRuId(pair.id)
      setSelectedEnId(null)
      setTimeout(() => setWrongRuId(null), 800)
    }
  }, [selectedEnId, matchedIds, pairs.length, taskIndex, tasks.length, triedIds, correctIds, incrementWordProgress])

  const handleContinue = () => {
    setTaskIndex(0)
    setSelectedEnId(null)
    setMatchedIds(new Set())
    setWrongRuId(null)
    setTriedIds(new Set())
    setCorrectIds([])
    setIsDone(false)
    refetch()
  }

  const getEnClass = (pair: Pair): string => {
    const base = 'PairsPage__Card__Row__Btn'
    if (matchedIds.has(pair.id)) return `${base} ${base}--matched`
    if (selectedEnId === pair.id) return `${base} ${base}--selected-en`
    return `${base} ${base}--en`
  }

  const getRuClass = (pair: Pair): string => {
    const base = 'PairsPage__Card__Row__Btn'
    if (matchedIds.has(pair.id)) return `${base} ${base}--matched`
    if (wrongRuId === pair.id) return `${base} ${base}--wrong`
    return `${base} ${base}--ru`
  }

  return (
    <div className="PairsPage">
      <div className="PairsPage__Header">
        <Typography className="PairsPage__Header__Title" variant="h3">
          {t('training_pairs')}
        </Typography>
      </div>

      <div className="PairsPage__Content">
        <Typography className="PairsPage__Content__Description" variant="h5">
          {t('training_pairs_desc')}
        </Typography>

        <Paper className="PairsPage__Card" variant="outlined" square={false}>

          {isLoading && (
            <Box className="PairsPage__Card__Center">
              <CircularProgress />
            </Box>
          )}

          {isError && (
            <Box className="PairsPage__Card__Center">
              <Typography variant="h5" color="error">
                {t('training_load_error')}
              </Typography>
            </Box>
          )}

          {isDone && (
            <Box className="PairsPage__Card__Done">
              <Typography variant="h3" fontWeight={700} className="PairsPage__Card__Done__Title">
                {t('training_complete_title')}
              </Typography>
              <Typography variant="h5" className="PairsPage__Card__Done__Subtitle">
                {t('training_complete_pairs')}
              </Typography>
              <Box className="PairsPage__Card__Done__Actions">
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIosNewIcon />}
                  onClick={handleContinue}
                  className="PairsPage__Card__Done__Btn"
                  sx={{ borderRadius: '999px', textTransform: 'none' }}
                >
                  {t('training_continue')}
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForwardIosIcon />}
                  onClick={() => navigate('/home')}
                  className="PairsPage__Card__Done__Btn"
                  sx={{ borderRadius: '999px', textTransform: 'none' }}
                >
                  {t('training_go_home')}
                </Button>
              </Box>
            </Box>
          )}

          {!isLoading && !isError && !isDone && currentTask && (
            <>
              <Box className="PairsPage__Card__Center">
                {/* Ряд EN */}
                <Box className="PairsPage__Card__Row">
                  {pairs.map((pair) => (
                    <Button
                      key={`en-${pair.id}`}
                      variant={matchedIds.has(pair.id) || selectedEnId === pair.id ? 'contained' : 'outlined'}
                      className={getEnClass(pair)}
                      onClick={() => handleEnClick(pair.id)}
                      sx={{ borderRadius: '999px', textTransform: 'none', fontSize: '1rem', px: 3, py: 1 }}
                    >
                      {pair.word}
                    </Button>
                  ))}
                </Box>

                {/* Ряд RU — перемешанный */}
                <Box className="PairsPage__Card__Row">
                  {shuffledTranslations.map((pair) => (
                    <Button
                      key={`ru-${pair.id}`}
                      variant={matchedIds.has(pair.id) || wrongRuId === pair.id ? 'contained' : 'outlined'}
                      className={getRuClass(pair)}
                      onClick={() => handleRuClick(pair)}
                      sx={{ borderRadius: '999px', textTransform: 'none', fontSize: '1rem', px: 3, py: 1 }}
                    >
                      {pair.translation}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Typography
                className="PairsPage__Card__Progress"
                variant="h4"
                fontWeight={700}
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
