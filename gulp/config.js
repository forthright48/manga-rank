module.exports = {
  path: {
    dirs: {
      public: './public',
      temp: './temp'
    },
    pug: './views/**/*.pug',
    images: './src/**/*.{JPG,jpg,png,gif}',
    css: [
      './src/**/*.css',
      './node_modules/@forthright48/simplecss/src/*.css'
    ],
    js: './src/**/*.js',
    vendor: {
      components: {
        all: 'src/**/vendor/**/*.*',
        js: 'src/**/vendor/**/*.js',
        nonJs: [
          'app/**/vendor/**/*',
          '!app/**/vendor/**/*.js'
        ]
      }
    },
    browsersync: ['./public/**/*.css', './public/**/*.js']
  }
};
