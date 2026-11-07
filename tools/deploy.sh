#!/bin/sh
# Deploy the neutron-star page to the website with rclone, then run the post-deploy check.
#   EXPLORABLES_URL=https://host/path/neutron-star.html [EXPLORABLES_REMOTE=explorables] [EXPLORABLES_PATH=neutron-star] sh tools/deploy.sh
# The credentials live in an rclone remote (created once with `rclone config`), never in this repo or in chat.
# Uses `rclone copy` (adds and overwrites, never deletes) so it cannot wipe anything else on the site.
set -eu
: "${EXPLORABLES_URL:?set EXPLORABLES_URL to the final page address}"
REMOTE="${EXPLORABLES_REMOTE:-explorables}"; DEST="${EXPLORABLES_PATH:-neutron-star}"
cd "$(dirname "$0")/.."
node tools/build.mjs --site
rclone copy dist-site "$REMOTE:$DEST" --checksum -v
node tools/smoke_test.mjs "$EXPLORABLES_URL"
