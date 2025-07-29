import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WebSocketTest from './components/WebSocketComp'
import MicroPhoneComp from './components/microphone/MicroPhoneComp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
        <WebSocketTest />
      </div>
      <div>
        <MicroPhoneComp />
      </div>
    </>
  )
}

export default App
