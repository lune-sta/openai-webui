import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { createTheme, Shadows, ThemeProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ChatIcon from '@mui/icons-material/Chat'
import shadows from '@mui/material/styles/shadows'
import MyAppBar, { drawerWidth } from './components/MyAppBar'
import MyDrawer from './components/MyDrawer'
import Loader from './components/Loader'
import Chat from './Chat'
import { useWindowSize } from './states/windowSize'
import { loadingAtom, userIdAtom } from './states/atoms'

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
  },
  typography: {},
  shadows: shadows.map(() => 'none') as Shadows,
})

export default function App() {
  const [width, _] = useWindowSize()
  const [isLoading] = useAtom(loadingAtom)
  const [, setUserId] = useAtom(userIdAtom)

  useEffect(() => {
    // 初回アクセス時に UserID を生成する
    let currentUserId = localStorage.getItem('userId')
    if (!currentUserId) {
      currentUserId = uuidv4()
      localStorage.setItem('userId', currentUserId)
    }
    setUserId(currentUserId)
  }, [])

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem key="New Chat" disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary="New Chat" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </div>
  )

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {isLoading && <Loader />}
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <MyAppBar />
          <MyDrawer>{drawer}</MyDrawer>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: { sm: `calc(${width}px - ${drawerWidth}px)` },
            }}
          >
            <Toolbar />
            <Chat />
          </Box>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  )
}
