# Task Manager

A Jira-inspired task management application built with React and TypeScript. It provides a Kanban-style board where users can create, edit, delete, and move tasks between different stages using drag and drop.

## 🚀 Live Demo

https://task-manager-woad-gamma-25.vercel.app/

## 📌 Features

- Create new tasks
- Edit existing tasks
- Delete tasks
- Drag and drop tasks between columns
- Task status management
- Task descriptions and tags
- Task count for each column
- Data persistence using Local Storage
- Jira-inspired Kanban board UI
- Responsive layout

## 📋 Task Columns

The board contains four task statuses:

- **To Do**
- **In Progress**
- **In Review**
- **Completed**

## 🛠️ Technologies Used

- React
- TypeScript
- Tailwind CSS
- React DnD
- React DnD HTML5 Backend
- Local Storage
- Vite

## 💾 Data Storage

The current version uses the browser's **Local Storage** to persist task data.

Tasks remain available after refreshing the page. Since Local Storage is browser-specific, the data is stored locally on the user's device rather than on a remote database.

## 🖱️ Drag and Drop

Drag-and-drop functionality is implemented using `react-dnd` and `react-dnd-html5-backend`.

Users can drag tasks from one column and drop them into another column to change their status.

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yujinashrestha/Task-Manager-.git
