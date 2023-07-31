"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";

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

const errorMessage = "Oops! Something went wrong. Please try again.";

export default function NewEntryPage() {
  const router = useRouter();
  const [reflectionPrompt, setReflectionPrompt] = useState("Fetching prompt...");
  const [content, setContent] = useState("");
  const textareaDisabled = reflectionPrompt === errorMessage;
  const isDisabled = !content || textareaDisabled;

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
    })
    .then(function (response) {
      // console.log(response);
      router.push("entries");
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  useEffect(() => {
    async function fetchReflectionPrompt() {
      try{
        const res = await axios.request(reflectionPromptOptions);
        setReflectionPrompt(res.data.generations[0].text.strip());
      } catch(error) {
        setReflectionPrompt(errorMessage);
      }
    }

    setReflectionPrompt("Fetching...");
    fetchReflectionPrompt();
  }, []);

  return (
    <main className="flex h-full flex-col items-center justify-between">
      <div className="w-3/4 bg-white dark:bg-slate-800 rounded-t-lg p-10 ring-1 ring-slate-900/5 shadow-xl">
        <div className="flex justify-between">
          <p className="text-slate-800 dark:text-slate-300 font-semibold">
            {reflectionPrompt}
          </p>
          <button className="ml-8 mr-4 my-auto" onClick={handleClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-1 stroke-black dark:stroke-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
            </svg>
          </button>
        </div>
        <hr className="w-3/4 h-1 mx-auto my-4 border-dashed rounded md:my-10 border-black dark:border-white" />
        <div className="mt-6">
          <form onSubmit={handleSubmit}>
            <textarea className="resize-none rounded-md w-full h-[32rem] p-2 focus:outline-none dark:text-slate-100 bg-inherit font-light" name="content" placeholder="Start writing here..." disabled={textareaDisabled} onChange={handleChange}></textarea>
            <div className="flex justify-center mt-4">
              <button type="submit" className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-400 rounded-md shadow-lg text-white" disabled={isDisabled}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
