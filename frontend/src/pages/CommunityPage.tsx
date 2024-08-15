import axios from "axios";
import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Pagination } from "antd"; // Ant Design Pagination 컴포넌트 임포트

interface Story {
  _id: number;
  title: string;
  content: string;
  writer: string;
  createdAt: string;
  updatedAt: string;
  image: string;
}

export default function CommunityPage() {
  const [storys, setStorys] = useState<Story[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchStorys = async (page: number) => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/community?page=${page}`
        );
        if (response.data.posts) {
          setStorys(response.data.posts);
          setTotalPages(response.data.totalPages);
        } else {
          console.error("Unexpected response format:", response.data);
          setStorys([]);
        }
      } catch (error) {
        console.error("Error fetching storys:", error);
        setStorys([]);
      }
    };

    fetchStorys(currentPage); // 페이지 변경 시 데이터를 다시 불러옴
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // 페이지 변경 시 상태 업데이트
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
        <div className="xl:w-[1280px] mx-auto px-3 xl:px-8 mb-10">
          <div className="flex justify-between border-blue-500 border-b-2 py-5"></div>

          {storys.length > 0 ? (
            storys.map((story) => (
              <div
                key={story._id}
                className="flex justify-between gap-5 border-b py-5"
              >
                <div className="overflow-hidden flex-col justify-between flex">
                  <Link
                    to={`/community/${story._id}`}
                    className="flex flex-col gap-3"
                  >
                    <h2 className="text-xl font-semibold truncate hover:underline">
                      {story.title}
                    </h2>
                    <p className="text-gray-600 truncate hover:underline">
                      {story.content.replace(/(<([^>]+)>)/gi, "")}
                    </p>
                  </Link>
                  <div className="flex text-gray-500 text-sm">
                    <span className="text-black hover:underline">
                      {story.writer}
                    </span>
                    <span>
                      {new Date(story.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/community/${story._id}`}
                  className="flex flex-col gap-3"
                >
                  <img
                    src={story.image || "/default-image.png"}
                    alt="게시글 이미지"
                    className="w-32 h-32 object-cover border"
                  />
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center py-10">게시글이 없습니다.</p>
          )}

          <Link to="/community/write">
            <button className="w-[90px] mt-5 h-10 ml-auto justify-center flex items-center rounded-md bg-blue-500 text-white">
              <BsPencilSquare />
              글작성
            </button>
          </Link>
          {/* Pagination 컴포넌트 */}
          <Pagination
            className="flex justify-center mt-5"
            current={currentPage} // 현재 페이지 번호
            total={totalPages * 10} // 전체 게시물 수 (각 페이지당 10개의 글을 표시)
            onChange={handlePageChange} // 페이지 변경 시 호출될 함수
            pageSize={10} // 한 페이지당 보여줄 글의 수
          />
        </div>
      </div>
    </>
  );
}
