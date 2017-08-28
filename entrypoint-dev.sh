#!/bin/sh
set -e
source /venv/bin/activate

# Honcho has this weird problem with buffering output
# but in dev we can afford this penalty

# DO NOT USE THIS FOR PROD!
export PYTHONUNBUFFERED=1

exec "$@"
