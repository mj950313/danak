import React from "react";

interface TitleProps {
  title: string;
  title2: string;
}

const Title: React.FC<TitleProps> = ({ title, title2 }) => {
  return (
    <div className="flex flex-col gap-3 my-8">
      <div className="border w-8 border-blue-500"></div>
      <h3 className="text-2xl xl:text-3xl font-semibold">{title}</h3>
      <p>{title2}</p>
    </div>
  );
};

export default Title;
