import Link from "next/link";
import { createTimeStamp } from "../app/util";
import { EntryData } from "../app/types";
import IconPeopleFill from "./icons/IconPeopleFill";
import IconEyeOff from "./icons/IconEyeOff";

export default function EntryCard({ entry }: { entry: EntryData }) {
  return (
    <Link href={`/entries/${entry.id}`}>
      <div className="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-800">
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-200">
              Created: {createTimeStamp(entry.createdAt)}
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-200">
              Modified: {createTimeStamp(entry.modifiedAt)}
            </p>
          </div>
          <div className="text-neutral-600 dark:text-neutral-200">
            {entry.published ? (
              <IconPeopleFill />
            ) : (
              <IconEyeOff />
            )}
          </div>
        </div>
        <h5 className="my-2 font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          {entry.title}
        </h5>
        <p className="entry-card-content text-sm text-neutral-600 dark:text-neutral-200">
          {entry.content}
        </p>
      </div>
    </Link>
  );
}