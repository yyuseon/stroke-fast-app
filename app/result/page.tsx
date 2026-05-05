"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getDistanceKm } from "@/lib/distance";
import { getEstimatedEtaMinutes } from "@/lib/eta";

export default function ResultPage() {
  const params = useSearchParams();
  const emergency = params.get("emergency") === "true";

  const [apiHospitals, setApiHospitals] = useState<any[]>([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // 📍 위치 가져오기
  useEffect(() => {
    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      () => {
        setUserLocation(null);
        setIsLoadingLocation(false);
      }
    );
  }, []);

  // 🏥 병원 API 호출
  useEffect(() => {
    if (!userLocation) return;

    const fetchHospitals = async () => {
      setIsLoadingHospitals(true);

      const res = await fetch(
        `/api/hospitals?lat=${userLocation.lat}&lng=${userLocation.lng}`
      );

      if (!res.ok) {
  console.error("API route error", res.status);
  setApiHospitals([]);
  setIsLoadingHospitals(false);
  return;
}

const data = await res.json();

setApiHospitals(data.hospitals || []);
setIsLoadingHospitals(false);
    };

    fetchHospitals();
  }, [userLocation]);

  // ⏱ 시간 계산
  const [elapsedMinutes, setElapsedMinutes] = useState<number | null>(null);
  const [isUnknownOnset, setIsUnknownOnset] = useState(false);

  useEffect(() => {
    const onsetParam = params.get("onset");

    if (!onsetParam) return;

    if (onsetParam === "unknown") {
      setIsUnknownOnset(true);
      return;
    }

    const onsetTime = parseInt(onsetParam, 10);

    const update = () => {
      const diff = Date.now() - onsetTime;
      setElapsedMinutes(Math.floor(diff / 60000));
    };

    update();
    const interval = setInterval(update, 10000);

    return () => clearInterval(interval);
  }, [params]);

  // 📍 거리 + ETA 계산
  const hospitals = userLocation
    ? apiHospitals
        .map((h) => {
          const distanceKm = getDistanceKm(
            userLocation.lat,
            userLocation.lng,
            h.lat,
            h.lng
          );

          return {
            ...h,
            distanceKm,
            etaMinutes: getEstimatedEtaMinutes(distanceKm),
          };
        })
        .sort((a, b) => {
  if (a.canThrombectomy !== b.canThrombectomy) {
    return a.canThrombectomy ? -1 : 1;
  }

  return a.distanceKm - b.distanceKm;
})
    : [];

  return (
    <main className="min-h-screen px-6 py-10 bg-white">
      <div className="max-w-sm mx-auto">

        {emergency ? (
          <>
            <div className="text-5xl mb-6 text-center">🚨</div>

            <h1 className="text-2xl font-bold text-red-600 mb-4 text-center">
              뇌졸중 의심
            </h1>

            {elapsedMinutes !== null && (
              <p className="text-center text-red-600 font-bold mb-4 text-lg">
                ⏱ {elapsedMinutes}분 경과
              </p>
            )}

            <a href="tel:119">
              <button className="w-full bg-red-600 text-white py-4 rounded-2xl mb-3">
                119 전화하기
              </button>
            </a>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("카카오톡에 붙여넣기 하세요.");
              }}
              className="w-full bg-yellow-300 py-4 rounded-2xl mb-6"
            >
              카카오톡 공유
            </button>

            <h2 className="text-lg font-bold mb-3">가까운 병원</h2>

            {isLoadingLocation && (
              <p className="text-center text-gray-500">📍 위치 확인 중...</p>
            )}

            {isLoadingHospitals && (
              <p className="text-center text-gray-500">🏥 병원 불러오는 중...</p>
            )}

            <div className="space-y-3">
              {hospitals.map((h) => (
                <div key={h.id} className="border p-4 rounded-xl">
                  <div className="font-bold">{h.name}</div>
                  <div className="text-sm text-gray-500">{h.address}</div>
                  <div className="text-sm">
                    {h.distanceKm.toFixed(1)}km · {h.etaMinutes}분
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center">이상 없음</p>
        )}

      </div>
    </main>
  );
}