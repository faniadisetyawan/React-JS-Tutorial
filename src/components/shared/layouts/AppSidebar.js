import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../../App';
import AppLogo from '../AppLogo';
import { Button, DropdownButton, Dropdown, Nav } from 'react-bootstrap';
import { VscMenu, VscDashboard, VscSymbolKeyword, VscTable } from 'react-icons/vsc';

export default function AppSidebar({ signout }) {
  const { config, user, toggleSidebar } = useApp();

  return (
    <div className="sidebar-wrapper bg-white border-end">
      <div className="sidebar-header">
        <div className="h-100 px-3 d-flex align-items-center justify-content-between">
          <div className="text-truncate">
            <AppLogo size={25} className="me-2" />
            <b>{config.appName}</b>
          </div>
          <div>
            <Button variant="outline-dark" className="border-0" onClick={toggleSidebar}>
              <VscMenu size={20} className="mb-1" />
            </Button>
          </div>
        </div>
      </div>

      <div className="sidebar-body">
        <div className="px-3">
          <Nav variant="pills" defaultActiveKey="/dashboard" className="flex-column">
            <Nav.Link as={NavLink} to="/dashboard">
              <div className="d-flex align-items-center">
                <VscDashboard size={20} className="me-2" />
                <div>Dashboard</div>
              </div>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/forms">
              <div className="d-flex align-items-center">
                <VscSymbolKeyword size={20} className="me-2" />
                <div>Forms</div>
              </div>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/table">
              <div className="d-flex align-items-center">
                <VscTable size={20} className="me-2" />
                <div>Tables</div>
              </div>
            </Nav.Link>
          </Nav>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="h-100 px-3 d-flex align-items-center justify-content-between">
          <div>
            <img
              src="https://randomuser.me/api/portraits/women/64.jpg"
              width={35}
              height={35}
              className="rounded-circle me-2"
              alt="Users pic"
            />
            {user.username}
          </div>
          <div>
            <DropdownButton
              id="dropdown-user-options"
              drop="up"
              variant="light"
              title=""
            >
              <Dropdown.Item>My Profile</Dropdown.Item>
              <Dropdown.Item>Manage Users</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={signout}>Sign out</Dropdown.Item>
            </DropdownButton>
          </div>
        </div>
      </div>
    </div>
  )
}
