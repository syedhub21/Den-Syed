#!/bin/bash
cd /home/z/my-project
export NODE_OPTIONS="--max-old-space-size=384"
# Double-fork to fully detach
(
  (
    exec node node_modules/.bin/next dev -p 3000 --webpack
  </dev/null >>/home/z/my-project/dev.log 2>&1 &
)
)
