#!/bin/bash

# Define the parent directory
parent_dir="$(pwd)"

# Loop through the subdirectories
for dir in */; do
    # Remove the trailing slash from the directory name
    dir="${dir%/}"

    # Change to the project directory
    cd "$parent_dir/$dir"

    # Run npm start in the background
    npm start &

    # Change back to the parent directory
    cd "$parent_dir"
done