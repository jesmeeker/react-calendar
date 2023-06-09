// import "@progress/kendo-theme-default/dist/all.css";
// import "./App.css";
// // import PickDateOfBirth from "./components/calendar/PickDateOfBirth";
// import BookAppointment from "./components/calendar/BookAppointment";

// function App() {
//   return (
//     <div className="App">
//       {/* <PickDateOfBirth /> */}
//       <hr className="k-my-8" />
//       <BookAppointment />
//     </div>
//   );
// }

// export default App

import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import './App.css';
import Times from './components/calendar/Times';
import DailyCalendar from './components/calendar/DailyCalendar';
import { MultiSelect } from '@progress/kendo-react-dropdowns';
import New from './components/calendar/New';
import axios from 'axios';

function App() {

  const [date, setDate] = useState(new Date());
  const [showTime, setShowTime] = useState(false)
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(0)
  const [apptLength, setLength] = useState(0)
  let lengths = [{ id: 15, label: '15 minutes' }, { id: 30, label: '30 minutes' }, { id: 45, label: '45 minutes' }, { id: 60, label: '60 minutes' }]





  const getAccessToken = async () => {
    let urly = 'https://c1hby202.caspio.com/oauth/token';
    try {
      const resp = await axios.post(urly, 'grant_type=client_credentials&client_id=4cb05b2155f045d55244b1ca62a81b4def37241179198cc156&client_secret=3a0fde63c55e4802b47839f3217fa2939fa3a4e719afffb031');
      let myAccessToken = resp.data.access_token;
      getUsersData(myAccessToken)
    } catch (err) {
      console.error(err);
    }
  };

  const getUsersData = (myAccessToken) => {
    let url2 = 'https://c1hby202.caspio.com/rest/v2/tables/CL_Users/records';
    try {
      const resp = axios.get(url2, {
        headers: {
          'Authorization': "Bearer " + myAccessToken
        }
      })
        .then(response => {
          setUsers(response.data.Result)
        })
    } catch (err) {
      console.error(err);
    }
  };


// useEffect(() => {
//   fetch("http://localhost:8000/users", {
//     headers: {
//       Authorization: `Token 0be249c88238743e5b4a7ac370b5145730c28e20`,
//     },
//   }).then((res) => res.json())
//     .then(data => setUsers(data))
// }, [])

const handleSubmit = () => {

}


const timeDisplay = () => {
  if (user !== 0 && apptLength !== 0) {
    return <>
      <h3>Choose a time:</h3><New date={date} user={user} apptLength={apptLength} />
      {/* <Times showTime={showTime} date={date} user={user} apptLength={apptLength} /> */}
    </>
  } else {
    return <></>
  }
}
useEffect(() => {
  getAccessToken()
}, [])

useEffect(() => {
  timeDisplay()
}, [date, user, apptLength])

// var getHdnFld = window.parent.document.getElementById('select[name="InsertRecordRoom"]').value;

return (
  <div className='app'>
    <h1 className='header'>Book an Appointment</h1>
    {/* <h1>{sRoom}</h1> */}
    <h3 className=''>Choose your provider: <div class="select">
      <select
        name="user"
        className=""
        onChange={(event) => {
          setUser(event.target.value)
        }}>
        <option key="user--0"
          value="0">Select Provider</option>
        {users.map(user => (
          <option
            key={`user--${user.id}`}
            value={user.First_Name}>
            {user.First_Name}
          </option>
        ))}
      </select>
    </div></h3>
    <h3>Choose a date:</h3>
    <div>
      <Calendar onChange={setDate} value={date} onClickDay={() => setShowTime(true)} />
    </div>

    {/* {date.length > 0 ? (
        <p>
          <span>Start:</span>
          {date[0].toDateString()}
          &nbsp;
          &nbsp;
          <span>End:</span>{date[1].toDateString()}
        </p>
      ) : (
        <p>
          <span>Default selected date:</span>{date.toDateString()}
        </p>
      )
      } */}
    <h3>Choose an appointment length:</h3>
    <select
      name="user"
      className=""
      onChange={(event) => {
        setLength(parseInt(event.target.value))
      }}>
      <option key="length--0"
        value="0">Select Length</option>
      {lengths.map(length => (
        <option
          key={`category--${length.id}`}
          value={length.id}>
          {length.label}
        </option>
      ))}
    </select>
    <div>
      {
        timeDisplay()
      }
    </div>
    {/* <DailyCalendar /> */}

  </div>
)
}

export default App;

// let sRoom = window.parent.document.querySelector('select[name="InsertRecordRoom"]');
//   sRoom.addEventListener('change', function (event) {
//     let selectedRoom = window.parent.document.querySelector('select[name="InsertRecordRoom"]').value;
//     console.log(selectedRoom)
//     window.parent.document.querySelector('input[name="InsertRecordPerson"]').value = selectedRoom;
//   })