@echo off
rem See https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html for UNIX version...
echo { > dist/cjs/package.json
echo   "type": "commonjs" >> dist/cjs/package.json
echo } >> dist/cjs/package.json

echo { > dist/mjs/package.json
echo   "type": "module" >> dist/mjs/package.json
echo } >> dist/mjs/package.json

