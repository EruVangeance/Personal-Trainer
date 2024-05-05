import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import CustomerList from './components/CustomerList';
import TrainingList from './components/TrainingList';
import MyCalendar from './components/Calendar';
import Chart from './components/Chart';

function App() {
  const [activeComponent, setActiveComponent] = useState('CustomerList');
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const switchComponent = (component) => {
    setActiveComponent(component);
    closeMenu();
  };

  const getComponent = () => {
    switch (activeComponent) {
      case 'TrainingList': return <TrainingList />;
      case 'Calendar': return <MyCalendar />;
      case 'Chart': return <Chart />;
      default: return <CustomerList />;
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={openMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Navigation
          </Typography>
          <Menu
            id="navigation-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeMenu}
          >
            <MenuItem onClick={() => switchComponent('CustomerList')}>Customers</MenuItem>
            <MenuItem onClick={() => switchComponent('TrainingList')}>Trainings</MenuItem>
            <MenuItem onClick={() => switchComponent('Calendar')}>Calendar</MenuItem>
            <MenuItem onClick={() => switchComponent('Chart')}>Chart</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <main>
        {getComponent()}
      </main>
    </div>
  );
}

export default App;
