import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import api from "../api/api";

interface Story {
  id: string;
  title: string;
  content: string;
  userNickname: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
}

export default function CommunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const navigate = useNavigate();
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get<Story>(
          `http://localhost:8080/api/community/${id}`
        );
        setStory(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching the story:", error);
      }
    };

    fetchStory();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }
    try {
      await api.delete(`http://localhost:8080/api/community/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("글이 삭제되었습니다.");
      navigate("/community");
    } catch (error) {
      console.error("Error deleting the story:", error);
      alert("글 삭제 중 오류가 발생했습니다.");
    }
  };

  if (!story) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <>
      <div className="bg-[url('/community.png')] bg-center bg-repeat-x">
        <div className="flex flex-col gap-3 xl:w-[1280px] mx-auto px-3 xl:px-8 py-28 xl:py-48">
          <h1 className="text-white text-4xl xl:text-5xl font-bold">
            Community <br />
          </h1>
          <p className="text-white text-xl xl:text-2xl">커뮤니티</p>
        </div>
      </div>
      <div className="bg-white xl:w-[1280px] mx-auto px-3 xl:px-8 my-10">
        <h1 className="text-3xl mb-3 truncate">{story.title}</h1>
        <div className="flex gap-3 border-b-2 pb-5">
          {/* <img
            src={story.image || "/default-image.png"}
            alt="사진"
            className="border w-14 h-14 rounded-full"
          /> */}
          <div className="my-auto">
            <p className="font-bold text-lg">{story.userNickname}</p>
            <p className="text-gray-500">
              {`${new Date(story.createdAt).getFullYear()}.${(new Date(story.createdAt).getMonth() + 1).toString().padStart(2, "0")}.${new Date(story.createdAt).getDate().toString().padStart(2, "0")}`}
            </p>
          </div>
        </div>
        <div className="flex flex-col my-5 border-b-2 py-5">
          <p
            className="min-h-[300px]"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />
          <div className="flex">
            <div className="flex gap-3">
              {user === story.userNickname && (
                <>
                  <button
                    onClick={handleDelete}
                    className="w-[90px] mt-5 h-10 justify-center flex items-center rounded-md bg-blue-500 text-white"
                  >
                    삭제
                  </button>
                  <Link to={`/community/write/${id}`}>
                    <button className="w-[90px] mt-5 h-10 justify-center flex items-center rounded-md bg-blue-500 text-white">
                      수정
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
