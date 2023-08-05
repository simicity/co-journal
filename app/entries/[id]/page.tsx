"use client"

import { createTimeStamp } from "../../util";
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FailLoading from "@/components/FailLoading";
import Loading from "@/components/Loading";
import IconPeopleFill from "@/components/icons/IconPeopleFill";
import IconEyeOff from "@/components/icons/IconEyeOff";
import IconReturnUpBack from "@/components/icons/IconReturnUpBack";
import IconEdit from "@/components/icons/IconEdit";
import IconDelete from "@/components/icons/IconDelete";
import IconCancel from "@/components/icons/IconCancel";
import { useSession } from "next-auth/react";

export default function EntryPage({ params }: any) {
  const { data: session, status, update } = useSession();
  const router = useRouter()
  const [isEdit, setEdit] = useState(false);
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const fetcher = (url: string) => axios.get(url).then(res => res.data);
  const { data: entry, error, isLoading } = useSWR(`/api/entries/${params.id}`, fetcher);

  const isDisabled = !content && (entry && isPublished == entry.published);
  useEffect(() => {
    setContent(entry ? entry.content : "");
    setIsPublished(entry ? entry.published : false);
  }, [entry]);

  if (isLoading) return <Loading />;
  if (error) return <FailLoading />;

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
    axios.put(`/api/entries/${entry.id}`, {
      content: content,
      published: isPublished
    })
    .then(function (response) {
      entry.content = content;
      setEdit(false);
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  const handleDelete = () => {
    axios.delete(`/api/entries/${params.id}`)
    .then(function (response) {
      router.push("/entries/user");
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  return (
    <div className="m-6">
      <div className="flex justify-between">
        <div className="my-auto">
          <Link href="/entries/user" className="flex m-4 text-slate-600 dark:text-slate-300">
            <IconReturnUpBack size={"20px"} />
            <span className="ml-2">Back</span>
          </Link>
        </div>
        {session && session.user && session.user.id === entry.authorId && (
          <div>
            <button className="m-4 text-slate-600 dark:text-slate-300" onClick={handleEdit}>
              <div className="flex flex-row my-auto">
                {isEdit ? <IconCancel size={"20px"} /> : <IconEdit size={"20px"} />}
                <span className="ml-1">{isEdit ? "Cancel" : "Edit"}</span>
              </div>
            </button>
            <button className="m-4 text-slate-600 dark:text-slate-300" onClick={handleDelete}>
              <div className="flex flex-row my-auto">
                <IconDelete size={"20px"} />
                <span className="ml-1">Delete</span>
              </div>
            </button>
          </div>
        )}
      </div>
      <div className="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-800">
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-200">
              Last Updated: {createTimeStamp(entry.modifiedAt)}
            </p>
          </div>
          <div className="text-neutral-600 dark:text-neutral-200">
            {entry.published ? (
              <IconPeopleFill size={"20px"} />
            ) : (
              <IconEyeOff size={"20px"} />
            )}
          </div>
        </div>
        <h5 className="my-2 text-base font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          {entry.title}
        </h5>
        {isEdit ? (
          <form onSubmit={handleUpdate}>
            <textarea rows={20} className="resize-none w-full focus:outline-none dark:text-slate-100 bg-inherit font-light" name="content" placeholder="Start writing here..." defaultValue={entry.content} onChange={handleChange}></textarea>
            <div className='flex justify-center mt-2'>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isPublished} onChange={() => setIsPublished(!isPublished)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Share this entry</span>
              </label>
            </div>
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
