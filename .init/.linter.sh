#!/bin/bash
cd /home/kavia/workspace/code-generation/presentation-builder-pro-7026-7035/frontend_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

