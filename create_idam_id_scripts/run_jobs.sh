#!/bin/bash

# Exit immediately if any command fails
set -e

echo "Running caseworker.sh..."
./caseworker.sh aat add

echo "Running judiciary.sh..."
./judiciary.sh aat

echo "Both scripts executed successfully."