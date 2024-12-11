
# What is ngEditorHierarchy?

ngEditorHierarchy offers a comprehensive solution for building hierarchical editor forms and grid views to efficiently perform CRUD operations on complex JSON objects. It seamlessly handles nested JSON structures, enabling you to create and manage hierarchical forms and grids with unlimited depth.

# How can ngEditorHierarchy benefit you?

As a developer, ngEditorHierarchy empowers you to accelerate your development process by providing pre-built, customizable editor forms and grid views. You can easily adapt and integrate these components into your Angular applications to handle complex CRUD operations. By leveraging ngEditorHierarchy's robust features, you can significantly boost your productivity and streamline your development workflow. 

It is easy to see that it is not a straightforward task to manually integrate ngEditorHierarchy codes into your project. 

We have a powerful free online tool [JSON to Editor Hierachy](https://jsontoeditors.web.app) automatically and instantly build a ngEditorHierarchy from a JSON string. That is, from a JSON string representing a single business record, you can use this tool to build the hierarchical editor forms and grid views for the whole business record list. 

## Please try <a href="https://jsontoeditors.web.app" target="_blank">JSON String to Editor Hierachy</a>

# What's included in ngEditorHierarchy?

### Editor Forms: 
Angular Reactive Forms are used to create, edit, and delete JSON objects.
### Grid Views: 
Two powerful grid view options are available:
#### Ag-Grid: 
A feature-rich grid component for displaying and editing data.
#### PrimeNG's PTable: 
A versatile table component with customizable features.
### Hierarchical Structure: 
Nested JSON objects and arrays are seamlessly handled through a hierarchical structure of forms and grids.
### Child Forms and Grids: 
User-friendly icons trigger the display of child forms and grids, allowing for deep-level data manipulation.
By utilizing ngEditorHierarchy, you can simplify your Angular development process and create efficient, user-friendly interfaces for complex data structures.

## Please try <a href="https://jsontoeditors.web.app" target="_blank">JSON String to Editor Hierachy</a>

# Visual Data Types

ngEditorHierarchy employs various visual representations (Visual Data Types) for different JSON object field data types, enhancing user experience and data clarity:

### Simple: 
Simple data types like strings and numbers are directly displayed in grid views and use standard HTML input elements like text fields and numbers in editor forms.

### Array: 
Fields containing arrays are denoted by an icon and a count in the grid view. Editor forms utilize custom controls to allow users to easily add and manage values within the array. Specific formatting is applied to Boolean arrays within this category.

### Object and ArrayObject: 
Fields containing nested objects or arrays of objects are marked with icons in both the grid view and the editor form. Clicking an icon opens the corresponding child editor form or grid view for deeper editing.

### Long String: 
Fields containing lengthy text are not shown in grid views due to space constraints. Editor forms provide a multi-line text area element for users to comfortably input and edit long strings.

# Selecting Values from Predefined Arrays

Beyond manual input, ngEditorHierarchy facilitates selecting values from pre-defined arrays within editor forms. This streamlines data entry for users. The option to select a single value is available for simple data types, while multiple selections can be made for array data types. These predefined arrays are stored in a central location (editor-hierarchy.constants.ts). You can easily add new arrays to this file and reference them in your editor forms to enable value selection.

# Technology Stack

ngEditorHierarchy leverages a robust technology stack to deliver efficient CRUD operations:

* [Angular](https://angular.dev) 
The core framework for building the application.
* [NGRX](https://ngrx.io/)
Provides state management functionalities.
* [Firestore](https://firebase.google.com/docs/firestore)
Firebase's NoSQL database for data storage.
* [Angular Fire](https://github.com/angular/angularfire)
Integrates Firebase with Angular.
* [ngxBootstrap](https://valor-software.com/ngx-bootstrap/#/documentation)
Provides UI components for enhanced user experience.
* [AgGrid](https://www.ag-grid.com)
A powerful grid component for data display and manipulation.
* [PrimeNG](https://primeng.org/)
Offers a rich set of UI components for building custom interfaces.

# Sample Editor Hierarchies

Once built into a web application, ngEditorHierarchy showcases its capabilities through several interactive sample editor hierarchies. You can directly interact with these sample hierarchies, creating, editing, and deleting data. All changes are saved to and retrieved from a Firestore database. Explore these samples to gain a deeper understanding of ngEditorHierarchy's potential and its ability to streamline complex data management tasks.

## Please try <a href="https://jsontoeditors.web.app" target="_blank">JSON String to Editor Hierachy</a>
