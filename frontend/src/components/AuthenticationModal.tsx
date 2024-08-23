import { Modal, Button } from "antd";
import { useState } from "react";
import SignModal from "../components/SignModal";
import { MdLockPerson } from "react-icons/md";

interface AuthenticationModalProps {
  visible: boolean;
  onClose: () => void;
}

const AuthenticationModal: React.FC<AuthenticationModalProps> = ({
  visible,
  onClose,
}) => {
  const [isSignModalVisible, setIsSignModalVisible] = useState(false);

  const handleLoginClick = () => {
    onClose();
    setIsSignModalVisible(true);
  };

  const handleSignModalClose = () => {
    setIsSignModalVisible(false);
  };

  return (
    <>
      <Modal
        title={
          <div className="flex items-center justify-center text-4xl mt-5">
            <MdLockPerson />
            LOGIN
          </div>
        }
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            닫기
          </Button>,
          <Button key="login" type="primary" onClick={handleLoginClick}>
            로그인
          </Button>,
        ]}
      >
        <p className="text-center mt-10 text-base">
          지금 회원이 되시면 다양한 서비스를 편리하게 이용하실 수 있습니다.
        </p>
      </Modal>

      <SignModal isOpen={isSignModalVisible} onClose={handleSignModalClose} />
    </>
  );
};

export default AuthenticationModal;
