import { Hospital } from "@/types/hospital";

export const mockHospitals: Hospital[] = [
  {
    id: "1",
    name: "서울대학교병원",
    address: "서울특별시 종로구 대학로 101",
    phone: "02-2072-2114",
    lat: 37.5796,
    lng: 126.9990,
    canThrombectomy: true,
  },
  {
    id: "2",
    name: "서울아산병원",
    address: "서울특별시 송파구 올림픽로43길 88",
    phone: "1688-7575",
    lat: 37.5263,
    lng: 127.1082,
    canThrombectomy: true,
  },
  {
    id: "3",
    name: "세브란스병원",
    address: "서울특별시 서대문구 연세로 50-1",
    phone: "1599-1004",
    lat: 37.5623,
    lng: 126.9408,
    canThrombectomy: true,
  },
];