import { ReactNode } from 'react'
import Box from '@mui/material/Box'
import { drawerWidth } from './MyAppBar'
import Drawer from '@mui/material/Drawer'

interface MyDrawerProps {
  children: ReactNode
}
export default function MyDrawer({ children }: MyDrawerProps) {
  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {children}
      </Drawer>
    </Box>
  )
}
