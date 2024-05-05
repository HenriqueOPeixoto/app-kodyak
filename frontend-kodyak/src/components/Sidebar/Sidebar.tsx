import React from 'react'
import './Sidebar.css'
import SidebarData from './SidebarData'

function Sidebar() {
  return (
    <div>
        <ul className='SidebarData'>
            {SidebarData().map(item => {
              return (
                <li>
                  <div>{item.icon}</div>
                  <div>{item.title}</div>
                </li>
              )
            })}
        </ul>
    </div>
  )
}

export default Sidebar