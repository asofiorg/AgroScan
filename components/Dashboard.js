/* eslint-disable @next/next/no-img-element */
import useSWR from "swr";
import { fetcher } from "../utils/api";
import Button from "./Button";
import Map from "./Map";
import useTranslation from "../utils/i18n";
import { useState } from "react";

const Dashboard = ({ password }) => {
  const { admin, predictions } = useTranslation();

  const [page, setPage] = useState(1);

  const { data } = useSWR(
    `/api/reports?password=${password}&page=${page}`,
    fetcher
  );

  if (!data) {
    return <p>{admin?.loading}</p>;
  }

  const nextStep = () => {
    if (data?.page >= data?.pages) {
      return;
    }

    setPage(page + 1);
  };

  const previousStep = () => {
    if (page <= 1) {
      return;
    }

    setPage(page - 1);
  };

  return (
    <>
      <h1 className="font-bold text-center text-4xl my-4">
        {admin?.reports?.title}
      </h1>
      <section className="flex flex-col items-center justify-center w-full">
        {data?.reports.map((report, k) => (
          <article
            key={k}
            className="w-full border border-gray-300 rounded-md p-6"
          >
            <img
              src={report?.image}
              alt="Report image"
              className="rounded pb-2"
            />
            <p className="py-1">{`${admin?.reports?.address}: ${report?.address}`}</p>
            <p className="py-1">{`${admin?.reports?.contact}: ${report?.contact}`}</p>
            <p className="py-1">{`${admin?.reports?.comments}: ${report?.comments}`}</p>
            <p className="py-1">{`${admin?.reports?.status}: ${
              predictions[report?.report]
            }`}</p>
            <p>{`${admin?.reports?.date}: ${new Date(
              report?.createdAt
            ).toDateString()}`}</p>
            <Map lat={report?.lat} lng={report?.lng} />
          </article>
        ))}
      </section>
      <section className="w-full flex items-center justify-evenly">
        <Button onClick={previousStep} disabled={page <= 1}>
          {admin?.pagination?.previous}
        </Button>
        <p>{` ${data?.page} / ${data?.pages} `}</p>
        <Button onClick={nextStep} disabled={data?.page >= data?.pages}>
          {admin?.pagination?.next}
        </Button>
      </section>
    </>
  );
};

export default Dashboard;
