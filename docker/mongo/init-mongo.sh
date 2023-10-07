#!/bin/bash
set -e

mongo <<EOF
use admin
db.createUser({
  user:  '$MONGO_QUERY_USERNAME',
  pwd: '$MONGO_QUERY_PWD',
  roles: [{
    role: '$MONGO_QUERY_ROLE',
    db: '$MONGO_QUERY_DATABASE'
  }]
})
EOF
