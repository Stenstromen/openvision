import { Collapse } from "react-bootstrap";
import { IPredictions } from "../Types";
import File from "./File";

function FileSection({
  showFile,
  setShowFile,
  setPredictions,
}: {
  showFile: boolean;
  setShowFile: React.Dispatch<React.SetStateAction<boolean>>;
  setPredictions: React.Dispatch<React.SetStateAction<IPredictions>>;
}) {
  return (
    <Collapse in={showFile}>
      <div>
        {showFile && (
          <File setShowFile={setShowFile} setPredictions={setPredictions} />
        )}
      </div>
    </Collapse>
  );
}

export default FileSection;
