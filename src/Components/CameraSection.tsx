import { Collapse } from "react-bootstrap";
import { IPredictions } from "../Types";
import Camera from "./Camera";

function CameraSection({
  showCamera,
  setShowCamera,
  setPredictions,
}: {
  showCamera: boolean;
  setShowCamera: React.Dispatch<React.SetStateAction<boolean>>;
  setPredictions: React.Dispatch<React.SetStateAction<IPredictions>>;
}) {
  return (
    <Collapse in={showCamera}>
      <div>
        {showCamera && (
          <Camera
            setShowCamera={setShowCamera}
            setPredictions={setPredictions}
          />
        )}
      </div>
    </Collapse>
  );
}

export default CameraSection;
