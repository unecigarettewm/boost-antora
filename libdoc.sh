#!/bin/sh

# This script is used to build the Antora-based
# documentation for Boost libraries and for the
# versioned site documentation such as the
# User's Guide.
#

if [ $# -eq 0 ]; then
  echo "Usage: $0 { branch | version | 'release' | 'all' }..."
  echo
  echo "    branch : 'develop' | 'master' | 'release'"
  echo "    version: [0-9]+ '.' [0-9]+ '.' [0-9]+"
  echo "    'release': builds master to build/doc/html"
  echo "    'all': rebuilds develop, master, and every version"
  echo
  echo "Examples:"
  echo
  echo "    $0 develop master      # build develop and master"
  echo "    $0 1.83.0              # build tagged version boost-1.83.0"
  exit 2
fi

# Check if node and npx are available
node_version=$(node --version 2>/dev/null)
if [ -z "$node_version" ]; then
  echo "Node.js is not installed"
  exit 1
fi
#major_version=$(echo $node_version | egrep -o "v([0-9]+)\." | cut -c 2- | rev | cut -c 2- | rev)
#if [ "$major_version" -lt "16" ]; then
#  echo "Node.js version $node_version is not supported. Please upgrade to version 16 or higher."
#  node_path=$(which node)
#  echo "node_path=${node_path}"
#  exit 1
#fi
npx_version=$(npx --version 2>/dev/null)
if [ -z "$npx_version" ]; then
  echo "npx is not installed"
  exit 1
fi

# Run antora command
while test $# -gt 0; do
  if [ "$1" = "develop" ] || [ "$1" = "master" ]; then
    npx antora --fetch \
      --attribute page-boost-branch=$1 \
      --attribute page-boost-ui-branch=$1 \
      libs.playbook.yml

  elif [ "$1" = "release" ]; then
    npx antora --fetch \
      --attribute page-boost-branch=master \
      --attribute page-boost-ui-branch=master \
      --attribute page-boost-is-release=true \
      libs.playbook.yml

  elif echo "$1" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$'; then
    f="./history/libs.$1.playbook.yml"
    if [ -f "$f" ]; then
      echo "Building playbook $f"
      npx antora --fetch \
      --attribute page-boost-branch=$1 \
      --attribute page-boost-ui-branch=master \
        "$f"
    else
      echo "Playbook \"$f\" does not exist"
    fi

  elif [ "$1" = "all" ]; then
    for f in ./history/*.yml; do
      echo "Building playbook $f"
      npx antora --fetch \
        --attribute page-boost-branch=$branch \
        --attribute page-boost-ui-branch=$branch \
        "$f"
    done
    for branch in master develop; do
      echo "Building playbook libs.playbook.yml for $branch branch"
      npx antora --fetch \
        --attribute page-boost-branch=$branch \
        --attribute page-boost-ui-branch=$branch \
        libs.playbook.yml
    done
  else
    echo "invalid argument: '$1'"
  fi
  shift
done
