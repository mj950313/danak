import { Form, Input, Button, message } from "antd";
import { useState } from "react";
import api from "../../api/api";

interface CommentFormProps {
  communityId: string;
  fetchComments: () => void;
}

export default function CommentForm({
  communityId,
  fetchComments,
}: CommentFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { content: string }) => {
    setLoading(true);
    try {
      // 댓글 작성 API 요청
      const response = await api.post(
        `http://localhost:8080/api/community/${communityId}/comments`,
        { content: values.content }
      );
      console.log(response.data);
      message.success("댓글이 성공적으로 등록되었습니다.");

      form.resetFields();

      fetchComments();
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      message.error("댓글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleSubmit}
      className="w-full"
    >
      <Form.Item
        label="댓글달기"
        name="content"
        rules={[{ required: true, message: "댓글을 입력하세요!" }]}
        className="font-bold text-2xl"
      >
        <Input.TextArea
          rows={7}
          placeholder="댓글을 입력하세요."
          className="h-[200px]"
        />
      </Form.Item>

      <div className="flex justify-end">
        <Button type="primary" htmlType="submit" loading={loading}>
          등록
        </Button>
      </div>
    </Form>
  );
}
