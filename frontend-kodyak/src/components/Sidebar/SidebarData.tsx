import React from 'react'
import AddBoxIcon from '@mui/icons-material/AddBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function SidebarData() {
  return (
    [
        {
            title: "Dashboard",
            icon: <DashboardIcon />,
            link: "/dashboard"
        },
        {
            title: "Cadastros",
            icon: <AddBoxIcon />,
            link: "/cadastros"
        },
        {
            title: "Pedidos",
            icon: <ShoppingCartIcon />,
            link: "/pedidos"
        }
    ]
  )
}

export default SidebarData