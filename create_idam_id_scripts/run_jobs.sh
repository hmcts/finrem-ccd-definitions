#!/bin/bash

# Exit immediately if any command fails
set -e

echo "Running caseworker.sh..."
./create_idam_id_scripts/caseworker.sh aat add Password123!

echo "Running judiciary.sh..."
./create_idam_id_scripts/judiciary.sh aat Hmcts1234

echo "Both scripts executed successfully."