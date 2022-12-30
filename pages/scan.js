/* eslint-disable @next/next/no-img-element */
import * as tmImage from "@teachablemachine/image";
import { useCallback, useRef, useState } from "react";
import { useImage } from "../utils/context";
import useTranslation from "../utils/i18n";
import convertToBase64 from "../utils/base64";
import Button from "../components/Button";
import Webcam from "react-webcam";
import NextImage from "next/image";
import Link from "next/link";

import healthyImage from "../images/healthy.png";
import unhealthyImage from "../images/unhealthy.png";
import Head from "next/head";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const Scan = () => {
  const {
    prediction,
    setPrediction,
    image,
    setImage,
    handleReset,
    handleResetImage,
  } = useImage();

  const [isLoading, setIsLoading] = useState(false);

  const WebcamRef = useRef(null);
  const UploadRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = WebcamRef.current.getScreenshot();
    setImage(imageSrc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [WebcamRef]);

  const handleFileReadClick = () => UploadRef.current.click();

  const handleFileRead = async (e) => {
    const content = e.target.files[0];
    const base64 = await convertToBase64(content);
    setImage(base64);
  };

  const handlePrediction = async () => {
    if (!isLoading) {
      try {
        setIsLoading(true);
        const modelURL = "/model/model.json";
        const metadataURL = "/model/metadata.json";

        const model = await tmImage.load(modelURL, metadataURL);

        const imageElement = new Image();
        imageElement.src = image;

        const prediction = await model.predict(imageElement, false);

        console.log(prediction);

        prediction.sort((a, b) => b.probability - a.probability);

        setPrediction(prediction[0]);

        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);

        console.error(e);
      }
    }
  };

  const { scan, staging, result, predict } = useTranslation();

  return (
    <>
      <Head>
        <title>Scan - AgroScan</title>
      </Head>
      <section>
        <h1 className="text-3xl font-bold text-center my-2">
          {!image ? scan?.title : !prediction ? staging?.title : result?.title}
        </h1>
        <h2 className="text-lg text-center my-2">
          {!image
            ? scan?.subtitle
            : !prediction
            ? staging?.subtitle
            : result?.subtitle}
        </h2>
      </section>
      {!image ? (
        <section>
          <div className="flex flex-col items-center justify-center my-4">
            <Webcam
              audio={false}
              height={videoConstraints.height}
              width={videoConstraints.width}
              ref={WebcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
            <Button onClick={capture}>{predict?.capture}</Button>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Button onClick={handleFileReadClick}>{predict?.upload}</Button>
            <input
              className="hidden"
              ref={UploadRef}
              type="file"
              accept="image/*"
              label="Upload Image"
              onChange={handleFileRead}
            />
          </div>
        </section>
      ) : !prediction ? (
        <section className="flex flex-col items-center justify-center m-2">
          <img src={image} alt="Upload Preview" width={400} />
          <Button onClick={handlePrediction}>
            {isLoading ? staging?.loading : staging?.button}
          </Button>
          <Button onClick={handleResetImage}>{staging?.back}</Button>
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center m-2">
          <NextImage
            src={
              prediction?.className == "healthy" ? healthyImage : unhealthyImage
            }
            className={prediction?.className}
            width={300}
            alt={result[prediction?.className]}
          />
          <p className="text-center text-xl font-bold">
            {result[prediction?.className]}
          </p>
          <p>
            {result?.confidence} {prediction?.probability.toFixed(2) * 100}%
          </p>
          <Link href="/report">
            <Button>{result?.report}</Button>
          </Link>
          <Button onClick={handleReset}>{result?.again}</Button>
        </section>
      )}
    </>
  );
};

export default Scan;
