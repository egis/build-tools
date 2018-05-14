#!/bin/bash

set +e
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash
export NVM_DIR="/opt/circleci/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

if [ "${NODE_VERSION}" == "" ]; then
  NODE_VERSION="8.10.0"
fi
nvm install v${NODE_VERSION}
nvm alias default v${NODE_VERSION}

# Each step uses the same `$BASH_ENV`, so need to modify it
echo 'export NVM_DIR="/opt/circleci/.nvm"' >> $BASH_ENV
echo "[ -s \"$NVM_DIR/nvm.sh\" ] && . \"$NVM_DIR/nvm.sh\"" >> $BASH_ENV
