#!/bin/bash

# Exit immediately if any command fails
set -e

echo "Running caseworker.sh..."
./caseworker.sh aat add Password123!

echo "Running judiciary.sh..."
./judiciary.sh aat Hmcts1234

echo "Both scripts executed successfully."