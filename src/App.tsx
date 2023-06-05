import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { submitFile } from './Api'

interface IPredictions {
  [key: string]: number;
}

function App() {
  const [count, setCount] = useState(0)
  const [file, setFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<IPredictions>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileSubmit = async () => {
    if (file) {
      setPredictions(await submitFile(file))
    }
  };

  useEffect(() => {
    const entries = Object.entries(predictions)
    entries.sort((a, b) => b[1] - a[1])
    console.log(entries)
  }, [predictions]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileSubmit}>Submit</button>
    </div>
    </>
  )
}

export default App
