import React, { useState } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";

function ImageClassifier() {
  const [imageURL, setImageURL] = useState("");
  const [predictions, setPredictions] = useState([]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageURL(reader.result);
      classifyImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const classifyImage = async (imageUrl) => {
    try {
      const model = await mobilenet.load();
      const img = document.createElement("img");
      img.src = imageUrl;
      const predictions = await model.classify(img);
      setPredictions(predictions);
    } catch (error) {
      console.error("Error classifying image:", error);
    }
  };
  return (
    <div>
      <input type="file" onChange={handleImageUpload}></input>
      {imageURL && (
        <img src={imageURL} alt="Uploaded" style={{ maxWidth: "300px" }} />
      )}
      {predictions.length > 0 && (
        <div>
          <h2>Predictions:</h2>
          <ul>
            {predictions.map((prediction, index) => (
              <li key={index}>{`${prediction.className}: ${Math.floor(
                prediction.probability * 100
              )}%`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ImageClassifier;
