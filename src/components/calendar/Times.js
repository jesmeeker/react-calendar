import React from 'react'
import { useState } from 'react';
import Calendar from 'react-calendar';
import '../../../src/App.css'
import { date } from '@progress/kendo-react-dateinputs/dist/npm/messages';

// const time = ['08:00', '09:00', '10:00', '11:00', '12:00']
let time = []
function Times({apptLength, date}) {
    
    let startTimeField = ""
    let endTimeField = startTimeField + apptLength
    let dateField = date

    const [event, setEvent] = useState(null)
    const [info, setInfo] = useState(false)

    function displayInfo(e) {
        setInfo(true);
        setEvent(e.target.innerText);
    }

    return (

        <div className="times">
            {time.map(times => {
                return (
                    <div>
                        <button onClick={(e) => displayInfo(e)}> {times} </button>
                    </div>
                )
            })}
            <div>
                {info ? `Your appointment is set to ${event} ${date.toDateString()}` : null}
            </div>
        </div>
    )
}

export default Times;