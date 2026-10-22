#!/usr/bin/env bash
# Runs inside the recorder image: voice, recording, assembly. Credentials come from the env file
# (HUB_USER, HUB_PASS); the signed-in session file is deleted at the end.
set -euo pipefail
cd /rec-app
cp /rec/*.mjs .
node tts.mjs
node record.mjs
node assemble.mjs
rm -f /out/state.json
