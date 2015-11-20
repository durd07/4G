#!/bin/bash

PWD=`pwd`
echo ${PWD}

export CROSS_COMPILE=${TOOLPREFIX}
export CC=${CROSS_COMPILE}gcc
export STRIP=${CROSS_COMPILE}strip
export LC_GENERL_INCLUDE_DIR=${PWD}/include
export LC_LIB_DIR=${PWD}/lib
export INSTALL_ROOT=${PWD}

cd ./lib_ndis
make  clean
make prep
make  
make install
cd ../

make -f Makefile.manager
make -f Makefile.ndis_test
