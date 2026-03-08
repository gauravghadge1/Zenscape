---
description: How to manage version control and commits to GitHub
---
# VERSION CONTROL & GITHUB WORKFLOW

To maintain high development velocity while enforcing quality control, you are strictly forbidden from pushing code directly to the `main` branch. You must follow the Pull Request workflow below:

## 1. Branching
Use the `mcp_github-mcp-server_create_branch` tool to autonomously create a new branch formatted as `feature/[JIRA_ISSUE_KEY]-short-description` off of the default branch.

## 2. Committing & Pushing
To avoid bothering the user with manual terminal approval for Git commands, you **MUST** use the GitHub MCP server to commit and push changes remotely.
Use the `mcp_github-mcp-server_push_files` tool (for multiple files) or `mcp_github-mcp-server_create_or_update_file` tool (for single files) instead of running local terminal `git commit` and `git push` commands.

Commit your code using the standard format including the Jira Issue Key:
`feat([JIRA_ISSUE_KEY]): description`

Example: `feat(SDLC-12): Implement Kotak Neo Python SQLite connection string`

## 4. Pull Request
Use the GitHub MCP server to autonomously open a Pull Request into the `main` branch. The PR title must include the Jira Issue Key.

## 5. Jira PR Link Comment
After opening the Pull Request, use the Atlassian MCP to add a **highly detailed comment** to the Jira ticket alerting the Senior Reviewer. It must follow this exact format:

```markdown
🚀 **Development Complete: PR Ready for Review**

The code for this task has been written, tested, and pushed. A Pull Request has been opened and the ticket transitioned to **IN REVIEW**.

🔗 **Pull Request:** [Link to PR]

### 📦 What changed:
- [Detail 1 exactly what you modified/created]
- [Detail 2 exactly what you modified/created]

### 🧪 How it was tested:
- [Explain how you verified it works]

Awaiting Senior Technical Lead review.
```

Once the PR is opened and the comment is posted, your job as the Developer is complete. The Senior Reviewer Persona will evaluate the PR.