import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, message, Modal } from "antd";
import CommentForm from "../components/CommunityComponent/commentFrom";
import api from "../api/api";
import { MoonLoader } from "react-spinners";

interface Story {
  id: string;
  title: string;
  content: string;
  userNickname: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
  comments: Comment[]; // 댓글 리스트
  userId: string;
}

interface Comment {
  _id: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
}

export default function CommunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const navigate = useNavigate();
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const userId = useSelector((state: any) => state.user.userId);
  const user = useSelector((state: any) => state.user.user);
  const { confirm } = Modal;
  console.log(userId);
  console.log(accessToken);
  console.log(user);
  // 글과 댓글 정보 가져오기
  const fetchStory = async () => {
    try {
      const response = await api.get<Story>(`/api/community/${id}`);
      setStory(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching the story:", error);
    }
  };

  useEffect(() => {
    fetchStory();
  }, [id]);

  // 댓글 삭제 처리
  const handleDeleteComment = async (commentId: string) => {
    confirm({
      title: "정말 삭제하시겠습니까?",
      content: "삭제된 댓글은 복구할 수 없습니다.",
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      onOk: async () => {
        try {
          await api.delete(`/api/community/${id}/comments/${commentId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          message.success("댓글이 삭제되었습니다.");
          fetchStory();
        } catch (error) {
          console.error("댓글 삭제 중 오류 발생:", error);
          message.error("댓글 삭제 중 오류가 발생했습니다.");
        }
      },
      onCancel() {
        console.log("삭제 취소");
      },
    });
  };

  const handleDeleteStory = async () => {
    confirm({
      title: "정말 삭제하시겠습니까?",
      content: "삭제된 글은 복구할 수 없습니다.",
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      onOk: async () => {
        try {
          await api.delete(`/api/community/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          message.success("글이 삭제되었습니다.");
          navigate("/community");
        } catch (error) {
          console.error("Error deleting the story:", error);
          message.error("글 삭제 중 오류가 발생했습니다.");
        }
      },
      onCancel() {
        console.log("삭제 취소");
      },
    });
  };

  if (!story) {
    return (
      <p className="flex justify-center items-center h-[600px]">
        <MoonLoader color="#1D4ED8" size={50} />
      </p>
    );
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
          <img
            src={story.image || "/user.png"}
            alt="사진"
            className="border w-14 h-14 rounded-full"
          />
          <div className="my-auto">
            <p className="font-bold text-lg">{story.userNickname}</p>
            <p className="text-gray-500">
              {`${new Date(story.createdAt).getFullYear()}.${(
                new Date(story.createdAt).getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}.${new Date(story.createdAt)
                .getDate()
                .toString()
                .padStart(2, "0")}`}
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
              {userId === story.userId && (
                <>
                  <Button
                    onClick={handleDeleteStory}
                    className="w-[90px] mt-5 h-10 justify-center flex items-center rounded-md border-blue-500"
                  >
                    삭제
                  </Button>
                  <Link to={`/community/write/${id}`}>
                    <Button
                      type="primary"
                      className="w-[90px] mt-5 h-10 justify-center flex items-center rounded-md text-white"
                    >
                      수정
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 댓글 목록 표시 */}
        <div className="my-10">
          {story.comments.length > 0 ? (
            story.comments.map((comment) => (
              <div key={comment._id} className="mb-5 border p-3 rounded-md">
                <p className="font-bold">{comment.author || "익명"}</p>
                <p>{comment.content}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
                {/* 댓글 작성자만 삭제 버튼 표시 */}
                {comment.authorId === userId && (
                  <Button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="border mt-1 border-blue-500"
                  >
                    삭제
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p>댓글이 없습니다.</p>
          )}
        </div>

        {/* 댓글 작성 폼 */}
        <CommentForm
          communityId={id!}
          fetchComments={fetchStory} // 댓글 작성 시 최신 댓글 목록을 다시 가져오기
        />
      </div>
    </>
  );
}
