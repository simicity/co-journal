"use client"

import Entry from "./Entry";
import { EntryData } from '../types';
import axios from 'axios';
import useSWR from "swr";

export default function EntriesPage() {
  const fetcher = (url: string) => axios.get(url).then(res => res.data);
  const { data: entries, error, isLoading } = useSWR(`http://localhost:3000/api/entries`, fetcher);
  if (isLoading) return <div>loading...</div>;
  if (error) return <div>failed to load</div>;

  return (
    <div className="grid grid-cols-3 grid-flow-row gap-4 m-4">
      {(entries as EntryData[]).map(entry => (
        <Entry key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
