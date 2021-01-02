#!/usr/bin/env bash

GHOST_EXPORT_FILE="adventures-of-a-code-ninja.ghost.2020-10-01-09-22-41.json"

for POST in $(cat "$GHOST_EXPORT_FILE" | jq -rc '.db[0].data.posts[] | @base64'); do
  POST_DATA=$(echo "$POST" | base64 --decode)

  PUBLISHED_DATE=$(echo "$POST_DATA" | jq -r '.published_at')

  if [[ "$PUBLISHED_DATE" == "null" ]]; then
    continue
  fi

  PUBLISHED_AT=$(echo "$PUBLISHED_DATE" | awk 'BEGIN{FS="T"}; {printf "%s", $1}')

  TITLE=$(echo "$POST_DATA" | jq -r '.title')
  SLUG=$(echo "$POST_DATA" | jq -r '.slug')
  CONTENT=$(echo "$POST_DATA" | jq -r '.plaintext')


  FILEPATH="./content/posts/$PUBLISHED_AT-$SLUG.md"

  echo "importing \"$TITLE\" to file $FILEPATH"

  cat > "$FILEPATH" <<EOF
---
title: "$TITLE"
date: $PUBLISHED_AT
draft: true
---

$CONTENT
EOF

done
