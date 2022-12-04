/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import { useImage } from "../utils/context";
import Button from "../components/Button";
import useTranslation from "../utils/i18n";
import { useForm } from "react-hook-form";
import { useGeolocated } from "react-geolocated";
import { useState } from "react";
import { createReport } from "../utils/api";
import Head from "next/head";

const Report = () => {
  const { image, prediction, handleReset } = useImage();
  const {
    report: { data, noData },
    form,
    submitted,
  } = useTranslation();

  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  const { handleSubmit, register } = useForm();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (data) => {
    if (!isLoading) {
      try {
        setIsLoading(true);
        data.lat = parseFloat(coords?.latitude).toFixed(1) || 0;
        data.lng = parseFloat(coords?.longitude).toFixed(1) || 0;
        data.image = image;
        data.report = prediction?.className;

        const sbmt = await createReport(data);

        if (sbmt?.report) {
          setIsLoading(false);
          setIsSubmitted(true);
        }
      } catch (e) {
        setIsLoading(false);
        console.error(error);
      }
    }
  };

  const router = useRouter();

  const resetReport = () => {
    handleReset();
    router.push("/scan");
  };

  return (
    <>
      <Head>
        <title>Report - AgroScan</title>
      </Head>
      {!image || !prediction ? (
        <section className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-center m-2">
            {noData?.title}
          </h1>
          <Link href="/scan">
            <Button>{noData?.scan}</Button>
          </Link>
        </section>
      ) : !isSubmitted ? (
        <>
          <section>
            <h1 className="text-3xl font-bold text-center my-2">
              {data?.title}
            </h1>
            <h2 className="text-lg text-center my-2">{data?.subtitle}</h2>
          </section>
          <section className="flex flex-col items-center justify-center my-2">
            <img src={image} width={200} alt="crop" />
            <p className="my-1 font-bold text-center">
              {data[prediction?.className]}
            </p>
            <h3 className="mt-4 text-2xl font-bold">{data?.fill}</h3>
            <h4 className="mb-2 text-lg">{data?.privacy}</h4>
            <form
              onSubmit={handleSubmit(submit)}
              className="flex flex-col items-center justify-center w-full"
            >
              <label htmlFor="address" className="w-full flex flex-col m-2">
                {form?.address?.label}
                <input
                  className="border border-gray-300 rounded-md p-2"
                  type="text"
                  id="address"
                  name="address"
                  placeholder={form?.address?.placeholder}
                  required
                  {...register("address", {
                    required: true,
                  })}
                />
              </label>
              <label htmlFor="contact" className="w-full flex flex-col m-2">
                {form?.contact?.label}
                <input
                  className="border border-gray-300 rounded-md p-2"
                  type="number"
                  id="contact"
                  name="contact"
                  placeholder={form?.contact?.placeholder}
                  required
                  {...register("contact", {
                    required: true,
                  })}
                />
              </label>
              <label htmlFor="comments" className="w-full flex flex-col m-2">
                {form?.comments?.label}
                <textarea
                  className="border border-gray-300 rounded-md p-2"
                  id="comments"
                  name="comments"
                  placeholder={form?.comments?.placeholder}
                  required
                  {...register("comments", {
                    required: true,
                  })}
                />
              </label>
              <Button type="submit">
                {isLoading ? form?.loading : form?.submit}
              </Button>
              <Button onClick={resetReport}>{form?.again}</Button>
            </form>
          </section>
        </>
      ) : (
        <section className="flex flex-col items-center justify-center my-2">
          <h1 className="text-3xl font-bold text-center my-2">
            {submitted?.title}
          </h1>
          <h2 className="text-lg text-center my-2">{submitted?.subtitle}</h2>
          <Button onClick={resetReport}>{submitted?.again}</Button>
        </section>
      )}
    </>
  );
};

export default Report;
