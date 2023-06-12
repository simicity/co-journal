"use client"

import { createTimeStamp } from "../../util";
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EntryPage({ params }: any) {
  const router = useRouter();
  const [isEdit, setEdit] = useState(false);
  const [content, setContent] = useState("");
  const isDisabled = !content;

  const fetcher = (url: string) => axios.get(url).then(res => res.data);
  const { data: entry, error, isLoading } = useSWR(`http://localhost:3000/api/entries/${params.id}`, fetcher);
  if (isLoading) return <div className="m-6">Loading...</div>;
  if (error) return <div className="m-6">failed to load</div>;

  const handleEdit = () => {
    setEdit(!isEdit);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setContent(value);
  };

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(content);
    axios.put(`http://localhost:3000/api/entries/${entry.id}`, {
      content: content,
    })
    .then(function (response) {
      // console.log(response);
      entry.content = content;
      setEdit(false);
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:3000/api/entries/${params.id}`)
    .then(function (response) {
      // console.log(response);
      router.push("entries");
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  return (
    <div className="m-6">
      <div className="flex justify-between">
        <div className="my-auto">
          <Link href="/entries" className="m-4 text-sm text-slate-600 dark:text-slate-300">back</Link>
        </div>
        <div>
          <button className="m-4 text-sm text-slate-600 dark:text-slate-300" onClick={handleEdit}>
            <div className="flex flex-row my-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
              <span className="ml-1">{isEdit ? "cancel" : "edit"}</span>
            </div>
          </button>
          <button className="m-4 text-sm text-slate-600 dark:text-slate-300" onClick={handleDelete}>
            <div className="flex flex-row my-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              <span className="ml-1">delete</span>
            </div>
          </button>
        </div>
      </div>
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
        {isEdit ? (
          <form onSubmit={handleUpdate}>
            <textarea className="resize-none rounded-md w-full p-2 focus:outline-none dark:text-slate-100 bg-inherit font-light" name="content" placeholder="Start writing here..." defaultValue={entry.content} onChange={handleChange}></textarea>
            <div className="flex justify-center mt-4">
              <button type="submit" className="px-4 py-2 bg-orange-300 hover:bg-orange-200 disabled:bg-slate-400 rounded-md shadow-lg text-white" disabled={isDisabled}>
                Update
              </button>
            </div>
          </form>
        ): (
          <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
            {entry.content}
          </p>
        )}        
      </div>
    </div>
  );
}
