import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import data from './data.json';


const App = () => {
  const [currentDate, setCurrentDate] = useState(moment().utc());
  const [timezone, setTimezone] = useState('UTC');
  const [schedule, setSchedule] = useState([]);

  const loadWeeklySchedule = () => {
    const startDate = currentDate.clone().startOf('week').subtract(1, 'day'); 
    const endDate = currentDate.clone().endOf('week').add(1, 'day'); // To include next week's Saturday

    const days = [];
    let currentDay = startDate.clone();

    while (currentDay.isBefore(endDate)) {
      if (currentDay.day() >= 1 && currentDay.day() <= 5) { // Monday to Friday
        const times = Array.from({ length: 16 }, (_, index) => {
          const time = currentDay.clone().startOf('day').add(8, 'hours').add(index, 'hours');
          return { time: time.format('HH:mm'), checked: false };
        });
        days.push({
          date: currentDay.clone().format('YYYY-MM-DD'),
          times: times
        });
      }
      currentDay.add(1, 'day');
    }

    setSchedule(days);
  };
  
  const isBooked =  (day, time) =>{
    let result =  data.filter((item) => {
      
      return item.date === day.date && time.time === item.time ;

    })
    console.log(result);
    if (result.length === 0)
    return false
    else
    return true
   

    
  }

  // Function to handle moving to previous week
  const moveToPreviousWeek = () => {
    setCurrentDate(prevDate => prevDate.clone().subtract(1, 'week'));
  };

  // Function to handle moving to next week
  const moveToNextWeek = () => {
    setCurrentDate(prevDate => prevDate.clone().add(1, 'week'));
  };

  // Function to handle timezone change
  const handleTimezoneChange = (e) => {
    const selectedTimezone = e.target.value;
    setTimezone(selectedTimezone);
    moment.tz.setDefault(selectedTimezone);
    setCurrentDate(moment().utc());
  };

    // Initial load
  useEffect(() => {
    loadWeeklySchedule();
  }, []); // Runs only once on mount

  // Re-load schedule whenever currentDate or timezone changes
  useEffect(() => {
    loadWeeklySchedule();
  }, [currentDate, timezone]);

  return (
    <div style={{maxWidth:"800px", margin:"auto"}} >
      <div style={{display:"flex", justifyContent:"space-evenly" }} >
        <button onClick={moveToPreviousWeek}>Previous</button>
        <div>{moment().format("MMM Do YY")}</div>
        <button onClick={moveToNextWeek}>Next</button>
      </div> <br />
      <div>
        <select value={timezone} onChange={handleTimezoneChange}>
          <option value="UTC">UTC</option>
          <option value="America/New_York">America/New_York</option>
          {/* Add more timezones as needed */}
        </select>
      </div> <br />
      <div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              {schedule[0]?.times.map((timeSlot, index) => (
                <th key={index}>{timeSlot.time}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.map((day, dayIndex) => (
              <tr key={dayIndex}>
                <td>{day.date}</td>
                {day.times.map((timeSlot, timeIndex) => (
                  <td key={timeIndex}>
                    <input
                      type="checkbox"
                      checked={isBooked(day, timeSlot)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;



