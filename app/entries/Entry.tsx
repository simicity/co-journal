import Link from "next/link";
import { createTimeStamp } from "../util";
import { EntryData } from "../types";

export default function Entry({ entry }: {entry: EntryData}) {
  const { id, title, content, created, modified } = entry || {};

  return (
    <Link href={`/entries/${id}`}>
      <div className="block rounded-lg bg-white h-72 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-800">
        <p className="text-xs text-neutral-600 dark:text-neutral-200">
          Created: {createTimeStamp(created)}
        </p>
        <p className="text-xs text-neutral-600 dark:text-neutral-200">
          Modified: {createTimeStamp(modified)}
        </p>
        <h5 className="my-2 font-medium truncate leading-tight text-neutral-800 dark:text-neutral-50">
          {title}
        </h5>
        <p className="mb-4 text-base truncate text-neutral-600 dark:text-neutral-200">
          {content}
        </p>
      </div>
    </Link>
  );
}