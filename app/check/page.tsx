
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckPage() {
  const router = useRouter();

  const [face, setFace] = useState(false);
  const [arm, setArm] = useState(false);
  const [speech, setSpeech] = useState(false);
  const [onsetMinutesAgo, setOnsetMinutesAgo] = useState<number | null>(null);
  const [unknownOnset, setUnknownOnset] = useState(false);

  const handleResult = () => {
  const emergency = face || arm || speech;

  const query = new URLSearchParams();
  query.set("emergency", String(emergency));

  if (unknownOnset) {
    query.set("onset", "unknown");
  } else if (onsetMinutesAgo !== null) {
    const onsetTime = Date.now() - onsetMinutesAgo * 60 * 1000;
    query.set("onset", String(onsetTime));
  }

  router.push(`/result?${query.toString()}`);
};

  return (
    <main className="min-h-screen px-6 py-10 bg-white">
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold mb-2">FAST 체크</h1>

        <p className="text-gray-600 mb-8">
          해당되는 증상이 하나라도 있으면 즉시 119에 연락해야 합니다.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => setFace(!face)}
            className={`w-full text-left p-5 rounded-2xl border ${
              face ? "border-red-600 bg-red-50" : "border-gray-200"
            }`}
          >
            <div className="font-bold">F — Face</div>
            <div className="text-sm text-gray-600">
              얼굴 한쪽이 처지거나 비대칭인가요?
            </div>
          </button>

          <button
            onClick={() => setArm(!arm)}
            className={`w-full text-left p-5 rounded-2xl border ${
              arm ? "border-red-600 bg-red-50" : "border-gray-200"
            }`}
          >
            <div className="font-bold">A — Arm</div>
            <div className="text-sm text-gray-600">
              한쪽 팔 힘이 약해졌나요?
            </div>
          </button>

          <button
            onClick={() => setSpeech(!speech)}
            className={`w-full text-left p-5 rounded-2xl border ${
              speech ? "border-red-600 bg-red-50" : "border-gray-200"
            }`}
          >
            <div className="font-bold">S — Speech</div>
            <div className="text-sm text-gray-600">
              말이 어눌해졌나요?
            </div>
          </button>
        </div>
        <div className="mt-8">
  <h2 className="font-bold mb-3">증상은 언제 시작됐나요?</h2>

  <div className="grid grid-cols-2 gap-3">
    {[
      { label: "방금 전", value: 0 },
      { label: "30분 전", value: 30 },
      { label: "1시간 전", value: 60 },
      { label: "2시간 전", value: 120 },
    ].map((item) => (
      <button
        key={item.label}
        onClick={() => {
          setOnsetMinutesAgo(item.value);
          setUnknownOnset(false);
        }}
        className={`p-4 rounded-2xl border text-sm font-bold ${
          onsetMinutesAgo === item.value && !unknownOnset
            ? "border-red-600 bg-red-50"
            : "border-gray-200"
        }`}
      >
        {item.label}
      </button>
    ))}

    <button
      onClick={() => {
        setOnsetMinutesAgo(null);
        setUnknownOnset(true);
      }}
      className={`col-span-2 p-4 rounded-2xl border text-sm font-bold ${
        unknownOnset ? "border-red-600 bg-red-50" : "border-gray-200"
      }`}
    >
      시간 모름
    </button>
  </div>
</div>
        <button
          onClick={handleResult}
          className="w-full mt-8 bg-red-600 text-white text-lg font-bold py-4 rounded-2xl"
        >
          결과 확인
        </button>
      </div>
    </main>
  );
}