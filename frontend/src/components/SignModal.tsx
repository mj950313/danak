import { useState, useEffect } from "react";
import Input from "../components/Input";
import { IoMdClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { login } from "../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface SignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SignFormData {
  name: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  id: string;
  pwd: string;
}

export default function SignModal({ isOpen, onClose }: SignModalProps) {
  const [currentTab, setCurrentTab] = useState("로그인");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setError,
    formState: { errors, isValid },
  } = useForm<SignFormData>({ mode: "onChange" });

  const password = watch("password");

  useEffect(() => {
    setIsButtonDisabled(!isValid);
  }, [isValid]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  const onSignUp = async (data: SignFormData) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        data
      );
      setLoginMessage("회원가입이 완료되었습니다!");
      handleTabChange("로그인");
      console.log(response.data);
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.error === "이미 사용 중인 이메일입니다.") {
        setError("email", {
          type: "manual",
          message: "이미 사용 중인 이메일입니다.",
        });
      } else if (
        error.response?.data?.error === "이미 사용 중인 닉네임입니다."
      ) {
        setError("nickname", {
          type: "manual",
          message: "이미 사용 중인 닉네임입니다.",
        });
      } else {
        console.error("회원가입 실패", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSignIn = async (data: SignFormData) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: data.id,
          password: data.pwd,
        },
        { withCredentials: true }
      );
      const { accessToken, user } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", user); // 객체는 문자열로 변환
      console.log(response.data);

      dispatch(login({ accessToken, user }));
      onClose();
      navigate("/");
    } catch (error: any) {
      if (error.response?.status === 400) {
        setError("pwd", {
          type: "manual",
          message: "이메일 또는 비밀번호가 일치하지 않습니다.",
        });
      } else {
        console.error("로그인 실패", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* 모달 콘텐츠 */}
      <div className="bg-white px-8 sm:px-16 py-16 rounded-lg shadow-lg z-50 transition-all w-[300px] sm:w-[500px] lg:w-[600px] relative">
        <button onClick={onClose} className="text-2xl absolute right-4 top-4">
          <IoMdClose />
        </button>
        <div className="flex items-center mb-8 border-b-[3px]">
          <div className="flex gap-6">
            <button
              onClick={() => handleTabChange("로그인")}
              className={`font-bold text-lg pb-4 ${
                currentTab === "로그인"
                  ? "text-blue-500 border-b-[3px] border-blue-500 -mb-[3px]"
                  : ""
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => handleTabChange("회원가입")}
              className={`font-bold text-lg pb-4 ${
                currentTab === "회원가입"
                  ? "text-blue-500 border-b-[3px] border-blue-500 -mb-[3px]"
                  : ""
              }`}
            >
              회원가입
            </button>
          </div>
        </div>

        {/* 로그인 폼 */}
        {currentTab === "로그인" && (
          <form onSubmit={handleSubmit(onSignIn)}>
            {loginMessage && (
              <p className="mb-4 text-green-500 text-lg text-center">
                {loginMessage}
              </p>
            )}
            <Input
              text="이메일"
              type="email"
              className="w-full mb-4 border"
              {...register("id", {
                required: "이메일을 입력하세요.",
              })}
            />
            <Input
              text="비밀번호"
              type="password"
              className="w-full mb-4 border"
              {...register("pwd", {
                required: "비밀번호를 입력하세요.",
              })}
            />
            {errors.pwd && (
              <p className="text-red-500 text-sm mb-2">{errors.pwd.message}</p>
            )}
            <button className="w-full py-5 mt-2 text-xl font-bold bg-blue-500 rounded text-white hover:bg-blue-600">
              {isLoading ? (
                <FaSpinner className="animate-spin inline-block mr-2" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        )}

        {/* 회원가입 폼 */}
        {currentTab === "회원가입" && (
          <form onSubmit={handleSubmit(onSignUp)}>
            <div className="mb-2">
              <Input
                text="이름"
                className="w-full p-2 mb-2 border"
                {...register("name", {
                  required: "이름을 입력하세요.",
                  minLength: {
                    value: 2,
                    message: "이름은 2자 이상이어야 합니다.",
                  },
                  maxLength: {
                    value: 6,
                    message: "이름은 6자 이내여야 합니다.",
                  },
                })}
                onBlur={() => trigger("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="mb-2">
              <Input
                text="닉네임"
                className="w-full p-2 mb-2 border"
                {...register("nickname", {
                  required: "닉네임을 입력하세요.",
                  minLength: {
                    value: 2,
                    message: "닉네임은 2자 이상이어야 합니다.",
                  },
                  maxLength: {
                    value: 6,
                    message: "닉네임은 6자 이내여야 합니다.",
                  },
                })}
                onBlur={() => trigger("nickname")}
              />
              {errors.nickname && (
                <p className="text-red-500 text-sm">
                  {errors.nickname.message}
                </p>
              )}
            </div>

            <div className="mb-2">
              <Input
                text="이메일"
                className="w-full p-2 mb-2 border"
                type="email"
                {...register("email", {
                  required: "이메일을 입력하세요.",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "올바른 이메일 형식을 입력하세요.",
                  },
                })}
                onBlur={() => trigger("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-2">
              <Input
                text="핸드폰"
                className="w-full p-2 mb-2 border"
                {...register("phoneNumber", {
                  required: "핸드폰 번호를 입력하세요.",
                  pattern: {
                    value: /^\d{3}\d{3,4}\d{4}$/,
                    message: "올바른 핸드폰 번호를 입력하세요.",
                  },
                })}
                onBlur={() => trigger("phoneNumber")}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="mb-2">
              <Input
                text="비밀번호"
                className="w-full p-2 mb-2 border"
                type="password"
                {...register("password", {
                  required: "비밀번호를 입력하세요",
                  minLength: {
                    value: 8,
                    message: "비밀번호는 8자 이상이어야 합니다.",
                  },
                })}
                onBlur={() => trigger("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="mb-2">
              <Input
                text="비밀번호 확인"
                className="w-full p-2 mb-2 border"
                type="password"
                {...register("confirmPassword", {
                  required: "비밀번호 확인을 입력하세요.",
                  validate: (value) =>
                    value === password || "비밀번호가 일치하지 않습니다.",
                })}
                onBlur={() => trigger("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isButtonDisabled || isLoading}
              className={`w-full py-5 mt-2 text-xl font-bold bg-blue-500 rounded text-white hover:bg-blue-600 ${
                isButtonDisabled || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? (
                <FaSpinner className="animate-spin inline-block mr-2" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
