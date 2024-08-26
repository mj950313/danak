import { Tabs, Form, Input, Button, Table, message } from "antd";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import ProductRegistration from "../components/MyPageComponent/ProductRegistration";
import ProductDelete from "../components/MyPageComponent/ProductDelete";

interface UserInfo {
  name: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  role: string;
}

interface CommentData {
  _id: string;
  content: string;
  createdAt: string;
  communityTitle: string;
  communityId: string;
}

const MyPage: React.FC = () => {
  const [editProfileForm] = Form.useForm();
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [postsData, setPostsData] = useState<any[]>([]);
  const [commentsData, setCommentsData] = useState<CommentData[]>([]);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get<UserInfo>(
        "http://localhost:8080/api/mypage/myinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = response.data;
      setUserInfo(data);
      console.log(data);
      localStorage.setItem("user", data.nickname);

      editProfileForm.setFieldsValue({
        name: data.name,
        nickname: data.nickname,
        email: data.email,
        phone: data.phoneNumber,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchPosts();
    fetchComments();
  }, []);

  // 프로필 업데이트 핸들러
  const handleProfileUpdate = async (values: any) => {
    if (!values.password) {
      delete values.password;
    }

    try {
      const response = await api.put(
        "http://localhost:8080/api/mypage/myinfo/update",
        values,
        {}
      );
      message.success("프로필이 성공적으로 업데이트되었습니다.");
      setUserInfo(response.data);
      fetchUserInfo();
    } catch (error) {
      console.error(error);
      message.error("업데이트에 실패했습니다.");
    }
  };

  // 내가 쓴 글 가져오는 함수
  const fetchPosts = async () => {
    try {
      const response = await api.get(
        "http://localhost:8080/api/mypage/myposts",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setPostsData(response.data.reverse()); // 받아온 글 데이터를 상태에 저장
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get<CommentData[]>(
        "http://localhost:8080/api/mypage/mycomments",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCommentsData(response.data.reverse());
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 결제 내역 (임시)
  const paymentData = [
    { key: "1", product: "상품 A", price: "100,000원", date: "2023-08-21" },
    { key: "2", product: "상품 B", price: "50,000원", date: "2023-08-10" },
  ];

  const postColumns = [
    {
      title: "제목",
      dataIndex: "title",
      render: (text: string, record: any) => (
        <Link to={`/community/${record._id}`}>{text}</Link>
      ),
    },
    {
      title: "작성일",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => new Date(text).toLocaleString(),
    },
  ];

  const commentColumns = [
    {
      title: "댓글 내용",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "작성일",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => new Date(text).toLocaleString(),
    },
  ];

  const isAdmin = userInfo?.role === "admin";

  const items = [
    {
      key: "1",
      label: "내 정보 수정",
      children: (
        <Form
          form={editProfileForm}
          layout="vertical"
          onFinish={handleProfileUpdate}
        >
          <Form.Item
            label="이름"
            name="name"
            rules={[{ required: true, message: "이름을 입력하세요!" }]}
          >
            <Input size="large" disabled />
          </Form.Item>
          <Form.Item
            label="이메일"
            name="email"
            rules={[{ required: true, message: "이메일을 입력하세요!" }]}
          >
            <Input size="large" disabled />
          </Form.Item>
          <Form.Item
            label="비밀번호"
            name="password"
            rules={[
              {
                validator: (_, value) =>
                  value && value.length < 8
                    ? Promise.reject("비밀번호는 최소 8자 이상이어야 합니다.")
                    : Promise.resolve(),
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="변경하지 않을 경우 비워두세요"
            />
          </Form.Item>
          <Form.Item
            label="닉네임"
            name="nickname"
            rules={[
              { required: true, message: "닉네임을 입력하세요!" },
              { min: 2, message: "닉네임은 최소 2자 이상이어야 합니다." },
              { max: 6, message: "닉네임은 최대 6자 이내여야 합니다." },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="핸드폰"
            name="phone"
            rules={[
              { required: true, message: "핸드폰 번호를 입력하세요!" },
              {
                pattern: /^[0-9]{10,11}$/, // 10~11자리 숫자 정규식
                message: "핸드폰 번호는 10-11자리 숫자여야 합니다.",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large">
            수정하기
          </Button>
        </Form>
      ),
    },
    {
      key: "2",
      label: "결제 내역",
      children: (
        <Table
          columns={[
            { title: "상품명", dataIndex: "product", key: "product" },
            { title: "가격", dataIndex: "price", key: "price" },
            { title: "결제일", dataIndex: "date", key: "date" },
          ]}
          dataSource={paymentData}
          pagination={false}
        />
      ),
    },
    {
      key: "3",
      label: "내가 쓴 글",
      children: (
        <Table
          columns={postColumns}
          dataSource={postsData}
          rowKey="_id"
          pagination={false}
        />
      ),
    },
    {
      key: "4",
      label: "내가 쓴 댓글",
      children: (
        <Table
          columns={commentColumns}
          dataSource={commentsData}
          rowKey="commentId"
          pagination={false}
        />
      ),
    },
  ];

  if (isAdmin) {
    items.push({
      key: "5",
      label: "상품 등록",
      children: <ProductRegistration />,
    });
  }
  if (isAdmin) {
    items.push({
      key: "6",
      label: "상품 삭제",
      children: <ProductDelete />,
    });
  }

  return (
    <div className="flex flex-col gap-3 xl:w-[1280px] mx-auto px-3 xl:px-8 py-28 xl:py-36">
      <h1 className="text-center text-4xl sm:text-5xl font-bold mb-5">
        MY PAGE
      </h1>
      <p className="text-center font-bold">{userInfo?.nickname} 님</p>
      <img src="/user.png" alt="user" className="rounded-full w-28 mx-auto" />
      <Tabs defaultActiveKey="1" type="line" size="large" items={items} />
    </div>
  );
};

export default MyPage;
