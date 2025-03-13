import AddBoxIcon from '@mui/icons-material/AddBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import LogoutIcon from '@mui/icons-material/Logout';
import { Feedback } from '@mui/icons-material';

function SidebarData() {
  return (
    [
        {
            title: "Avisos",
            icon: <NewspaperIcon />,
            link: "/avisos"
        },
        {
            title: "Dashboard",
            icon: <DashboardIcon />,
            link: "/nao_implementado"
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
        },
        {
            title: "Feedback",
            icon: <Feedback />,
            link: "/nao_implementado"
        },
        {
            title: "Config.",
            icon: <SettingsIcon />,
            link: "/nao_implementado"
        },
        {
            title: "Sair",
            icon: <LogoutIcon />,
            link: "/logout"
        }
    ]
  )
}

export default SidebarData