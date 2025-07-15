#!/bin/bash

# Set the maximum waiting time (in minutes) and initialize the counter
timeout="${TIMEOUT}"
interval="${INTERVAL}"
workflow_name="${WORKFLOW}"
repository_name="${REPOSITORY}"
sha="${SHA}"
counter=0

echo "ℹ️ Inputs:"
echo "ℹ️   Repository: ${repository_name}"
echo "ℹ️   Workflow file name: ${workflow_name}"
echo "ℹ️   Commit SHA: ${sha}"
echo "ℹ️   Timeout for the workflow to complete: ${timeout} minutes"
echo "ℹ️   Interval between checks: ${interval} seconds"

if [[ ! "$SHA" =~ ^[0-9a-f]{40}$ ]]; then
  echo "❌ Invalid commit SHA provided. Exiting."
  exit 1
fi

  while true; do

    response=$(gh run list --repo "${repository_name}" --commit="${sha}" --workflow="${workflow_name}" --status=success)
    
    echo "$response"
    
    if echo "$response" | grep -q "set the GH_TOKEN"; then
      echo "GH_TOKEN env var not set"
      exit 1
    elif ! echo "$response" | grep -q "no runs found"; then
      echo "🎉 Workflow ${workflow_name} finished for ${sha}"
      break
    fi

    # Increment the counter and check if the maximum waiting time is reached
    counter=$((counter + 1))
    if [ $((counter * interval)) -ge $((timeout * 60)) ]; then
      echo "Maximum waiting time for the workflow to finish reached. Exiting."
      exit 1
    fi

    sleep "$interval"
  done
