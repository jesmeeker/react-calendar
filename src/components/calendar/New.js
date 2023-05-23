import React, { useEffect } from 'react';
import axios from 'axios';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Eventcalendar, Button, Select, Page, getJson, formatDate, confirm, toast, setOptions } from '@mobiscroll/react';

setOptions({
    theme: 'ios',
    themeVariant: 'light'
});

const contextMenu = [{
    text: 'Update',
    value: 'update'
}, {
    text: 'Delete',
    value: 'delete'
}];

function New({ date, user, apptLength }) {
    const [myEvents, setMyEvents] = React.useState([]);
    const [filteredEvents, setFilteredEvents] = React.useState([
        {start: "", end: ""}
    ]);
    const [mySelectedEvents, setSelectedEvents] = React.useState([]);
    // const [eventTitles, setEventTitles] = React.useState([]);
    const [eventTitles, setEventTitles] = React.useState([]);
    const { current: view } = React.useRef({ schedule: { type: 'day' } });
    const [firstDay, setFirstDay] = React.useState(date - 3);
    const [lastDay, setLastDay] = React.useState(date + 4);
    const [menuAnchor, setMenuAnchor] = React.useState();
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [selectedValue, setSelected] = React.useState(false);
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const calRef = React.useRef();

    const getSelectedEventTitles = React.useCallback((events) => {
        let titles = [];

        for (const event of events) {
            titles = [...titles, event.title];
        }
        return titles;
    }, []);

    useEffect(() => {
        setFirstDay(date)
        setLastDay(date)
    }, [date])

    const refreshSelectedEvents = React.useCallback((events) => {
        setSelectedEvents(events);
        setEventTitles(getSelectedEventTitles(events));
    }, [getSelectedEventTitles]);

    const deleteSelectedEvents = React.useCallback(() => {
        setConfirmOpen(true);
        confirm({
            title: 'Are you sure you want to delete the following events?',
            message: getSelectedEventTitles(mySelectedEvents).join(', '),
            okText: 'Delete',
            callback: (result) => {
                if (result) {
                    let eventsToUpdate = [...myEvents];

                    for (const event of mySelectedEvents) {
                        if (event.recurring) {
                            const origEvent = event.original;
                            let exc = origEvent.recurringException || [];
                            exc = [...exc, event.start_time];
                            origEvent.recurringException = exc;

                            // update the event in the list
                            const index = eventsToUpdate.findIndex(x => x.id === origEvent.id);;
                            eventsToUpdate.splice(index, 1, origEvent);
                        } else {
                            eventsToUpdate = eventsToUpdate.filter(ev => { return ev.id !== event.id });
                        }
                    }

                    setMyEvents(eventsToUpdate);
                    refreshSelectedEvents([]);

                    toast({
                        message: 'Deleted'
                    });
                }
                setConfirmOpen(false);
            }
        });
    }, [getSelectedEventTitles, myEvents, mySelectedEvents, refreshSelectedEvents]);
    
    let myAccessToken = ""

    const getAccessToken = async () => {
        let urly = 'https://c1hby202.caspio.com/oauth/token';
        try {
            const resp = await axios.post(urly, 'grant_type=client_credentials&client_id=4cb05b2155f045d55244b1ca62a81b4def37241179198cc156&client_secret=3a0fde63c55e4802b47839f3217fa2939fa3a4e719afffb031');
            let myAccessToken = resp.data.access_token;
            updateTableData(myAccessToken)
        } catch (err) {
            console.error(err);
        }
    };

    const getAccessToken2 = async () => {
        let urly = 'https://c1hby202.caspio.com/oauth/token';
        try {
            const resp = await axios.post(urly, 'grant_type=client_credentials&client_id=4cb05b2155f045d55244b1ca62a81b4def37241179198cc156&client_secret=3a0fde63c55e4802b47839f3217fa2939fa3a4e719afffb031');
            let myAccessToken = resp.data.access_token;
            getAppointmentData(myAccessToken)
        } catch (err) {
            console.error(err);
        }
    };

    const updateTableData = async (myAccessToken) => {
        let url2 = 'https://c1hby202.caspio.com/rest/v2/tables/CreateAppointment/records';
        let body = {
            "Room": 1,
            "Person": user,
            "DateStart": mySelectedEvents[0].DateStart,
            "DateEnd": mySelectedEvents[0].DateEnd
        }
        console.log(mySelectedEvents.DateStart)
        console.log(mySelectedEvents.DateEnd)
        try {
            const resp = await axios.post(url2, body, {
                headers: {
                    'accept': 'application/json',
                    'Authorization': "Bearer " + myAccessToken
                }
            });
            console.log(resp)
        } catch (err) {
            console.error(err);
        }
    }

    const getAppointmentData = async (myAccessToken) => {
        let url2 = 'https://c1hby202.caspio.com/rest/v2/tables/CreateAppointment/records';
        // let body = {
        //     "Room": 1,
        //     "Person": "Jessica"
        // }

        try {
            const resp = await axios.get(url2, {
                headers: {
                    // 'accept': 'application/json',
                    'Authorization': "Bearer " + myAccessToken
                }
            })
            // .then(resp => console.log(resp.data.Result))
            .then(response => {
                setMyEvents(response.data.Result)
                const filteredCopy = (response.data.Result.filter(d => parseInt(d.Appointment_Length) === apptLength))
                    filteredCopy.map(e => {
                                    e.start = e.DateStart
                                    e.end = e.DateEnd
                                    e.title = e.Title
                                    return e
                    })
                setFilteredEvents(filteredCopy)
                // const filteredCopy = {...myEvents}
                // filteredCopy.map(e => {
                //     e.start = e.DateStart
                //     e.end = e.DateEnd
                //     e.title = e.Title
                //     return e
                // })
                // const filteredCopy = myEvents.filter(d => parseInt(d.Appointment_Length) === apptLength)
                // filteredCopy.map(e => {
                //     e.start = e.DateStart
                //     e.end = e.DateEnd
                //     e.title = e.Title
                //     return e
                // })
                // setFilteredEvents(filteredCopy)
            })
                // .then(response => {
                //     setFilteredEvents(response.data.Result.filter(d => parseInt(d.Appointment_Length) === apptLength))
                //     filteredEvents.map(e => {
                //                     e.start = e.DateStart
                //                     e.end = e.DateEnd
                //                     e.title = e.Title
                //                     return e
                //     })
                // })
            //     (() => {
            //         const filteredCopy = myEvents.filter(d => parseInt(d.Appointment_Length) === apptLength)
            //         filteredCopy.map(e => {
            //             e.start = e.DateStart
            //             e.end = e.DateEnd
            //             e.title = e.Title
            //             return e
            //         })
            //         setFilteredEvents(filteredCopy)});
            // // .then((res) => res.json())
            // .then((data) => {
            //     setMyEvents(data)
            //     const filteredCopy = data.filter(d => parseInt(d.appt_length) === apptLength)
            //     setFilteredEvents(filteredCopy)
            // });
        } catch (err) {
            console.error(err);
        }
    }

    const updateSelectedEvents = React.useCallback(() => {
        //create code to capture event time, set a room number, 
        
        let body = {
            "Room": 1,
            "Person": user,
            "DateStart": mySelectedEvents.DateStart,
            "DateEnd": mySelectedEvents.DateEnd
        }
        getAccessToken()


        // const events = mySelectedEvents.length === 0 ? [mySelectedEvents] : mySelectedEvents;
        // let eventsToUpdate = [...myEvents];

        // for (const event of events) {
        //     if (event.recurring) {
        //         const origEvent = event.original;
        //         let exc = origEvent.recurringException || [];
        //         const newEvent = event;

        //         newEvent.recurring = undefined;
        //         newEvent.color = 'orange';
        //         newEvent.id += '_' + formatDate('YYYY-MM-DD', event.start_time);
        //         eventsToUpdate = [...eventsToUpdate, newEvent];

        //         exc = [...exc, event.start_time];
        //         origEvent.recurringException = exc;

        //         // update the event in the list
        //         const index = eventsToUpdate.findIndex(x => x.id === origEvent.id);;
        //         eventsToUpdate.splice(index, 1, origEvent);
        //     } else {
        //         const newEv = event;
        //         newEv.color = 'orange';
        //         const index = eventsToUpdate.findIndex(x => x.id === newEv.id);
        //         eventsToUpdate.splice(index, 1, newEv);
        //         console.log("event" + JSON.stringify(eventsToUpdate))
        //     }
        // }

        toast({
            message: 'Your appointment has been scheduled. You will receive a confirmation email.'
        });

        // setMyEvents(eventsToUpdate);
        // refreshSelectedEvents([]);
    }, [myEvents, mySelectedEvents, refreshSelectedEvents]);

    const onEventUpdate = React.useCallback((args) => {
        if (args.isDelete) {
            if (!confirmOpen) {
                deleteSelectedEvents();
            }
            return false;
        }
    }, [confirmOpen, deleteSelectedEvents]);

    const onEventDelete = React.useCallback(() => {
        if (!confirmOpen) {
            deleteSelectedEvents();
            return false;
        }
    }, [confirmOpen, deleteSelectedEvents]);

    const onPageLoading = React.useCallback(() => {
        setTimeout(() => {
            setFirstDay(date);
            setLastDay(date);
        });
    }, [date]);

    const onSelectedEventsChange = React.useCallback((args) => {
        refreshSelectedEvents(args.events);
    }, [refreshSelectedEvents]);

    const onEventRightClick = React.useCallback((args) => {
        args.domEvent.preventDefault();
        setMenuAnchor(args.domEvent.target);
        setTimeout(() => {
            setMenuOpen(true);
        });
    }, []);

    const selectAllEvents = React.useCallback(() => {
        const selectedEvents = calRef.current.getEvents(firstDay, lastDay);
        refreshSelectedEvents(selectedEvents);
        toast({
            message: 'All events selected from view'
        });
    }, [firstDay, lastDay, refreshSelectedEvents]);

    const resetSelection = React.useCallback(() => {
        refreshSelectedEvents([]);
        toast({
            message: 'Selection cleared'
        });
    }, [refreshSelectedEvents]);

    const selectChange = React.useCallback((args) => {
        setSelected(args.value);
        if (args.value === 'update') {
            updateSelectedEvents();
        } else if (args.value === 'delete') {
            deleteSelectedEvents();
        }
    }, [deleteSelectedEvents, updateSelectedEvents]);

    const menuClose = React.useCallback(() => {
        setSelected('');
        setMenuOpen(false);
    }, []);

    // React.useEffect(() => {
    //     getJson('https://trial.mobiscroll.com/events/?vers=5', (events) => {
    //         setMyEvents(events);
    //     }, 'jsonp');
    //     document.querySelector('.md-bulk-operations').addEventListener('keydown', (ev) => {
    //         if (!confirmOpen && (ev.keyCode === 8 || ev.keyCode === 46)) {
    //             deleteSelectedEvents();
    //         }
    //     });
    // }, []);

    React.useEffect(() => {
            getAccessToken2()}, [])

    React.useEffect(() => {
            const filteredCopy = myEvents.filter(d => parseInt(d.Appointment_Length) === apptLength)
                filteredCopy.map(e => {
                    e.start = e.DateStart
                    e.end = e.DateEnd
                    e.title = e.Title
                    return e
                })
                setFilteredEvents(filteredCopy)


        // fetch(`http://localhost:8000/appointments`, {
        //     headers: {
        //         Authorization: `Token 0be249c88238743e5b4a7ac370b5145730c28e20`,
        //     },
        // }).then((res) => res.json())
        //     .then((data) => {
        //         setMyEvents(data)
        //         const filteredCopy = data.filter(d => parseInt(d.appt_length) === apptLength)
        //         setFilteredEvents(filteredCopy)
        //     });
        // document.querySelector('.md-bulk-operations').addEventListener('keydown', (ev) => {
        //     if (!confirmOpen && (ev.keyCode === 8 || ev.keyCode === 46)) {
        //         deleteSelectedEvents();
        //     }
        // });
    }, [apptLength]);

    // React.useEffect(() => {
        // fetch(`http://localhost:8000/appointments`, {
        //     headers: {
        //         Authorization: `Token 0be249c88238743e5b4a7ac370b5145730c28e20`,
        //     },
        // }).then((res) => res.json())
        //     .then((data) => {
        //         setMyEvents(data)
        //         const filteredCopy = data.filter(d => parseInt(d.appt_length) === apptLength)
        //         setFilteredEvents(filteredCopy)
        //     });
    //     getAccessToken2()
    //     document.querySelector('.md-bulk-operations').addEventListener('keydown', (ev) => {
    //         if (!confirmOpen && (ev.keyCode === 8 || ev.keyCode === 46)) {
    //             deleteSelectedEvents();
    //         }
    //     });
    // }, [apptLength]);

    return (
        <Page className="md-bulk-operations">
            <div className="mbsc-grid mbsc-no-padding">
                <div className="mbsc-row">
                    <div className="mbsc-col-sm-9 mbsc-push-sm-3">
                        <Eventcalendar
                            className="md-bulk-operations-border"
                            ref={calRef}
                            data={filteredEvents}
                            view={view}
                            startTime='09:00'
                            endTime='17:00'
                            clickToCreate={true}
                            selectMultipleEvents={true}
                            selectedEvents={mySelectedEvents}
                            onEventDelete={onEventDelete}
                            onPageLoading={onPageLoading}
                            onSelectedEventsChange={onSelectedEventsChange}
                            onEventRightClick={onEventRightClick}
                        />
                        <Select
                            inputProps={{ type: 'hidden' }}
                            display="anchored"
                            touchUi={false}
                            anchor={menuAnchor}
                            data={contextMenu}
                            value={selectedValue}
                            isOpen={menuOpen}
                            onChange={selectChange}
                            onClose={menuClose}
                        />
                    </div>
                    <div className="mbsc-col-sm-3 mbsc-pull-sm-9">
                        <div className="mbsc-form-group">
                            <div className="mbsc-button-group-block">
                                {/* <Button onClick={selectAllEvents}>Select all this month</Button> */}
                                <Button onClick={resetSelection}>Reset selection</Button>
                            </div>
                        </div>
                        <div className="mbsc-form-group-title">Selected Appt:</div>
                        <div className="mbsc-padding mbsc-form-group-title">
                            <ul>
                                {eventTitles.map((title, index) => {
                                    return <li key={index}>{title}</li>
                                })}
                            </ul>{eventTitles.length > 0 ? <Button style={{ background: "blue", color: "white" }} onClick={updateSelectedEvents}>Confirm Appt</Button> : ""}

                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
}


export default New;