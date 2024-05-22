// Import dependencies
import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  async function loadModel() {
    const MODEL_URL = "/Users/alchemie/Desktop/RealTimeObjectDetectionTFJSReact/public/tfjsexport/model.json";

    try {
        // Load the model directly from the URL
        const model = await tf.loadGraphModel(MODEL_URL, onprogress);
        console.log("Model loaded successfully:", model);

        // Optionally, you can save the model to local storage
        // Note: This step is unnecessary if you're just loading the model
        // const saveResults = await model.save('localstorage://model-name');

        // No need to load the model again after saving it
        // const loadedModel = await tf.loadGraphModel(saveResults);
        // console.log("Loaded model:", loadedModel);
    } catch (error) {
        console.error("Failed to load the model:", error);
    }
}

loadModel();


  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {

      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const obj = await net.detect(video);

      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx); 
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
