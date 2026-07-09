import { useEffect, useState } from "react";

const CameraPreview = ({ videoRef }) => {
  const [error, setError] = useState("");
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef?.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera access denied", error);
        setError("Please allow camera access to record video.");
      }
    };

    startCamera();

    return () => {
      if (videoRef?.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [videoRef]);

  return (
    <div className="">
      {error && (
        <p className="text-sm text-red-500 font-semibold mb-2 text-center">
          {error}
        </p>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-auto object-cover rounded-xl border shadow-lg"
      />
    </div>
  );
};

export default CameraPreview;