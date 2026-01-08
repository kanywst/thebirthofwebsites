# Project Documentation: The Birth of Websites

## 1. Project Overview
This project, internally named `dateofbirth`, is a Vue.js application that visualizes the founding dates and history of major tech companies, services, and programming languages. It allows users to filter these entities by type, nationality, and era, or search by keyword. The application supports both English and Japanese languages.

## 2. Directory Structure
```
/Users/takumaniwa/thebirthofwebsites/
├── public/              # Static assets (images, flags - served directly)
│   ├── flag/            # Country flag images
│   └── ...              # Logo images
├── src/                 # Source code
│   ├── assets/          # Static assets (processed by Vite)
│   ├── components/      # Vue components
│   │   ├── Birth.vue    # Main logic and display component
│   │   ├── Footer.vue   # Site footer
│   │   └── Header.vue   # Site header
│   ├── App.vue          # Root Vue component
│   ├── i18n.js          # Internationalization configuration
│   └── main.js          # Entry point
├── info.json            # Data source (JSON)
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── ...
```

## 3. Key Technologies
*   **Vue.js (v3.x):** Frontend framework.
*   **Vue I18n (v11.x):** Internationalization plugin.
*   **Vite:** Build tool and development server.

## 4. Architecture & Processing Flow

The application follows a standard Vue.js client-side rendering architecture. Data is stored statically in `info.json` and loaded by the `Birth.vue` component.

### Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant Browser
    participant MainJS as src/main.js
    participant I18n as src/i18n.js
    participant App as App.vue
    participant Birth as Birth.vue
    participant JSON as info.json

    User->>Browser: Access Website
    Browser->>MainJS: Load Bundle
    MainJS->>I18n: Import messages
    I18n-->>MainJS: Return messages
    MainJS->>MainJS: Initialize I18n instance
    MainJS->>App: Initialize Vue Instance with I18n
    App->>Birth: Render Child Component

    rect rgb(240, 248, 255)
        note right of Birth: Data Loading Phase
        Birth->>JSON: Import Data (info.json)
        JSON-->>Birth: Return Data Objects
        Birth->>Birth: Initialize 'items' data
        Birth->>Birth: Compute 'sortedItemsByDate'
    end

    Birth-->>App: Return Rendered HTML (List of items)
    App-->>Browser: Update DOM
    Browser-->>User: Display List

    rect rgb(255, 240, 240)
        note right of User: Interaction Phase
        User->>Birth: Type keyword / Click Filter
        Birth->>Birth: Trigger 'type_filter' / Update 'keyword'
        Birth->>Birth: Re-evaluate 'filteredItems' computed property
        Birth-->>Browser: Update DOM (Filtered List)
    end
```
