"use client"

import Loading from "@/components/Loading";
import EntryCard from "../../components/EntryCard";
import { EntryData } from '../types';
import axios from 'axios';
import FailLoading from "@/components/FailLoading";
import NoEntry from "@/components/NoEntry";
import useSWRInfinite from "swr/infinite";
import IconArrowRepeat from "@/components/icons/IconArrowRepeat";
import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { redirect } from "next/navigation";

const PAGE_SIZE = 12;

const getKey = (pageIndex: number, previousPageData: any) => {
  // reached the end
  if (previousPageData && !previousPageData.length) return null;

  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return `/api/entries/published?limit=${PAGE_SIZE}`;

  // add the cursor to the API endpoint
  return `/api/entries/published?limit=${PAGE_SIZE}&cursor=${previousPageData[previousPageData.length - 1].id}`;
}

export default function EntriesPage() {
  // !! Allow user access for shared entries for the live demo purpose
  // const { data: session, status, update } = useSession();

  // if (status != "authenticated") {
  //   redirect('/');
  // }

  const fetcher = (url: string) => axios.get(url).then(res => res.data);
  const { data, error, isLoading, size, setSize } = useSWRInfinite(getKey, fetcher);
  const [ dataLength, setDataLength ] = useState(0);
  const [ prevDataLength, setPrevDataLength ] = useState(-1);
  const [showSpinner, setShowSpinner] = useState(false);
  const showLoadMore = prevDataLength != dataLength;

  useEffect(() => {
    if(data) {
      setDataLength(data.reduce((acc, d) => acc + d.length, 0));
      setShowSpinner(false);
    }
  }, [data, dataLength, setDataLength]);

  if (isLoading) return <Loading />;
  if (error) return <FailLoading />;

  return (
    <div>
      <h2 className="mb-10 text-2xl font-black dark:text-slate-100">Shared by People</h2>
      {data && data.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-8 m-8">
            {data.map((entries) => {
              return (entries as EntryData[]).map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))
            })}
          </div>
          {showLoadMore && (
            <div className="flex justify-center text-neutral-600 hover:text-neutral-800 dark:text-neutral-200 hover:dark:text-white">
              {showSpinner ? (
                <div className="animate-spin">
                  <IconArrowRepeat size={"20px"} />
                </div>
              ) : (
                <button onClick={() => { setShowSpinner(true); setPrevDataLength(dataLength); setSize(size + 1) }}>Load More</button>
              )}
            </div>
          )}
        </>
      ) : (
        <NoEntry />
      )}
    </div>
  );
}
