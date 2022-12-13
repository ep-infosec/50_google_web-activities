/**
 * Copyright 2017 The Web Activities Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var commonTestPaths = [
  'test/_init_tests.js',
  '!node_modules',
  {
    pattern: 'test/fixtures/*.html',
    included: false,
    nocache: false,
    watched: true,
  },
  {
    pattern: 'dist/**/*.js',
    included: false,
    nocache: false,
    watched: true,
  },
  {
    pattern: 'test/coverage/**/*',
    included: false,
    nocache: false,
    watched: false,
  },
];

var basicTestPaths = [
  'test/functional/**/*-test.js',
];

var testPaths = commonTestPaths.concat(basicTestPaths);

var unitTestPaths = commonTestPaths.concat([
  'test/functional/**/*.js',
]);

var integrationTestPaths = commonTestPaths.concat([
  'test/integration/**/*.js',
]);

/** @const  */
module.exports = {
  commonTestPaths: commonTestPaths,
  basicTestPaths: basicTestPaths,
  testPaths: testPaths,
  unitTestPaths: unitTestPaths,
  integrationTestPaths: integrationTestPaths,
  lintGlobs: [
    '**/*.js',
    '!**/*.extern.js',
    '!**/*.min.js',
    '!{node_modules,build,dist,third_party,build-system}/**/*.*',
    '!{testing}/**/*.*',
    '!test/describes.js',
    '!test/fixtures/**/*.*',
    '!eslint-rules/**/*.*',
    '!gulpfile.js',
    '!karma.conf.js',
    '!test/coverage/**/*.*',
  ],
  jsonGlobs: [
    '**/*.json',
    '!{node_modules,build,dist,third_party,build-system}/**/*.*',
  ],
  presubmitGlobs: [
    '**/*.{js,go}',
    '!**/*.min.js',
    '!{node_modules,build,dist}/**/*.*',
    '!build-system/tasks/*.js',
    '!build-system/server/*.js',
    '!build/polyfills.js',
    '!build/polyfills/*.js',
    '!gulpfile.js',
    '!third_party/**/*.*',
    '!test/coverage/**/*.*',
  ],
  changelogIgnoreFileTypes: /\.md|\.json|\.yaml|LICENSE|CONTRIBUTORS$/
};
