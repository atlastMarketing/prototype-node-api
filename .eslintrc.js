module.exports = {
    root: true,
    env: {
        jest: true,
    },
    extends: 'airbnb-base',
    rules: {
        'no-underscore-dangle': 0,
        'no-param-reassign': 0,
        'no-return-assign': 0,
        'no-trailing-spaces': 1,
        camelcase: 0,
        indent: ['error', 4],
    },
};
