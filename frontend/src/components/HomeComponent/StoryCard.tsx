import React from "react";

interface Story {
  _id: string;
  title: string;
  image: string;
  content: string;
  userInfo: {
    nickname: string;
  };
}

interface StoryCardProps {
  story: Story;
}

// 첫 번째 img 태그의 src 속성 추출 함수
const extractFirstImageSrc = (htmlString: string): string | null => {
  const imgTagMatch = htmlString.match(/<img\s+[^>]*src="([^"]+)"[^>]*>/i);
  return imgTagMatch ? imgTagMatch[1] : null;
};

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  const firstImageSrc = extractFirstImageSrc(story.content);

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <div style={{ aspectRatio: "1/1" }} className="overflow-hidden">
        <img
          src={firstImageSrc || "/noimg.png"}
          alt="story"
          className="w-full h-full hover:scale-125"
        />
      </div>
      <div className="p-4">
        <h2 className="font-bold text-md xl:text-lg truncate">{story.title}</h2>
        <p className="text-gray-600 truncate">{story.userInfo.nickname}</p>
      </div>
    </div>
  );
};

export default StoryCard;
