#!/usr/bin/bash

# Obfuscate the JS files using 
# https://github.com/javascript-obfuscator/javascript-obfuscator

FOLDER_SOURCE="src"
FOLDER_TARGET="dist"

BIN_JS="/usr/bin/javascript-obfuscator"

#BASEDIR=$(dirname $0)
#echo "Script location: ${BASEDIR}"

if [ ! -f ${BIN_JS} ]; then
    echo "The script need javascript-obfuscator"
    echo "Please install as golbal module"
    echo "npm -g install javascript-obfuscator"
fi

#echo ">>> Check ${FOLDER_SOURCE}"
if [ ! -d ${FOLDER_SOURCE} ]; then
    echo ">>> Source folder ${FOLDER_SOURCE} not found"
    exit 0
fi

#echo ">>> Check ${FOLDER_TARGET}"
if [ ! -d ${FOLDER_TARGET} ]; then
    #echo ">>> mkdir ${FOLDER_TARGET}"
    mkdir ${FOLDER_TARGET}
else
    # remove everything in ${FOLDER_TARGET}
    #echo ">>> Clearing ${FOLDER_TARGET}"
    rm ${FOLDER_TARGET}/*
fi


# copy everythign form ${FOLDER_SOURCE} to ${FOLDER_TARGET}
rsync -aq ${FOLDER_SOURCE}/ ${FOLDER_TARGET}



for SCRIPT_JS in ${FOLDER_TARGET}/*.js; do
    #echo
    #echo ${SCRIPT_JS}
    #grep "function " ${SCRIPT_JS}
    
    filename=$(basename -- ${SCRIPT_JS})
    extension="${filename##*.}"
    filename="${filename%.*}"
    #echo ${extension}
    #echo ${filename}
    
    # Obfuscate the JS file
    ${BIN_JS} --compact false --string-array-encoding rc4 --reserved-names 'init, btnOK, btnCancel' ${SCRIPT_JS} > /dev/null
    
    # Rename the file
    cp ${SCRIPT_JS} ${FOLDER_TARGET}/${filename}_ori.${extension}
    mv ${FOLDER_TARGET}/${filename}-obfuscated.${extension} ${SCRIPT_JS}
done

#javascript-obfuscator --compact false --string-array-encoding rc4 --reserved-names 'init, openTab' script.js
