"use client";
import "@mantine/core/styles.css";
import { InputWithButton } from "./InputWithButton";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");

  console.log(prompt)

  return (
    <div className=" flex items-center justify-center h-screen">
      <InputWithButton prompt={prompt} setPrompt={setPrompt} />
    </div>
  );
}
