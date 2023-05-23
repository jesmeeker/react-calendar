export const createAppointmentSlots = (events) => {

}

    export function makeTimes(date, interval, filteredCopy) {
        let d = date.toDateString()
        console.log(d)
        let blockedTimes = filteredCopy.filter(function(event) {
            let s = new Date(event.DateStart)
            console.log(s.toDateString())
            return s.toDateString() === date.toDateString()
        });
        console.log(blockedTimes)
        let endTime = 17;
        let startTime = 13;
        let times = [];
        for (let k = 0; k < ((endTime - startTime) * 60); k += interval) {
            let time = createTimes(startTime, k);

            let st = d + " " + createTimes(startTime, k);
            let et = d + " " + createTimes(startTime, (k + interval));
                
            // create a counter to keep track of taken slots
            // the counter increments up when a slot is taken and blocks the time slot
            let c = 0;
            for (let n = 0; n < blockedTimes.length; n++) {
                let start = new Date(st);
                let end = new Date(et);

                if (start < blockedTimes[n][1] && end > blockedTimes[n][0]) {
                    c += 1;
                } 
            }
            // if no taken slots, then push time to available times for display
            if (c === 0) {
                times.push({"title": time, "start": new Date(st), "end": new Date(et)});
            }
            console.log(times)
        } return times
    }


    // This function generates the time slots because JavaScript has no date add feature
    function createTimes(startTime, interval) {
        let t = ((startTime * 60) + interval);
        let mins = (t % 60).toString();
        if (mins.length === 1) {
            mins = mins + "0";
            }
        let hrs = Math.floor(t/60);
        let time = "";
        if (hrs === 12) {
            time = hrs + ":" + mins + " PM";
            } else if (hrs > 12) {
            time = (hrs - 12) + ":" + mins + " PM";
            } else {
            time = hrs + ":" + mins + " AM";
            }
        return time
    }

