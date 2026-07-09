import { useRef, useState } from "react";

const MAX_DURATION = 30 * 1000; 
const MAX_SIZE = 20 * 1024 * 1024; 

const RecorderControls = ({ videoRef, onRecordingComplete, disabled }) => {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");

  const startRecording = () => {
    if (disabled) return;

    if (!videoRef?.current || !videoRef.current.srcObject) {
      setError("Camera not ready");
      return;
    }

    setError("");
    chunksRef.current = [];

    const stream = videoRef.current.srcObject;
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/mp4",
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      clearTimeout(timerRef.current);

      const blob = new Blob(chunksRef.current, { type: "video/mp4" });

      if (blob.size > MAX_SIZE) {
        setError("Recorded video must be under 20MB");
        return;
      }

      onRecordingComplete(blob);
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setRecording(true);

   
    timerRef.current = setTimeout(() => {
      mediaRecorder.stop();
      setRecording(false);
    }, MAX_DURATION);
  };

  const stopRecording = () => {
    if (disabled) return;

    clearTimeout(timerRef.current);
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {!recording ? (
        <button
          onClick={startRecording}
          disabled={disabled}
          className={`w-44 h-12 flex items-center justify-center text-sm font-medium rounded-lg
            ${
              disabled
                ? "bg-green-400 opacity-50 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
        >
          ▶ Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          disabled={disabled}
          className={`w-44 h-12 flex items-center justify-center text-sm font-medium rounded-lg
            ${
              disabled
                ? "bg-red-400 opacity-50 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
        >
          ◼ Stop Recording
        </button>
      )}

      {error && (
        <p className="text-xs font-semibold text-red-500 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};

export default RecorderControls;