# Introduce

A web application built with **React / Next.js** that demonstrates task management and inbox messaging features using a public dummy API.

---

## API Source

This project uses the **DummyJSON API**:

```
https://dummyjson.com/
```

### API Endpoints Used

| Feature | Endpoint |
|-------|----------|
| Inbox / Comments | `/comments` |
| Posts | `/posts` |
| Users | `/users` |
| Tasks / Todos | `/todos` |

---

## Features

### Task Management
- Display list of todos
- Create new tasks
- Edit task title and due date
- Mark tasks as completed
- Delete tasks
- Optimistic UI updates for better user experience

---

### Inbox / Messaging
- View message threads
- Send new messages
- Edit sent messages
- Delete messages
- Message action menu (Edit / Delete / Reply)

---

### Bonus Feature
**Reply Inbox**
- Reply to a specific message
- Reply preview appears above the message input
- Replied message is shown as a quoted message in the chat bubble
- Reply preview can be canceled before sending

---

## Architecture

The project uses a **clean and scalable architecture**:

```
API (DummyJSON)
   ↓
Service Layer
   ↓
Custom Hooks
   ↓
UI Components
```

### Service Layer
- Handles all API communication
- Responsible for fetching, creating, updating, and deleting data

### Custom Hooks
- Encapsulate data fetching logic using React Query
- Manage loading, error, and optimistic update states

Examples:
- `useTodos`
- `useInbox`

### Components
- Focus only on UI rendering
- Consume data from custom hooks
- No direct API calls inside components

---

## Tech Stack

- **React / Next.js**
- **TypeScript**
- **TanStack React Query**
- **Tailwind CSS**
- **DummyJSON API**

---

## Highlights

- Clean separation of concerns
- Optimistic UI for better UX
- Reusable hooks and components
- Scalable architecture
- Bonus feature implemented (Reply Inbox)

---
