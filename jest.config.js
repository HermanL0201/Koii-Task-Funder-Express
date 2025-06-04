// Configuration is now in package.json
export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  extensionsToTreatAsEsm: ['.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(@koii|axios))'
  ]
};