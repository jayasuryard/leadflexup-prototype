import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
      </section>
    </>
  )
}

export default App
