import { Table, message } from "antd";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/api";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

export default function PaymentHistory() {
  const accessToken = useSelector((state: any) => state.user.accessToken);

  const fetchPaymentHistory = async (accessToken: string) => {
    const response = await api.get("/api/payment/history", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  // useQuery를 사용해 결제 내역 조회
  const { data, isLoading, isError } = useQuery({
    queryKey: ["paymentHistory"],
    queryFn: () => fetchPaymentHistory(accessToken),
    enabled: !!accessToken,
  });

  if (isError) {
    message.error("결제 내역을 불러오는 중 오류가 발생했습니다.");
  }

  const tableData = data?.payments.map((payment: any) => ({
    key: payment._id,
    product: payment.cartItems
      .map((item: any) => `${item.productName} (${item.quantity}개)`)
      .join(" , "),
    price: `${payment.totalPrice.toLocaleString()}원`,
    date: dayjs(payment.createdAt).format("YYYY-MM-DD"),
  }));

  return (
    <div>
      <Table
        columns={[
          { title: "상품명", dataIndex: "product", key: "product" },
          { title: "가격", dataIndex: "price", key: "price" },
          { title: "결제일", dataIndex: "date", key: "date" },
        ]}
        dataSource={tableData} // 테이블에 표시할 데이터
        loading={isLoading} // 로딩 상태를 테이블에 반영
        pagination={false} // 페이지네이션 비활성화
      />
    </div>
  );
}
