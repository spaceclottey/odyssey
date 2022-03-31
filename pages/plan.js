import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect, useReducer } from "react";
import Swal from "sweetalert2";

export default function Home() {
  const [newStartTime, setNewStartTime] = useState("");
  const [newName, setNewName] = useState("");
  const [newLength, setNewLength] = useState("");

  const [events, setEvents] = useState([
    {
      startTime: "08:00",
      name: "Standard",
      length: "0.1",
      multiplier: 1,
      started: false,
      fixed: true,
    },
    {
      startTime: "06:00",
      name: "Application",
      length: "20",
      multiplier: 1,
      started: false,
      fixed: false,
    },
    {
      startTime: "07:00",
      name: "Nonstandard",
      length: "30",
      multiplier: 1,
      started: false,
      fixed: false,
    },
    {
      startTime: "08:00",
      name: "Toolbox",
      length: "5",
      multiplier: 1,
      started: false,
      fixed: false,
    },
    {
      startTime: "09:00",
      name: "Lunch",
      length: "10",
      multiplier: 1,
      started: false,
      fixed: false,
    },
    {
      startTime: "10:00",
      name: "Tasklist",
      length: "20",
      multiplier: 1,
      started: false,
      fixed: false,
    },
    {
      startTime: "11:00",
      name: "Run",
      length: "30",
      multiplier: 1,
      started: false,
      fixed: false,
    },
    {
      startTime: "12:00",
      name: "Call",
      length: "40",
      multiplier: 1,
      started: false,
      fixed: false,
    },
    {
      startTime: "13:00",
      name: "Adventure",
      length: "10",
      multiplier: 1,
      started: false,
      fixed: false,
    },
    {
      startTime: "14:00",
      name: "Programming",
      length: "20",
      multiplier: 1,
      started: false,
      fixed: false,
    },
    {
      startTime: "15:00",
      name: "Shower",
      length: "30",
      multiplier: 1,
      started: false,
      fixed: false,
    },
    {
      startTime: "16:00",
      name: "Movie",
      length: "40",
      multiplier: 1,
      started: false,
      fixed: false,
    },
  ]);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  let time = new Date();
  const [now, setNow] = useState(time.toLocaleString("en-GB").slice(11, 17));

  // Updates clock every minute
  setInterval(() => {
    let time = new Date();
    setNow(time.toLocaleString("en-GB").slice(11, 17));
  }, 60000);

  // Put all time values in pretty 24:00 with the correct amount of zeros
  const cleanTime = (time, showSeconds) => {
    let hours,
      minutes,
      seconds = 0;

    // If time is just one number, change it into that hour
    if (time.length == 1) {
      hours = time;
    }

    // If it's two numbers, make the first number the hour and the second number the minutes
    if (time.length == 2) {
      hours = time[0];
      minutes = Number(time[1]) * 10;
    }

    // If it's a proper time, make sure the zeros are in the right place
    if (time.includes(":")) {
      hours = time.split(":")[0];
      minutes = time.split(":")[1];
      seconds = "00";
    }

    hours = hours < 10 && hours.length == 1 ? "0" + hours : hours;
    minutes = minutes < 10 && minutes.length == 1 ? "0" + minutes : minutes;
    seconds = seconds < 10 && seconds.length == 1 ? "0" + seconds : seconds;

    let cleaned = hours + ":" + minutes + (showSeconds ? ":" + seconds : "");

    return cleaned;
  };

  // console.log(cleanTime("17:00", true));

  const addNewActivity = () => {
    if (newName && newLength) {
      let newActivity = {
        startTime: newStartTime,
        name: newName,
        length: newLength,
        multiplier: 1,
        started: false,
        fixed: false,
      };

      setNewStartTime("");
      setNewName("");
      setNewLength("");

      let tempEvents = events;
      tempEvents.push(newActivity);
      setEvents(tempEvents);

      forceUpdate();
    }
  };

  const swap = (index, direction) => {
    let tempEvents = events;

    // Swaps elements
    if (tempEvents[index + direction]) {
      [tempEvents[index], tempEvents[index + direction]] = [
        tempEvents[index + direction],
        tempEvents[index],
      ];
    }

    setEvents(tempEvents);

    forceUpdate();
  };

  // Add times together

  const addTime = (baseTime, timeToAdd) => {
    let baseHour = baseTime.split(":")[0];
    let baseMinutes = Number(baseTime.split(":")[1]) / 60;

    // Work it out in hours
    let minutesToAdd = Number(timeToAdd) / 60;

    let minutesTotal = baseMinutes + minutesToAdd;
    let hoursTotal = Number(baseHour) + minutesTotal;

    let newHour = Math.floor(hoursTotal);

    let newMinutes = hoursTotal - newHour;
    let newMinutesInHours = Math.round(newMinutes * 60);

    if (newHour >= 24) {
      newHour = newHour - 24;
    }

    let newString = String(newHour) + ":" + String(newMinutesInHours);
    newString = cleanTime(newString, false);

    return newString;
  };

  const subtractTime = (time1, time2) => {
    // 1. Convert both of them to miliseconds since 1970
    console.log(time1, time2);

    // A. Create the normal day and append this to the time
    let time = new Date();
    let year = time.getFullYear();
    let month = time.getMonth() < 10 ? "0" + time.getMonth() : time.getMonth();
    let day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    let date = year + "/" + month + "/" + day;

    let fullTime1 = date + " " + time1 + ":00";
    let fullTime2 = date + " " + time2 + ":00";

    console.log(fullTime1, fullTime2);

    // B. Convert both to Date Objects
    let time1Date = new Date(fullTime1);
    let time2Date = new Date(fullTime2);

    // C. Convert both to miliseconds

    let time1Mili = time1Date.getTime();
    let time2Mili = time2Date.getTime();

    // 2. Subtract the miliseconds
    let difMili = time2Mili - time1Mili;

    // 3. Calculate the number of minutes

    let difMinutes = difMili / (1000 * 60);

    return difMinutes;
  };

  // Make all the "real lengths" equal to the normal lengths to start with
  useEffect(() => {
    let tempEvents = events;
    for (let i = 0; i < events.length; i++) {
      tempEvents[i]["realLength"] = tempEvents[i]["length"];
    }
    setEvents(tempEvents);
  }, []);

  // Whenever the "events" changes...
  useEffect(() => {
    let tempEvents = events;

    // Make all the times run off eachother every time it's loaded
    // Starts at ONE. Do NOT effect the first array.
    for (let i = 1; i < events.length; i++) {
      if (!tempEvents[i].started && !tempEvents[i].fixed) {
        tempEvents[i]["startTime"] = addTime(
          tempEvents[i - 1].startTime,
          tempEvents[i - 1].realLength
        );
      }
    }

    // Update all the times

    let fixedEvents = [];

    // Collect the indexes of all the fixed events
    for (let i = 0; i < tempEvents.length; i++) {
      if (tempEvents[i].fixed) {
        fixedEvents.push(i);
      }
    }

    // Calculate the correct multiplier for the event times
    if (fixedEvents.length >= 2) {
      for (let i = 1; i < fixedEvents.length; i++) {
        let fixedDif = subtractTime(
          tempEvents[fixedEvents[i - 1]]["startTime"],
          tempEvents[fixedEvents[i]]["startTime"]
        );

        console.log("Fixed dif", fixedDif);

        let unfixedDif = 0;

        for (let j = fixedEvents[i - 1]; j < fixedEvents[i]; j++) {
          unfixedDif = unfixedDif + Number(tempEvents[j].length);
        }

        let multiplier = fixedDif / unfixedDif;

        for (let j = fixedEvents[i - 1]; j < fixedEvents[i]; j++) {
          let realLengthUnrounded = tempEvents[j].length * multiplier;
          tempEvents[j].realLength = Math.round(realLengthUnrounded * 10) / 10;
        }

        // Now multiply every length by this.

        console.log("Unfixed dif", unfixedDif);
        console.log("multiplier", multiplier);
      }
    }

    console.log(fixedEvents);

    setEvents(tempEvents);
    forceUpdate();
  }, [JSON.stringify(events)]);

  const [timerEndMili, setTimerEndMili] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [countdownMili, setCountdownMili] = useState(0);
  const [alarmTime, setAlarmTime] = useState("-");
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const start = (index) => {
    let tempEvents = events;
    tempEvents.forEach((event) => (event.started = false));
    tempEvents[index].started = true;
    tempEvents[index].fixed = true;
    tempEvents[index].startTime = now;
    setEvents(tempEvents);
    // To be removed soon
    setAlarmTime(
      addTime(tempEvents[index].startTime, tempEvents[index].length)
    );

    // ALL WE HAVE TO DO WHILE WE HAVE THE INDEX IS FIGURE OUT *WHEN* THE TIMER ENDS AND MAKE THAT GLOBAL. THE REST IS HANDLED BY THE INTERVAL
    let nowMili = new Date().getTime();
    let lengthMili = tempEvents[index].realLength * 60 * 1000;
    setTimerEndMili(nowMili + lengthMili);
    setIsTimerRunning(true);

    forceUpdate();
  };

  useEffect(() => {
    let runs = 0;
    const interval = setInterval(() => {
      if (isTimerRunning) {
        let nowMili = new Date().getTime();
        setCountdownMili(timerEndMili - nowMili);
        setCountdown(msToTime(timerEndMili - nowMili));

        if (nowMili + 1000 > timerEndMili) {
          setIsTimerRunning(false);

          // It shows the alert multiple times
          runs = runs + 1;

          // Play alarm
          var audio = new Audio(
            Math.random() > 0.5
              ? "https://m.sive.rs/DEREK_SIVERS-Flexible-1998-07.mp3"
              : "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
          );
          audio.play();

          if (runs == 1) {
            Swal.fire({
              icon: "info",
              title: "Timer finished",
              showConfirmButton: true,
            }).then(() => {
              audio.pause();
            });
          }
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timerEndMili, isTimerRunning]);

  const msToTime = (duration) => {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds; //+ "." + milliseconds;
  };

  // console.log(cleanTime("8:40", false));

  const test1 = () => {
    console.log(Math.floor(Math.random() * 2));
    pass;
    //  events.map((el) =>events.indexOf(el) == 6 ? el : (el) => (el.length = "100"))
  };

  const test2 = () => {
    "audio playing...?";

    if (Math.floor(Math.random() * 2) == 1) {
      var audio = new Audio(
        "https://m.sive.rs/DEREK_SIVERS-Flexible-1998-07.mp3"
      );
    } else {
      var audio = new Audio(
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
      );
    }

    var audio = new Audio(
      Math.random() > 0.5
        ? "https://m.sive.rs/DEREK_SIVERS-Flexible-1998-07.mp3"
        : "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    );
    audio.play();
  };

  const changeProp = (index, prop, value) => {
    let tempEvents = events;
    tempEvents[index][prop] = value;

    if (!tempEvents[index].length) {
      tempEvents[index]["length"] = "0";
    }
    if (prop == "startTime") {
      tempEvents[index]["fixed"] = true;
    }

    setEvents(tempEvents);
    forceUpdate();
  };

  const changeLengthOnce = (activity, index, length) => {
    let tempEvents = events;
    tempEvents[index].length = length ? length : "0";
    setEvents(tempEvents);
    forceUpdate();
  };

  return (
    <div>
      <Head>
        <title>Odyssey</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>

      <h1>
        {" "}
        <b> {now} </b>{" "}
      </h1>

      <h1>
        <b> Timer: {countdown} </b>
      </h1>

      {/* <h1>
        <b> End alarm: {alarmTime} </b>{" "}
      </h1> */}

      <div className=" w-3/4">
        <ul>
          <li className="grid grid-cols-10 border">
            <p className="col-span-1"> Move </p>
            <p className="col-span-1"> Index </p>
            <p> Start </p>
            <p> Fixed </p>
            <p>
              {" "}
              Start <br /> Time
            </p>
            <p className="col-span-2"> Activity </p>
            <p> Length (minutes) </p>
            <p>
              {" "}
              Real <br /> Length{" "}
            </p>
          </li>

          {events.map((activity, index) => (
            <li
              key={index}
              className={
                "grid grid-cols-10 border " +
                (index % 2 == 1 ? "bg-white " : "bg-gray-100 ") +
                (activity.started ? "bg-green-200 " : "")
              }
            >
              <div className={"col-span-1 "}>
                <button
                  className="material-icons text-s"
                  onClick={() => swap(index, -1)}
                >
                  keyboard_arrow_up
                </button>
                <button
                  className="material-icons text-s"
                  onClick={() => swap(index, 1)}
                >
                  keyboard_arrow_down
                </button>
              </div>
              <p className="col-span-1">{index}</p>
              <button
                className="material-icons text-s"
                onClick={() => start({ index }.index)}
              >
                play_arrow
              </button>
              <button
                onClick={() => changeProp(index, "fixed", !events[index].fixed)}
                className={events[index].fixed ? "bg-green-200" : ""}
              >
                {events[index].fixed ? `F` : `-`}
              </button>
              <p
                contentEditable
                onBlur={(e) =>
                  // changeNameOnce(activity, index, e.currentTarget.textContent)
                  changeProp(
                    index,
                    "startTime",
                    cleanTime(e.currentTarget.textContent)
                  )
                }
              >
                {" "}
                {activity.startTime}{" "}
              </p>
              <p
                className="col-span-2 text-left"
                contentEditable
                onBlur={(e) =>
                  // changeNameOnce(activity, index, e.currentTarget.textContent)
                  changeProp(index, "name", e.currentTarget.textContent)
                }
              >
                {" "}
                {activity.name}{" "}
              </p>
              <p
                contentEditable
                onBlur={(e) =>
                  changeLengthOnce(activity, index, e.currentTarget.textContent)
                }
              >
                {" "}
                {activity.length}{" "}
              </p>
              <p>{activity.realLength}</p>
            </li>
          ))}

          <li className="grid grid-cols-10 border">
            <p> - </p> {/* */}
            <p> - </p> {/* */}
            <p> - </p> {/* */}
            <p> - </p> {/* */}
            <p> - </p> {/* */}
            <input
              className="col-span-2"
              placeholder="New activity"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              id="newName"
            />
            <input
              className=""
              placeholder="Length"
              value={newLength}
              onChange={(e) => setNewLength(e.target.value)}
            />
            <button onClick={addNewActivity}> Add </button>
          </li>
        </ul>
      </div>
      <button onClick={test1}> Test 1 </button>
      <br />
      <button onClick={test2}> Test 2 </button>

      <source
        src="https://m.sive.rs/DEREK_SIVERS-Flexible-1998-07.mp3"
        type="audio/mpeg"
      ></source>
    </div>
  );
}

// Have it so that there's an "index" prop IN each element and the thing constantly rearranges to try and have it index order,
// so changing the arrows just changes the index?
// Have it so that pressing the arrow actually just swaps it with the one above it?

// Make it so that when ou

// useEffect(() => {
//   const listener = (event) => {
//     if (event.code === "Enter" || event.code === "NumpadEnter") {
//       event.preventDefault();
//       console.log("Enter key was pressed. Run your function.");
//       addNewActivity();
//       forceUpdate();
//       console.log(events);
//     }
//   };
//   document.addEventListener("keydown", listener);
//   return () => {
//     document.removeEventListener("keydown", listener);
//   };
// }, []);
