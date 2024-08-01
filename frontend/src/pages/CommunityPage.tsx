import { BsPencilSquare } from "react-icons/bs";
import { Link } from "react-router-dom";
export default function CommunityPage() {
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
        <div className="xl:w-[1280px] mx-auto px-3 xl:px-8 mb-10">
          <div className="flex justify-between border-blue-500 border-b-2 py-5"></div>

          <div className="flex justify-between gap-5 border-b py-5">
            <div className="overflow-hidden flex-col justify-between flex">
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold truncate">
                  fdsfdsdddddddfdfdsfdsfds
                </h2>
                <p className="text-gray-600 truncate">
                  fdsfdsfdsfdsfdsfdsfdsfdsfds
                </p>
              </div>
              <div className="flex gap-4 text-gray-500 text-sm">
                <span className="text-black">민재</span>
                <span>2024.07.25</span>
                <span>댓글</span>
              </div>
            </div>
            <div>
              <img
                src="/"
                alt="게시글 이미지"
                className="w-32 h-32 object-cover border"
              />
            </div>
          </div>

          <Link to="/community/write">
            <button className="w-[90px] mt-5 h-10 ml-auto justify-center flex items-center rounded-md bg-blue-500 text-white">
              <BsPencilSquare />
              글작성
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
