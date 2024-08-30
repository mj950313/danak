import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/api";

export default function WritePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user.user);
  const accessToken = useSelector((state: any) => state.user.accessToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(
        "/api/community/write",
        {
          user,
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      navigate("/community");
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

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
          <form onSubmit={handleSubmit}>
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
