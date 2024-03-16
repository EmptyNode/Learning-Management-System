'use client';
import React, {FC, useState} from "react";
import Heading from "./utils/Heading";

interface props{}

const Page: FC<props> = (props)=>{
  return(
    <div>
      <Heading title="Elearning" description="Elearning is a platform for students to learn and get help from teachers" keywords="Programming, MERN, Redux, Machine Learning" />
    </div>
    )
}

export default Page;