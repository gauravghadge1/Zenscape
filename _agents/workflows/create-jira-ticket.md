---
description: How to create a Jira ticket according to the autonomous SDLC protocol
---
# JIRA TICKET CREATION PROTOCOL

This workflow governs how to automatically create formal Jira tickets via the Atlassian MCP tool. You must follow this every time you plan a new feature, break down an epic, or identify a necessary sub-task during active development.

## 1. Trigger First, Code Second
You must successfully create the Jira ticket via the MCP tool and output the new Jira Issue Key **before** writing or modifying any codebase files related to that task.

## 2. Standardized Fields
Due to an MCP JSON parsing bug with the Labels array, you must split how you assign metadata:

- **Labels (Via Title):** You must **NOT** pass labels via the JSON payload. Instead, inject the appropriate tag directly into the beginning of the Issue Summary. 
  - If you can execute the code autonomously: Use `[ai-task]`
  - If the task requires human physical intervention: Use `[manual-task]`
  - Format: `[TAG] Actual Task Title`
- **Components (Via Payload):** You **MUST** pass the component normally through the MCP tool payload. Choose one from: `Strategy`, `Development`, `Data Engineering`, `QA-Testing`, or `Infrastructure`.

## 3. Strict Description Template
You must format the ticket description using this exact markdown structure. Do not deviate or omit sections:

### 1. Context & Architecture
* **Goal:** [Brief statement of the technical objective]
* **Architecture Docs:** [Relevant Confluence link, or "To be generated upon completion"]

### 2. Acceptance Criteria
* [ ] Requirement 1: [Specific logic, mathematical, or functional requirement]
* [ ] Requirement 2: [Specific logic, mathematical, or functional requirement]

### 3. Target Workspace Files
* **ALLOWED FILES:** [List specific file paths you are permitted to edit to achieve this goal]
* **FORBIDDEN:** [List sensitive files you must not touch]

### 4. Definition of Done
* Code meets all Acceptance Criteria.
* Tests pass in the CI/CD pipeline.
* Confluence documentation is updated via MCP.
