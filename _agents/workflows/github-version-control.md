---
description: How to manage version control and commits to GitHub
---
# VERSION CONTROL & GITHUB WORKFLOW

To maintain high development velocity while enforcing quality control, you are strictly forbidden from pushing code directly to the `main` branch. You must follow the Pull Request workflow below:

## 1. Branching
Create a new local branch formatted as `feature/[JIRA_ISSUE_KEY]-short-description`.

## 2. Committing
Commit your code using the standard format including the Jira Issue Key you created for the task:
`feat([JIRA_ISSUE_KEY]): description`

Example: `feat(SDLC-12): Implement Kotak Neo Python SQLite connection string`

## 3. Pushing
Push your local tracking branch to the remote repository.

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
