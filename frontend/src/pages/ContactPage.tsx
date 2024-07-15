import KakaoMap from "../components/ContactComponent/KakaoMap";

export default function ContactPage() {
  return (
    <div className="bg-[url('/contact.png')] bg-repeat-x bg-blend-multiply bg-blue-300">
      <div className="flex flex-col gap-3 xl:w-[1280px] mx-auto px-3 xl:px-8 py-28 xl:py-48">
        <h1 className="text-white text-4xl xl:text-5xl font-bold">
          Contact Us
        </h1>
        <p className="text-white text-xl xl:text-2xl">문의하기</p>
      </div>

      <div className="border bg-white">
        <KakaoMap />
      </div>
    </div>
  );
}
