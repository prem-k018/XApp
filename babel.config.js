module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@src': './src',
        '@components': './src/components',
        '@screens': './src/screens',
        '@navigation': './src/navigation',
        '@hooks': './src/hooks',
        '@utils': './src/utils',
        '@services': './src/services',
        '@assets': './src/assets'
      }
    }],
    'react-native-reanimated/plugin'
  ]
};
