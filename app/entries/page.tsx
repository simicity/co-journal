"use client"

import Entry from "./Entry";
import { EntryData } from '../types';
import axios from 'axios';
import useSWR from "swr";

export default function EntriesPage() {
  const fetcher = (url: string) => axios.get(url).then(res => res.data);
  const { data: entries, error, isLoading } = useSWR(`/api/entries`, fetcher);
  if (isLoading) return <div className="m-6">loading...</div>;
  if (error) return <div className="m-6">failed to load</div>;
  console.log(entries)

  return (
    <div className="grid grid-cols-3 grid-flow-row gap-8 m-8">
      {(entries as EntryData[]).map(entry => (
        <Entry key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
