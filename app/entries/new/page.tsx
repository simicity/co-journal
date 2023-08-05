"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import IconArrowRepeat from '@/components/icons/IconArrowRepeat';
import { useSession } from 'next-auth/react';

const reflectionPromptOptions = {
  method: 'POST',
  url: 'https://api.cohere.ai/v1/generate',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: process.env.COHERE_TOKEN,
  },
  data: {
    max_tokens: 20,
    return_likelihoods: 'NONE',
    truncate: 'END',
    prompt: 'Give me a reflection prompt for journaling.'
  }
};

const loadingMessage = "Fetching prompt...";
const errorMessage = "Oops! Something went wrong. Please try again.";

export default function NewEntryPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [reflectionPrompt, setReflectionPrompt] = useState(loadingMessage);
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const textareaDisabled = reflectionPrompt === loadingMessage || reflectionPrompt === errorMessage || status != "authenticated";
  const isDisabled = !content || textareaDisabled;
  const [textareaHeight, setTextareaHeight] = useState(200);

  const handleClick = () => {
    axios
    .request(reflectionPromptOptions)
    .then((res) => {
      setReflectionPrompt(res.data.generations[0].text.trim());
    })
    .catch((error) => {
      console.error(error);
      setReflectionPrompt(errorMessage);
    })
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setContent(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios.post('/api/entries', {
      title: reflectionPrompt,
      content: content,
      published: isPublished
    })
    .then(function (response) {
      // console.log(response);
      router.push("/entries");
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  useEffect(() => {
    async function fetchReflectionPrompt() {
      try{
        const res = await axios.request(reflectionPromptOptions);
        setReflectionPrompt(res.data.generations[0].text.trim());
      } catch(error) {
        console.log(error)
        setReflectionPrompt(errorMessage);
      }
    }

    setReflectionPrompt("Fetching...");
    fetchReflectionPrompt();
  }, []);

  useEffect(() => {
    function handleResize() {
      const windowHeight = window.innerHeight;
      const containerHeight = windowHeight * 0.65;
      const newTextareaHeight = containerHeight - 70;
      setTextareaHeight(newTextareaHeight);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (status != "authenticated") {
      window.alert("Please log in to write an entry.");
    }
  }, [status]);

  return (
    <main className="flex h-full flex-col items-center justify-between">
      <div className="w-3/4 bg-white dark:bg-slate-800 rounded-2xl p-10 ring-1 ring-slate-900/5 shadow-xl">
        <div className="flex justify-between text-slate-800 dark:text-slate-300">
          <p className="font-semibold">
            {reflectionPrompt}
          </p>
          <button className="ml-8 mr-4 my-auto" onClick={handleClick}>
            <IconArrowRepeat size={"23px"} />
          </button>
        </div>
        <hr className="h-1 w-full mx-auto border-dashed my-5 border-black dark:border-white" />
        <div>
          <form onSubmit={handleSubmit}>
            <textarea style={{ height: `${textareaHeight}px` }} className="resize-none w-full focus:outline-none dark:text-slate-100 bg-inherit font-light" placeholder="Start writing here..." disabled={textareaDisabled} onChange={handleChange}></textarea>
            <div className='flex justify-center mt-2'>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isPublished} onChange={() => setIsPublished(!isPublished)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Share this entry</span>
              </label>
            </div>
            <div className="flex justify-center mt-5">
              <button type="submit" className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-400 rounded-md shadow-lg text-white" disabled={isDisabled}>
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
