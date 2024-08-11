import React from 'react'
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill}
 from 'react-icons/bs'
import LoginButton from '../auth/login'

function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
              logo
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item border-b'>
                <a href="">
                    UserProfile
                </a>
            </li>
            <li className='sidebar-list-item border-b'>
                <a href="">
                    Dashboard
                </a>
            </li>
            <li className='sidebar-list-item border-b'>
                <a href="">
                    Social Media Links
                </a>
            </li>
            <li className='sidebar-list-item border-b'>
                <a href="">
                    Coding Languages
                </a>
            </li>
            <li className='sidebar-list-item border-b'>
                <a href="">
                    Coding Stats
                </a>
            </li>
            <li className='sidebar-list-item border-b'>
                <a href="/profile-setup">
                    Profile Settings
                </a>
            </li>
            <li className='sidebar-list-item border-b'>
                <LoginButton />
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar
