import { Form, Input, Button, Upload, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import api from "../../api/api";
import { useSelector } from "react-redux";

const { TextArea } = Input;

export default function ProductRegistration() {
  const [form] = Form.useForm();
  const [productImage, setProductImage] = useState<any[]>([]);
  const [detailImages, setDetailImages] = useState<any[]>([]);
  const accessToken = useSelector((state: any) => state.user.accessToken);

  const onFinish = async (values: any) => {
    const formData = new FormData();

    // 상품 정보를 FormData에 추가
    formData.append("productName", values.productName);
    formData.append("category", values.category);
    formData.append("price", values.price);
    formData.append("description", values.description);

    // 상품 이미지와 상세 이미지를 FormData에 추가
    formData.append("productImage", productImage[0].originFileObj);
    detailImages.forEach((file: any) => {
      formData.append("detailImages", file.originFileObj);
    });

    try {
      await api.post("/api/products/new-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      message.success("상품이 등록되었습니다.");
    } catch (error) {
      message.error("상품 등록 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  // 이미지 처리 핸들러
  const handleProductImageChange = (info: any) => {
    setProductImage(info.fileList);
  };

  const handleDetailImagesChange = (info: any) => {
    if (info.fileList.length <= 3) {
      setDetailImages(info.fileList);
    } else {
      message.error("상품 디테일 이미지는 최대 3개까지 업로드 가능합니다.");
    }
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="상품 사진" name="productImage">
          <Upload
            listType="picture"
            fileList={productImage}
            maxCount={1}
            beforeUpload={() => false}
            onChange={handleProductImageChange}
          >
            <Button icon={<UploadOutlined />} size="large">
              상품 사진 업로드
            </Button>
          </Upload>
        </Form.Item>

        {/* 카테고리 */}
        <Form.Item
          label="카테고리"
          name="category"
          rules={[{ required: true, message: "카테고리를 선택하세요!" }]}
        >
          <Select placeholder="카테고리를 선택하세요" size="large">
            <Select.Option value="바다">바다</Select.Option>
            <Select.Option value="민물">민물</Select.Option>
            <Select.Option value="루어">루어</Select.Option>
            <Select.Option value="낚시용품">낚시용품</Select.Option>
          </Select>
        </Form.Item>

        {/* 상품명 */}
        <Form.Item
          label="상품명"
          name="productName"
          rules={[
            { required: true, message: "상품의 정식 명칭을 입력하세요!" },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        {/* 상품 가격 */}
        <Form.Item
          label="가격"
          name="price"
          rules={[{ required: true, message: "가격을 입력하세요!" }]}
        >
          <Input prefix="₩" type="number" size="large" />
        </Form.Item>

        {/* 상품 소개말 */}
        <Form.Item
          label="상품 소개"
          name="description"
          rules={[{ required: true, message: "상품 소개를 입력하세요!" }]}
        >
          <TextArea rows={3} size="large" />
        </Form.Item>

        {/* 상품 디테일 사진 */}
        <Form.Item label="상품 디테일 사진 (최대 3개)">
          <Upload
            listType="picture"
            multiple
            maxCount={3}
            beforeUpload={() => false}
            onChange={handleDetailImagesChange}
          >
            <Button icon={<UploadOutlined />} size="large">
              상품 디테일 사진 업로드
            </Button>
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit" size="large">
          상품 등록
        </Button>
      </Form>
    </div>
  );
}
