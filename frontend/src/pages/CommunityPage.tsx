import axios from "axios";
import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import AuthenticationModal from "../components/AuthenticationModal";
import { useSelector } from "react-redux";
import { CiWarning } from "react-icons/ci";

interface Story {
  _id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  userInfo: {
    nickname: string;
  };
}

export default function CommunityPage() {
  const [storys, setStorys] = useState<Story[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const accessToken = useSelector((state: any) => state.user.accessToken);

  const showModal = () => {
    if (!accessToken) {
      setIsModalVisible(true);
    } else {
      navigate("/community/write");
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const thumnail = (content: string): string => {
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const match = imgRegex.exec(content);
    return match ? match[1] : "/noimg.png";
  };

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
                  <div className="flex gap-1 text-gray-500 text-sm">
                    <span className="text-black">
                      {story.userInfo.nickname} ・
                    </span>
                    <span>
                      {`${new Date(story.createdAt).getFullYear()}.${(
                        new Date(story.createdAt).getMonth() + 1
                      )
                        .toString()
                        .padStart(2, "0")}.${new Date(story.createdAt)
                        .getDate()
                        .toString()
                        .padStart(2, "0")}`}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/community/${story._id}`}
                  className="flex flex-col gap-3 shrink-0"
                >
                  <img
                    src={thumnail(story.content)}
                    alt="게시글 이미지"
                    className="w-32 h-32 object-cover"
                  />
                </Link>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-[500px]">
              <p className="text-black text-xl font-semibold flex flex-col items-center">
                <CiWarning className="text-blue-500 text-4xl" />
                게시글이 없습니다.
              </p>
            </div>
          )}

          <button
            onClick={showModal}
            className="w-[90px] mt-5 h-10 ml-auto justify-center flex items-center rounded-md bg-blue-500 text-white"
          >
            <BsPencilSquare />
            글작성
          </button>

          <Pagination
            className="flex justify-center mt-5"
            current={currentPage}
            total={totalPages * 10}
            onChange={handlePageChange}
            pageSize={10}
          />
        </div>
      </div>

      <AuthenticationModal visible={isModalVisible} onClose={closeModal} />
    </>
  );
}
