#!/bin/bash

# Check if the input file parameter is provided
if [ -z "$1" ]; then
    echo "Usage: ./split-judges-fixedlist-json.sh <input_file>"
    exit 1
fi

# Input JSON file
input_file="$1"

# Output directory for split files
output_directory="output"

# Create output directory if it doesn't exist
mkdir -p "$output_directory"

# Counter variables
file_counter=1
element_counter=0
element_processed_counter=0
output=""

# Total number of items in the JSON array
total_items=$(jq 'length' "$input_file")
echo "Found total number of Judges $((total_items))"

# Calculate the number of files
file_count=$(( (total_items + 114) / 115 ))

# Use jq to split the JSON array into separate files
jq -c '.[]' "$input_file" | while IFS= read -r item; do
    # Append the item to the output variable
    output+="$item,"

    # Increment the element counter
    element_counter=$((element_counter + 1))
    # Increment the element processes counter
    element_processed_counter=$((element_processed_counter + 1))

    # Check if the element counter reaches the maximum limit
    if [ "$element_counter" -eq 115 ] || [ "$element_processed_counter" -eq $total_items ]; then
        # Remove the trailing comma from the output
        output=${output%,}

        # Create a new output file for each group of elements
        filename="$output_directory/judge-$file_counter.json"

        # Format the output as a JSON array and write it to the file
        echo "[$output]" | jq '.' > "$filename"

        # Increment the file counter
        file_counter=$((file_counter + 1))

        # Reset the element counter and output variable
        element_counter=0
        output=""

        # Print progress to console
        echo "Processed $((file_counter - 1)) files out of $file_count..."
    fi
done

# Print completion message to console
echo "Splitting JSON array into separate files completed!"
