import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import IconButton from '@mui/material/IconButton';
import CalendarIcon from '@mui/icons-material/Event';

import moment from 'moment';

// todo when you convert this to TS, combine the games + picks navbar components into here, since they have the same logic

const DateAppBar = (props) => {
  const theme = useTheme();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calAncor, setCalAncor] = useState(null);

  const AppBarStyles = props.styles || {};

  const dates = props.dates;

  // for speed look ups
  const tabDatesObject = {};

  for (let i = 0; i < dates.length; i++) {
    tabDatesObject[dates[i]] = true;
  }

  let tabComponents = [];
  for (let i = 0; i < dates.length; i++) {
    let label = moment(dates[i]).format('MMM D');
    if (dates[i] === moment().format('YYYY-MM-DD')) {
      label = 'TODAY';
    } else if (
      dates[i] === moment().add(1,'days').format('YYYY-MM-DD') ||
      dates[i] === moment().add(2,'days').format('YYYY-MM-DD') ||
      dates[i] === moment().add(3,'days').format('YYYY-MM-DD')
    ) {
      label = moment(dates[i]).format('ddd');
    }
    let ref_ = null;
    if (dates[i] === props.selectedDate) {
      ref_ = props.scrollRef;
    }
    tabComponents.push(<Tab ref = {ref_} key = {dates[i]} value = {i} label = {label} sx = {{'fontSize': '12px', 'minWidth': 60}} />);
  }

  const tabIndex = dates.indexOf(props.selectedDate) > -1 ? dates.indexOf(props.selectedDate) : dates.length - 1;


  const toggleCalendar = (e) => {
    if (calendarOpen) {
      setCalAncor(null)
    } else {
      setCalAncor(e.currentTarget);
    }
    setCalendarOpen(!calendarOpen);
  }


  return (
    <AppBar position="fixed" style = {Object.assign({}, AppBarStyles, {'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light})}>
      <Toolbar variant = 'dense'>
        <Tabs value={tabIndex} onChange={props.tabsOnChange} variant="scrollable" scrollButtons = {true} allowScrollButtonsMobile = {false} indicatorColor="secondary" textColor="inherit" /* sx = {{'backgroundImage': 'linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255, 1) 90%)'}}*/>
          {tabComponents}
        </Tabs>
        <IconButton sx = {{'padding': 0}} onClick={toggleCalendar} color="inherit">
          <CalendarIcon />
        </IconButton>
        <Popover
          open={calendarOpen}
          anchorEl={calAncor}
          onClose={toggleCalendar}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              openTo="day"
              minDate = {dates[0]}
              maxDate = {dates[dates.length - 1]}
              value={props.selectedDate}
              shouldDisableDate = {(momentObj) => {
                if (!(momentObj.format('YYYY-MM-DD') in tabDatesObject)) {
                  return true;
                }
                return false;
              }}
              onChange = {(momentObj) => {
                // required for some reason
              }}
              onAccept = {(momentObj) => {
                props.calendarOnAccept(momentObj);
                toggleCalendar();
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Popover>
      </Toolbar>
    </AppBar>
  );
}

export default DateAppBar;

