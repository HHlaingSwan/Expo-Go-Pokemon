module.exports = function (api) {
  api.cache(true);
  return {
    // NativeWind is a preset (it returns a { plugins: [...] } object).
    presets: ["babel-preset-expo", "nativewind/babel"],
    plugins: [],
  };
};
