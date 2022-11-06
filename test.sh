rm -rf ./lambda/origin-response-function/node_modules
 
mkdir -p lambda/origin-response-function/shared
mkdir -p lambda/viewer-request-function/shared
cd shared
cp * ../lambda/origin-response-function/shared
cp * ../lambda/viewer-request-function/shared
cd ..
npm test

