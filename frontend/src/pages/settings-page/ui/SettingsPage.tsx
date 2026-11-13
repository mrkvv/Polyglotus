import { useState, useEffect } from 'react'
import { Typography, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Box } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import LogoutIcon from '@mui/icons-material/Logout'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@app/store/store'
import { setTheme } from '@app/store/themeSlice'
import { useGetUserMeQuery, useUpdateUserAvatarMutation, useUpdateUserLevelMutation } from '@entities/user/api/uesrApi'
import { useGetReferencesQuery } from '@entities/reference'
import { useLogoutMutation } from '@features/auth/api/authApi'
import './SettingsPage.scss'
import { useNavigate } from 'react-router-dom'

export function SettingsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.theme.theme)

  const { data: user, isLoading: userLoading } = useGetUserMeQuery()
  const { data: references, isLoading: refsLoading } = useGetReferencesQuery()

  const [updateAvatar] = useUpdateUserAvatarMutation()
  const [updateLevel] = useUpdateUserLevelMutation()
  const [logout] = useLogoutMutation()

  // Локальное состояние инициализируем из данных пользователя после загрузки
  const [avatarId, setAvatarId] = useState<number | null>(null)
  const [levelId, setLevelId] = useState<number | null>(null)
  const [pendingAvatarId, setPendingAvatarId] = useState<number | null>(null)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  // Синхронизируем локальный стейт с данными с сервера при первой загрузке
  useEffect(() => {
    if (user) {
      setAvatarId(user.avatarId)
      setLevelId(user.levelId)
    }
  }, [user])

  const handleOpenAvatarModal = () => {
    setPendingAvatarId(avatarId)
    setIsAvatarModalOpen(true)
  }

  const handleConfirmAvatar = async () => {
    if (pendingAvatarId !== null) {
      await updateAvatar(pendingAvatarId)
      setAvatarId(pendingAvatarId)
    }
    setIsAvatarModalOpen(false)
  }

  const handleSelectLevel = async (id: number) => {
    setLevelId(id)
    await updateLevel(id)
  }

  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false)
    await logout()
    localStorage.removeItem('token')
    navigate('/login')
  }

  if (userLoading || refsLoading) {
    return (
      <Box className="SettingsPage" sx={{ justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  const currentAvatarSvg = references?.avatars.find((a) => a.id === avatarId)?.svg

  return (
    <div className="SettingsPage">
      {/* Аватар */}
      <div className="SettingsPage__AvatarBlock">
        <button
          className="SettingsPage__AvatarWrapper"
          onClick={handleOpenAvatarModal}
          aria-label="Изменить аватар"
        >
          {currentAvatarSvg ? (
            <div
              className="SettingsPage__Avatar"
              dangerouslySetInnerHTML={{ __html: currentAvatarSvg }}
            />
          ) : (
            <div className="SettingsPage__Avatar SettingsPage__Avatar--placeholder" />
          )}
          <span className="SettingsPage__AvatarEdit">
            <EditIcon sx={{ fontSize: 16, color: '#fff' }} />
          </span>
        </button>
        <Typography variant="h5" className="SettingsPage__Username">
          {user?.firstName} {user?.lastName}
        </Typography>
      </div>

      {/* Тема приложения */}
      <section className="SettingsPage__Section">
        <Typography variant="h4" className="SettingsPage__SectionTitle">
          Тема приложения
        </Typography>
        <div className="SettingsPage__ThemeRow">
          <button
            className={`SettingsPage__ThemeOption${theme === 'light' ? ' SettingsPage__ThemeOption--selected' : ''}`}
            onClick={() => dispatch(setTheme('light'))}
            aria-label="Светлая тема"
            aria-pressed={theme === 'light'}
          >
            <span className="SettingsPage__ThemeSwatch SettingsPage__ThemeSwatch--light" />
            <Typography variant="body2">Светлая</Typography>
          </button>
          <button
            className={`SettingsPage__ThemeOption${theme === 'dark' ? ' SettingsPage__ThemeOption--selected' : ''}`}
            onClick={() => dispatch(setTheme('dark'))}
            aria-label="Тёмная тема"
            aria-pressed={theme === 'dark'}
          >
            <span className="SettingsPage__ThemeSwatch SettingsPage__ThemeSwatch--dark" />
            <Typography variant="body2">Тёмная</Typography>
          </button>
        </div>
      </section>

      {/* Уровень знаний */}
      <section className="SettingsPage__Section">
        <Typography variant="h4" className="SettingsPage__SectionTitle">
          Уровень знаний
        </Typography>
        <Paper className="SettingsPage__LevelsPaper" variant="outlined" square={false}>
          <div className="SettingsPage__LevelsGrid">
            {references?.levels.map((level) => (
              <button
                key={level.id}
                className={`SettingsPage__LevelChip${levelId === level.id ? ' SettingsPage__LevelChip--selected' : ''}`}
                onClick={() => handleSelectLevel(level.id)}
                aria-pressed={levelId === level.id}
              >
                {level.name}
              </button>
            ))}
          </div>
        </Paper>
      </section>

      {/* Выйти */}
      <button
        className="SettingsPage__LogoutBtn"
        onClick={() => setIsLogoutModalOpen(true)}
      >
        <Typography variant="body1">Выйти из учётной записи</Typography>
        <LogoutIcon sx={{ fontSize: 20 }} />
      </button>

      {/* Модалка: выбор аватара */}
      <Dialog
        open={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px', padding: '24px', minWidth: 640 } }}
      >
        <div className="SettingsPage__AvatarModal">
          <div className="SettingsPage__AvatarModal__Grid">
            {references?.avatars.map((avatar) => (
              <button
                key={avatar.id}
                className={`SettingsPage__AvatarModal__Slot${pendingAvatarId === avatar.id ? ' SettingsPage__AvatarModal__Slot--selected' : ''}`}
                onClick={() => setPendingAvatarId(avatar.id)}
                aria-label={`Аватар ${avatar.id}`}
                aria-pressed={pendingAvatarId === avatar.id}
              >
                <div dangerouslySetInnerHTML={{ __html: avatar.svg }} />
              </button>
            ))}
          </div>
          <Button
            variant="contained"
            size="large"
            onClick={handleConfirmAvatar}
            disabled={pendingAvatarId === null}
            sx={{
              marginTop: '24px',
              textTransform: 'uppercase',
              fontSize: 15,
              fontWeight: 700,
              backgroundColor: '#2E7D32',
              color: '#ffffff',
              borderRadius: '24px',
              paddingX: '40px',
              '&:hover': { backgroundColor: '#1B5E20' },
            }}
          >
            Продолжить
          </Button>
        </div>
      </Dialog>

      {/* Модалка: подтверждение выхода */}
      <Dialog
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        sx={{ borderRadius: '16px', padding: '8px' }}
      >
        <DialogTitle>Выйти из учётной записи?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Вы уверены, что хотите выйти?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsLogoutModalOpen(false)} color="inherit">
            Нет
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            sx={{ color: '#2E7D32', fontWeight: 700 }}
          >
            Да
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
