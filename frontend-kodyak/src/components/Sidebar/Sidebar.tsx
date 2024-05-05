import './Sidebar.css'
import SidebarData from './SidebarData'

import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div>
        <ul className='SidebarData'>
            {SidebarData().map(item => {
              return (
                <Link to={item.link}>
                  <li>
                    <div>{item.icon}</div>
                    <div>{item.title}</div>
                  </li>
                </Link>
              )
            })}
        </ul>
    </div>
  )
}

export default Sidebar