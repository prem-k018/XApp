module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
          '@app': './src',
          '@components': './src/components',
          '@constants': './src/constants',
          '@navigators': './src/navigators',
          '@screens': './src/screens',
          '@services': './src/services',
          '@assets': './src/assets',
          '@utils': './src/utils',
          '@deeplinks': './src/deeplinks',
          '@model': './src/model',
          '@resource': './src/resource',
        },
      },
    ],
  ],
};
