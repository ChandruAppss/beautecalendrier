#!/bin/sh
# usage: tools/shot.sh WIDTH HEIGHT OUT
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=$1,$2 --force-device-scale-factor=1 --virtual-time-budget=6000 --screenshot="$3" "http://localhost:5510/?static" >/dev/null 2>&1
