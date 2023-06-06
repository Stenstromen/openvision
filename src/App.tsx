import { useEffect, useState } from "react";
import "./App.css";
import { IPredictions, TSorted } from "./Types";
import { submitFile } from "./Api";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<IPredictions>({});
  const [sortedPredictions, setSortedPredictions] = useState<TSorted>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) return setFile(event.target.files[0]);
  };

  const handleFileSubmit = async () => {
    if (file) return setPredictions(await submitFile(file));
  };

  useEffect(() => {
    setSortedPredictions(
      Object.entries(predictions).sort((a, b) => b[1] - a[1])
    );
  }, [predictions]);

  useEffect(() => {
    console.log(sortedPredictions);
  }, [sortedPredictions]);

  return (
    <>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileSubmit}>Submit</button>
      </div>
    </>
  );
}

export default App;
