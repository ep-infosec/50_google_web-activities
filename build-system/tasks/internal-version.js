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

const argv = require('minimist')(process.argv.slice(2));
const crypto = require('crypto');
const fs = require('fs-extra');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const packageVersion = packageJson.version;

// Used to e.g. references the ads binary from the runtime to get
// version lock.
let version = argv.version ? String(argv.version) : String(packageVersion);
if (!version.endsWith('.0')) {
  throw new Error('Version must always end with .0');
}
version = version.substring(0, version.length - 2);
exports.VERSION = version;
