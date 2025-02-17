#!/bin/bash

mkdir -p build/backup

# Count the number of files in the build/output directory
file_count=$(find build/output -type f | wc -l | xargs)

# Loop to download secrets based on the file count
for ((i=1; i<=file_count; i++))
do
    az keyvault secret download --file build/backup/fixedlists-consented-judgedetails-$i --name fixedlists-consented-judgedetails-$i --vault-name finrem-aat
done

echo "Secrets backed up to build/backup directory"
