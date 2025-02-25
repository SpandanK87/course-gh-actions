#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Warning: .env file not found"
fi

# Check if repository details are provided as environment variables
if [ -z "${{ secrets.GH_REPOSITORY }}" ]; then
    echo "Error: GITHUB_REPOSITORY environment variable is not set"
    echo "Please set it in .env file or use: GITHUB_REPOSITORY=owner/repo $0"
    exit 1
fi

# Extract owner and repo from GITHUB_REPOSITORY
OWNER=$(echo ${{ secrets.GH_REPOSITORY }} | cut -d'/' -f1)
REPO=$(echo ${{ secrets.GH_REPOSITORY }} | cut -d'/' -f2)

# GitHub API URL
API_URL="https://api.github.com/repos/$OWNER/$REPO/commits"

# Fetch all commits
echo "Fetching commits from ${{ secrets.GH_REPOSITORY }}..."
curl -s "$API_URL" | \
    jq -r '.[] | "Commit: \(.sha)\nAuthor: \(.commit.author.name)\nDate: \(.commit.author.date)\nMessage: \(.commit.message)\n--------------------------------"'

# Check if the curl command was successful
if [ $? -ne 0 ]; then
    echo "Error: Failed to fetch commits"
    exit 1
fi
