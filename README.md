# ethix.sh

`ethix` is a web-based operating system as a fun side-project for me to further familiarize myself with modern JavaScript practices.
This acts as a monorepo for the frontend and backend of the project.

## Layout

The frontend of the project acts as a user interface. In the user interface,
the user can interact with the operating system and its applications. Users can install apps, create files,
change settings, and more.

## Stack

### Frontend

-   HTML
-   CSS
-   JavaScript

### Backend

-   Node.js
-   Express.js

## Making a Program

### Frontend

(Note: These features are currently planned, and not fully implemented.)
You can create an application in the `apps` folder by giving it a unique application identifier in the folder name, i.e.

```
apps/
    my-application-id/
        index.html
        index.js
        index.css
```

The backend, when serving these applications, will automatically inject the `index.js` file into the main page. The contents
of the `index.js` file are deferred.

To create a new program, in your `index.js` file, create a new instance of the `Program` class. Example:

```javascript
import { Program } from 'ApplicationManager';

function main() {} // Runs when the program is ready

new Program(
    'application-name', // the name of the application
    'window-defined-in-index.html', // the window to use
    'index.html', // your HTML file containing the window code
    main // the function to run when the program is ready
);
```

The program will be injected into the application if the user has it installed.

TODO: Create documentation for interacting with the OS

### Backend

TODO: Create documentation for interacting with the backend package manager and appfetcher.
