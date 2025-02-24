#!/bin/bash

# Prompt the user to input the number of secrets in the key vault
read -rp "Enter the number of secrets in the key vault: " file_count

mkdir -p build/backup

# Ensure the build/backup directory is empty
rm -rf build/backup/*

# Loop to download secrets
for ((i=1; i<=file_count; i++))
do
   az keyvault secret download --file build/backup/fixedlists-consented-judgedetails-$i --name fixedlists-consented-judgedetails-$i --vault-name finrem-aat
done

echo "Secrets backed up to build/backup directory"
