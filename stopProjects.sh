#!/bin/bash

# Define the parent directory
parent_dir="$(pwd)"

# Loop through the subdirectories
for dir in */; do
    # Remove the trailing slash from the directory name
    dir="${dir%/}"

    # Change to the project directory
    cd "$parent_dir/$dir"

    # Find the process ID (PID) of the running npm start process
    pid=$(ps -ef | grep "npm start" | grep -v grep | awk '{print $2}')

    # If a process was found, kill it
    if [ -n "$pid" ]; then
        kill "$pid"
    fi

    # Change back to the parent directory
    cd "$parent_dir"
done