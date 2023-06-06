/* eslint-disable @typescript-eslint/no-inferrable-types */
import { useEffect, useState } from "react";
import "./App.css";
import { IPredictions, TSorted } from "./Types";
import { submitFile } from "./Api";
import File from "./Components/File";
import Camera from "./Components/Camera";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<IPredictions>({});
  const [sortedPredictions, setSortedPredictions] = useState<TSorted>([]);
  const [showFile, setShowFile] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);

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
      {showFile ? (
        <>
          <File setPredictions={setPredictions} />
          <button onClick={() => setShowFile(false)}>Hide File</button>
        </>
      ) : (
        <button onClick={() => setShowFile(true)}>Show File</button>
      )}
      {showCamera ? (
        <>
          <Camera setPredictions={setPredictions} />
          <button onClick={() => setShowCamera(false)}>Hide Camera</button>
        </>
      ) : (
        <button onClick={() => setShowCamera(true)}>Show Camera</button>
      )}
      <div>
        {sortedPredictions.map((prediction, index) => (
          <div key={prediction[0]}>
            {index == 0 && (
              <>
                <strong>High Confidence</strong>
                <br />
              </>
            )}
            {index == 0 && prediction[0].split(",")[0]}
            {index == 1 && (
              <>
                <br />
                <strong>Low Confidence</strong>
                <br />
              </>
            )}
            {index >= 1 && index <= 4 && prediction[0].split(",")[0]}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
