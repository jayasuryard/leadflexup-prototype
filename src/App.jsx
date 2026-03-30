import { useState } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from "@vercel/analytics/react"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <SpeedInsights/>
    <Analytics />
    <div className="App">
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
    </div>
    </>
  )
}

export default App
