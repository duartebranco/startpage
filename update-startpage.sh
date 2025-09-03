#!/bin/bash

WALLPAPER_PATH=$(cat ~/.cache/wal/wal)
EXTENSION="${WALLPAPER_PATH##*.}"

cp ~/.cache/wal/colors.css src/theme/colors.css

rm src/theme/wallpaper*

cp "$WALLPAPER_PATH" src/theme/wallpaper.${EXTENSION}

