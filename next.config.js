/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // S3 정적 호스팅을 위한 설정
  output: 'export', // 정적 HTML로 내보내기
  images: {
    unoptimized: true, // S3에서는 이미지 최적화 비활성화
  },
};

module.exports = nextConfig;


