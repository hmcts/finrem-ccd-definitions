#!/bin/bash

# Count the number of files in the build/output directory
file_count=$(find build/output -type f | wc -l | xargs)

# Confirm with the user if they wish to proceed
read -rp "This will update $file_count secrets. Do you wish to continue? [Y/N]: " confirm
if [[ $confirm != [Yy] ]]; then
    echo "Update cancelled"
    exit 1
fi

# Loop to download secrets based on the file count
for ((i=1; i<=file_count; i++))
do
    az keyvault secret set --file build/output/judgedetails-$i.json --name fixedlists-consented-judgedetails-$i --vault-name finrem-aat
    echo "Secret fixedlists-consented-judgedetails-$i updated"
done

echo "Update complete"
