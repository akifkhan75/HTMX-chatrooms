# HTMX Chat Rooms - CRUD PoC

A simple proof-of-concept chat room application demonstrating HTMX for CRUD operations.

## Features

- Create chat rooms with unique names
- Edit room names (creator only)
- Delete rooms (creator only)
- List all available rooms
- No page reloads during operations

## Setup

1. Clone this repository or download the files
2. Open `index.html` in a modern web browser
   - No server required as it uses mock API calls

## Usage

1. Enter your username in the input field
2. Create a new room by entering a name and clicking "Create"
3. Rooms you create will show Edit and Delete buttons
4. Other users' rooms will only show a Join button
5. Click Edit to modify your room's name
6. Click Delete to remove your room

## HTMX Integration

The application uses HTMX attributes to handle all CRUD operations:

- `hx-get`, `hx-post`, `hx-put`, `hx-delete` for different HTTP methods
- `hx-target` to specify where to place the response
- `hx-swap` to control how content is inserted
- Custom events to refresh the room list after changes

## Limitations

- No actual chat functionality (focus is on room CRUD)
- No persistence (data is lost on page refresh)
- No authentication (simple username check)