import React from "react";

interface Story {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  new: boolean;
  user: {
    name: string;
  };
}

interface StoryCardProps {
  story: Story;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <img
        src={story.image}
        alt={story.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="font-bold text-md xl:text-lg">{story.name}</h2>
        <p className="text-gray-600">{story.user.name}</p>
      </div>
    </div>
  );
};

export default StoryCard;
