/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // 👈 关键修改：使用新版插件名
    autoprefixer: {},
  },
};

export default config;
