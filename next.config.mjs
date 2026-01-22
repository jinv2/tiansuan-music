/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true, // 忽略构建时的代码风格检查，防止报错
  },
  images: {
    unoptimized: true, // 静态导出必须关闭图片优化
  },
};

export default nextConfig;
