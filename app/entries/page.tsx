"use client"

import Loading from "@/components/Loading";
import EntryCard from "../../components/EntryCard";
import { EntryData } from '../types';
import axios from 'axios';
import useSWR from "swr";
import FailLoading from "@/components/FailLoading";
import NoEntry from "@/components/NoEntry";

export default function EntriesPage() {
  const fetcher = (url: string) => axios.get(url).then(res => res.data);
  const { data: entries, error, isLoading } = useSWR(`/api/entries/published`, fetcher);
  if (isLoading) return <Loading />;
  if (error) return <FailLoading />;
  
  return (
    <div>
      <h2 className="mb-10 text-2xl font-black dark:text-slate-100">Shared by People</h2>
      {entries && entries.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-8 m-8">
          {(entries as EntryData[]).map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <NoEntry />
      )}
    </div>
  );
}
