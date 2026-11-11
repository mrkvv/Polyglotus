// src/widgets/sidebar/ui/Sidebar.tsx
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography 
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import TaskIcon from '@mui/icons-material/Task';
import AssistantIcon from '@mui/icons-material/Assistant';
import StarIcon from '@mui/icons-material/Star';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.scss'

const drawerWidth = 240;

export function Sidebar() {
  const { t } = useTranslation()
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Главная', icon: <HomeIcon />, path: '/home' },
    { text: 'Тренировки', icon: <TaskIcon />, path: '/trainings' },
    { text: 'ИИ чат', icon: <AssistantIcon />, path: '/chat' },
    { text: 'Словарь', icon: <StarIcon />, path: '/dictionary' },
    { text: 'Настройки', icon: <SettingsIcon />, path: '/settings'  },
  ];

  return (
    <Drawer
      className='Sidebar'
      variant='permanent'
      anchor='left'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Typography className='Sidebar__Title' variant='h4'>
        {t('title')}
      </Typography>
      
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 3,
                  '&.Mui-selected': {
                    backgroundColor: '#E5F0D0',
                  },
                }}
              >
                <ListItemIcon >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{
                    fontSize: '1.1rem', 
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Drawer>
  )
}