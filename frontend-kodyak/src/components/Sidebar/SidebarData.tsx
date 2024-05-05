import React from 'react'
import AddBoxIcon from '@mui/icons-material/AddBox';
import DashboardIcon from '@mui/icons-material/Dashboard';

function SidebarData() {
  return (
    [
        {
            title: "Dashboard",
            icon: <DashboardIcon />,
            link: ""
        },
        {
            title: "Cadastros",
            icon: <AddBoxIcon />,
            link: ""
        }
    ]
  )
}

export default SidebarData