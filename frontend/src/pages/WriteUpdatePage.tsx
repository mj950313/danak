import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface Story {
  id: string;
  title: string;
  content: string;
  writer: string;
  createdAt: string;
  updatedAt: string;
}

export default function WritePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8080/api/community/write/${id}`, {
        title,
        content,
      });
      navigate("/community");
    } catch (error) {
      console.error("Error updating the story:", error);
    }
  };

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get<Story>(
          `http://localhost:8080/api/community/${id}`
        );
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        console.error("Error fetching the story:", error);
      }
    };

    fetchStory();
  }, [id]);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image", "video"],
        ["clean"],
      ],
    },
  };

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
      <div className="border bg-white">
        <div className="py-8 xl:w-[1280px] mx-auto px-3 xl:px-8">
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label htmlFor="title" className="text-gray-700">
                제목
              </label>
              <input
                type="text"
                id="title"
                className="w-full p-2 border border-gray-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="text-gray-700">
                내용
              </label>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={modules}
                className="h-[400px]"
              />
            </div>
            <div className="flex justify-end mt-20">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                작성하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}