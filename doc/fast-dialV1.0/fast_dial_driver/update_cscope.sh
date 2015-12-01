#!/bin/bash

rm -rf cscope.*
rm -rf ncscope.*
find `pwd`  -name "*.hpp" -o -name "*.h" -o -name "*.c" -o -name "*.cc" -o -name "*.cpp" > cscope.files
cscope -bkq -i cscope.files

