export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <div className="max-w-sm w-full text-center">
        <div className="text-5xl mb-6">🚨</div>

        <h1 className="text-3xl font-bold mb-4">
          FAST119
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          부모님이 갑자기 이상해 보인다면,
          <br />
          뇌졸중 의심 증상을 빠르게 확인하세요.
        </p>

        <a href="/check">
          <button className="w-full bg-red-600 text-white text-lg font-bold py-4 rounded-2xl">
            FAST 체크 시작
          </button>
        </a>

        <p className="text-xs text-gray-400 mt-6 leading-relaxed">
          이 서비스는 진단을 제공하지 않습니다.
          <br />
          응급 상황이 의심되면 즉시 119에 연락하세요.
        </p>
      </div>
    </main>
  );
}