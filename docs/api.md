# Blog Platform API Documentation

Base URL: `http://localhost:3000/api`

Authentication: `Authorization: Bearer <token>` header required on protected routes.

---

## Authentication

### POST /auth/register
Register a new user.

**Body:**
```json
{ "username": "alice", "email": "alice@example.com", "password": "secret123" }
```
**Response 201:**
```json
{ "success": true, "data": { "id": 1, "username": "alice", "email": "alice@example.com", "role": "USER" } }
```
**Errors:** `409` email already registered | `422` validation errors

---

### POST /auth/login
Login and receive JWT token.

**Body:**
```json
{ "email": "alice@example.com", "password": "secret123" }
```
**Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "user": { "id": 1, "email": "alice@example.com", "role": "USER" }
  }
}
```
**Errors:** `401` invalid credentials | `403` account deactivated

---

### GET /auth/me 🔒
Returns the authenticated user's decoded token payload.

---

## Blogs

### GET /blogs
List blogs with pagination, search, and sorting (public).

**Query params:**
| Param | Default | Description |
|---|---|---|
| `page` | 1 | Page number |
| `pageSize` | 5 | Items per page |
| `keyword` | `` | Search in title and description |
| `sort` | `newest` | `newest` or `oldest` |

**Response 200:**
```json
{
  "success": true,
  "data": [ { "id": 1, "title": "...", "username": "alice", "like_count": 2, ... } ],
  "meta": { "total": 20, "page": 1, "pageSize": 5 }
}
```

---

### GET /blogs/:id
Get a single blog with like details (public).

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1, "title": "...", "description": "...", "image_url": null,
    "like_count": 3, "liked": false,
    "likedUsers": [{ "id": 2, "username": "bob" }]
  }
}
```
**Errors:** `404` not found

---

### GET /blogs/my-posts 🔒
Returns authenticated user's own non-deleted blogs.

---

### POST /blogs 🔒
Create a new blog post. Accepts `multipart/form-data` for image upload.

**Body (form-data):**
| Field | Required | Description |
|---|---|---|
| `title` | ✓ | 3–200 chars |
| `description` | ✓ | Min 10 chars |
| `image` | ✗ | Image file (jpg, png, gif, webp) max 5MB |

**Response 201:** Created blog object

---

### PUT /blogs/:id 🔒
Update own blog (or admin). Same `form-data` body as POST.

**Errors:** `403` not owner | `404` not found

---

### DELETE /blogs/:id 🔒
Soft-delete a blog. Users can delete own; admins can delete any.

**Response 200:** `{ "success": true, "message": "Blog deleted." }`

**Errors:** `403` not owner | `404` not found

---

### POST /blogs/:id/like 🔒
Toggle like/unlike on a blog. Returns new like state.

**Response 200:**
```json
{ "success": true, "data": { "liked": true, "likeCount": 5 } }
```

---

## Comments

### GET /blogs/:blogId/comments
Get nested comment tree for a blog (public).

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1, "content": "Great post!", "username": "bob",
      "is_edited": 0, "replies": [
        { "id": 2, "content": "Thanks!", "parent_comment_id": 1, ... }
      ]
    }
  ]
}
```

---

### POST /blogs/:blogId/comments 🔒
Create a comment or reply.

**Body:**
```json
{ "content": "Great article!", "parentCommentId": null }
```
Set `parentCommentId` to an existing comment ID to create a reply.

**Response 201:** Created comment object

**Errors:** `404` blog or parent not found | `422` validation

---

### PUT /blogs/:blogId/comments/:commentId 🔒
Edit own comment (sets `is_edited = 1`).

**Body:** `{ "content": "Updated text" }`

**Errors:** `403` not owner | `404` not found

---

### DELETE /blogs/:blogId/comments/:commentId 🔒
Soft-delete a comment. Users can delete own; admins can delete any.

**Response 200:** `{ "success": true, "message": "Comment deleted." }`

---

## Admin (ADMIN role required)

All admin routes require `Authorization: Bearer <admin-token>`.

### GET /admin/users
List all non-deleted users.

**Response 200:**
```json
{ "success": true, "data": [ { "id": 1, "username": "alice", "role": "USER", "is_active": 1, ... } ] }
```

---

### PUT /admin/users/:id/activate
Activate a user account (set `is_active = 1`).

**Response 200:** Updated user object

---

### PUT /admin/users/:id/deactivate
Deactivate a user account (set `is_active = 0`).

**Response 200:** Updated user object

---

### DELETE /admin/users/:id
Soft-delete a user (set `is_deleted = 1`, `is_active = 0`).

**Response 200:** `{ "success": true, "message": "User deleted." }`

**Errors:** `400` cannot delete self | `404` not found

---

## Error Response Format

All errors follow this structure:
```json
{ "success": false, "message": "Human-readable error message." }
```

Validation errors (422):
```json
{
  "success": false,
  "errors": [ { "msg": "Valid email required.", "path": "email" } ]
}
```

## HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (valid token, insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 422 | Unprocessable Entity (validation) |
| 500 | Internal Server Error |
