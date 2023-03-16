#!/bin/sh

# This script is used to build the site
# documentation which is not tagged per release.
#

if [ $# -eq 0 ]; then
  echo "Usage: $0 { 'develop' | 'master' }..."
  echo
  echo "Examples:"
  echo
  echo "    $0 develop        # build develop"
  echo "    $0 master         # build master"
  exit 2
fi

# Check if node and npx are available
node_version=$(node --version 2>/dev/null)
if [ -z "$node_version" ]; then
  echo "Node.js is not installed"
  exit 1
fi
major_version=$(echo $node_version | egrep -o "v([0-9]+)\." | cut -c 2- | rev | cut -c 2- | rev)
if [ "$major_version" -lt "16" ]; then
  echo "Node.js version $node_version is not supported. Please upgrade to version 16 or higher."
  node_path=$(which node)
  echo "node_path=${node_path}"
  exit 1
fi
npx_version=$(npx --version 2>/dev/null)
if [ -z "$npx_version" ]; then
  echo "npx is not installed"
  exit 1
fi

while test $# -gt 0; do
  if [ "$1" = "develop" ]; then
    npx antora --fetch \
      --attribute boost_version=$1 \
      --attribute boost_site_prefix=develop/ \
      site.playbook.yml
  elif [ "$1" = "master" ]; then
    npx antora --fetch \
      --attribute boost_version=$1 \
      --attribute boost_site_prefix= \
      site.playbook.yml
  else
    echo "invalid argument: '$1'"
  fi
  shift
done
