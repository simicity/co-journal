"use client"

import { createTimeStamp } from "../../util";
import useSWR from "swr";
import axios from "axios";

export default function EntryPage({ params }: any) {
  const fetcher = (url: string) => axios.get(url).then(res => res.data);
  const { data: entry, error, isLoading } = useSWR(`http://localhost:3000/api/entries/${params.id}`, fetcher);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>failed to load</div>;

  return (
    <div className="m-6">
      <div className="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-800">
        <p className="text-xs text-neutral-600 dark:text-neutral-200">
          Created: {createTimeStamp(entry.created)}
        </p>
        <p className="text-xs text-neutral-600 dark:text-neutral-200">
          Modified: {createTimeStamp(entry.modified)}
        </p>
        <h5 className="my-2 text-base font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          {entry.title}
        </h5>
        <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
          {entry.content}
        </p>
        
      </div>
    </div>
  );
}
