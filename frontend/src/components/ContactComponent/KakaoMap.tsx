import React from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const KakaoMap: React.FC = () => {
  const markerPosition = {
    lat: 37.545121745994905,
    lng: 126.67605400085449,
  };

  return (
    <div className="relative w-full h-[500px]">
      <Map
        center={markerPosition}
        style={{ width: "100%", height: "100%" }}
        level={2} // 지도의 확대 레벨
      >
        <MapMarker // 마커 표시
          position={markerPosition}
          onClick={() => alert("인천 서구청입니다.")} // 마커 클릭 시 알림
        />
      </Map>
    </div>
  );
};

export default KakaoMap;
