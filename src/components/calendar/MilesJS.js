export const createAppointmentSlots = (events) => {

}

<script type="text/javascript">
    document.addEventListener('DataPageReady', function (event) {
        // Text field, beginning time for appointment, change "InsertRecordDateStart" to name of field
        let startTimeField = document.querySelector('input[name="InsertRecordDateStart"]');

    // Text field, ending time for appointment, change "InsertRecordDateEnd" to name of field
    let endTimeField = document.querySelector('input[name="InsertRecordDateEnd"]');

    // Text field, must be a date field, allows user to select date for appt, change "cbParamVirtual1" to name of field
    let dateField = document.querySelector('input[name="cbParamVirtual1"]');

    // Dropdown field, enter number of minutes, change "cbParamVirtual2" to name of field (change select to input for text)
    let intervalField = document.querySelector('select[name="cbParamVirtual2"]');

    // Hidden field, indicates first appt of day, change "cbParamVirtual3" to name of field
    let startTime = parseInt(document.querySelector('input[name="cbParamVirtual3"]').value);

    // Hidden field, indicates ending time for all appts, change "cbParamVirtual4" to name of field
    let endTime = parseInt(document.querySelector('input[name="cbParamVirtual4"]').value);

    let target = 'selected';

    let times = [];

    // clears out the appointment times for next selection
    intervalField.addEventListener('click', function (event) {
        document.getElementById(target).innerHTML = "";
    });
    // when the interval field is changed, generates new slate of times
    intervalField.addEventListener('change', function (event) {
        let blockedTimes = [];

    // Hidden field, use a SELECT statement in calculated field to create array of unavailable times
    let virfield = document.querySelector('input[name="cbParamVirtual5"]').value;

    // create array of unavailable time start/end pairs
    let pairs = virfield.split('+');

    for (let p = 0; p < pairs.length; p++) {
        let pair = pairs[p].split('*');

    let arr = [];

    arr.push(new Date(pair[0]));
    arr.push(new Date(pair[1]));

    blockedTimes.push(arr);
    }

        // on the fly create time slots for the day
    setTimeout(() => {
        let div = document.createElement("div");
    div.classList.add("card");
    div.setAttribute("style", "width: 18rem;");
    document.getElementById("selected").append(div);
    let ul = document.createElement("ul");
    ul.classList.add("list-group", "list-group-flush");

    div.append(ul);
    times = [];

    let date = dateField.value;
    let interval = parseInt(intervalField.value);

    for (let k = 0; k < ((endTime - startTime) * 60); k += interval) {
        let time = createTimes(startTime, k);

        let st = date + " " + createTimes(startTime, k);
        let et = date + " " + createTimes(startTime, (k + interval));
            
        // create a counter to keep track of taken slots
        // the counter increments up when a slot is taken and blocks the time slot
        let c = 0;
        for (let n = 0; n < blockedTimes.length; n++) {
            let start = new Date(st);
        let end = new Date(et);
        let li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerHTML = time;
        ul.append(li);
        if (start < blockedTimes[n][1] && end > blockedTimes[n][0]) {
            c += 1;
                        } else {
            let b = document.createElement("button");
        b.classList.add("btn", "btn-success");
        b.setAttribute("value", st + ", " + et);
        b.setAttribute("style", "position:absolute;right:5px;top:5px;")
        b.innerHTML = "Select this time"
        li.append(b);
                        }
                    }
        // if no taken slots, then push time to available times for display
        if (c === 0) {
            times.push([time, st, et]);
        }
    }


    // Pause a moment for virtual fields to load? Doesn't seem to work without the timeout
    // field.setAttribute("value", times[i][1] + ", " + times[i][2]);
    let rads = document.querySelectorAll('.btn-success');
    for (let j = 0; j < rads.length; j++) {
        rads[j].addEventListener("click", function () {
            let vals = rads[j].value.split(", ");
            startTimeField.value = vals[0];
            endTimeField.value = vals[1];
        });
            }
        }, "500");
    });
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
});
</script>