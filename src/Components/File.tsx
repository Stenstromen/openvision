import { useState } from "react";
import { IPredictions } from "../Types";
import { submitFile } from "../Api";

function File({
  setPredictions,
}: {
  setPredictions: (predictions: IPredictions) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) return setFile(event.target.files[0]);
  };

  const handleFileSubmit = async () => {
    if (file) return setPredictions(await submitFile(file));
  };
  return (
    <div>
      {file ? <img src={URL.createObjectURL(file)} alt="file" width={300} /> : null}
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileSubmit}>Submit</button>
    </div>
  );
}

export default File;
