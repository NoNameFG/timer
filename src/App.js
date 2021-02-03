import './App.css'
import { fromEvent, interval } from 'rxjs'
import React, { useState, useEffect, useRef } from 'react'

function App() {
  const [ time, setTime ] = useState(0)
  const [ timerStatus, setTimerStatus ] = useState(false)

  const startStopButton = useRef(null)
  const pauseButton = useRef(null)
  const resetButton = useRef(null)



  const stylizeStr = val => {
    return val > 9 ? val : '0' + val
  }

  const disablePauseButton = value => {
    pauseButton.current.disabled = value
  }

  useEffect(() => {
    let flag = timerStatus

    const startStopClick = fromEvent(startStopButton.current, 'click').subscribe(() =>{
        setTimerStatus(!flag)
        if(flag){
          setTime(0)
          disablePauseButton(true)
        } else {
          disablePauseButton(false)
        }
        flag = !flag
      }
    )

    const pauseClick = fromEvent(pauseButton.current, 'click').subscribe(event =>{
        setTimerStatus(!flag)
        flag = !flag
        disablePauseButton(true)
      }
    )

    const resetClick = fromEvent(resetButton.current, 'click').subscribe(() =>{
        setTimerStatus(false)
        flag = false
        setTime(0)
        disablePauseButton(true)
      }
    )

    return () => {
      startStopClick.unsubscribe()
      pauseClick.unsubscribe()
      resetClick.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if(timerStatus){
      let seconds = time ? time : 0

      const timer = interval(1000).subscribe(() => {
        seconds += 1000
        setTime(seconds)
      })

      return () => {
        timer.unsubscribe()
      }
    }
  }, [timerStatus])

  return (
    <div className="App">
      <div className="timer">
        <div className="timer_face">
          {
            `
              ${stylizeStr(Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))}:
              ${stylizeStr(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)))}:
              ${stylizeStr(Math.floor((time % (1000 * 60)) / 1000))}
            `
          }
        </div>
        <div className="timer_control">
          <button ref={startStopButton} className="timer_control--start">
            { timerStatus ? 'Stop' : 'Start' }
          </button>
          <button ref={pauseButton} className="timer_control--pause">Pause</button>
          <button ref={resetButton} className="timer_control--reset">Reset</button>
        </div>
      </div>
    </div>
  );
}

export default App
