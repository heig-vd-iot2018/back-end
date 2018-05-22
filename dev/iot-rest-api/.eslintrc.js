module.exports = {
	"extends": "airbnb-base",
	"rules": {
		"import/no-extraneous-dependencies": [
			"error",
			{
				"devDependencies": true,
			}
		],
    "comma-dangle": ["error", {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
    }]
	},
  "env": {
    "mocha": true,
  },
};
