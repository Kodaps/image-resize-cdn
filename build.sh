
#copy shared files to dir 
rm -rf ./lambda/origin-response-function/shared
rm -rf ./lambda/viewer-request-function/shared

mkdir -p lambda/origin-response-function/shared
mkdir -p lambda/viewer-request-function/shared

# run docker to build w/ sharp binaries
docker buildx build --platform=linux/amd64 --tag amazonlinux:nodejs .
docker run --rm --volume ${PWD}/lambda/origin-response-function:/build amazonlinux:nodejs /bin/bash -c "source ~/.bashrc; npm init -f -y; npm install sharp --save; npm install --only=prod"
docker run --rm --volume ${PWD}/lambda/viewer-request-function:/build amazonlinux:nodejs /bin/bash -c "source ~/.bashrc; npm init -f -y; npm install --only=prod"

# copy shared 
cd shared
cp * ../lambda/origin-response-function/shared
cp * ../lambda/viewer-request-function/shared
cd ..

mkdir -p dist && cd lambda/origin-response-function && zip -FS -q -r ../../dist/origin-response-function.zip * && cd ../..
mkdir -p dist && cd lambda/viewer-request-function && zip -FS -q -r ../../dist/viewer-request-function.zip * && cd ../..
cd dist
aws s3 cp . s3://com.ecotree.lambdas/ --profile=ecotree --recursive
cd ..
rm -rf ./lambda/origin-response-function/shared
rm -rf ./lambda/viewer-request-function/shared

