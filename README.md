# API Documentation

## Overview

This API is built using **Node.js** and **Express.js**. It provides a simple interface to retrieve and modify content stored in a [dontcode](https://dontcode.vercel.app) file.

### Link

* https://dontcode-api.onrender.com/api/v1/

## Endpoints

### 1. Retrieve Content

* **Method:** `GET`

* **Endpoint:**`/api/v1/:code`

* **Description:** Returns the content of the `dontcode` file

* **Response:**

```
{
    "content": "...file content here..."
}
```

### 2. Update Content

* **Method:** `PUT`

* **Endpoint:** `/api/v1/:code`

* **Description:** Updates the `dontcode` file with new content

* **Request Body:**

```
{
    "content": "new content here",
    "overwrite": true
}
```

* **Parameters:**
  
  * `content` (string, required): The new content to be added
  
  * `overwrite` (boolean, required):
    
    * `true`: Replaces the entire content of the file
    
    * `false`: Appends the new content to the existing file

* **Response:** 

```
{
    "message": "Content updated successfully"
}
```
