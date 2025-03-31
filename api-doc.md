# Api doc

## auth and account
when user make a request needed authentication, it must provide the access token (JWT),
if the token is expired (response with code `4`), it should make a token refresh immediately before any
further request

### Authorization / Login
* POST /api/auth
- Success
```json
{
    "code": 0,
    "message": "authenticate successfully",
    "fields": {
        "account": {
            "uid": 3,
            "nickname": "pomook",
            "avatar": null,
            "state": "ACTIVE",
            "role": "ADMIN"
        }
    }
}
```

- Incorrect email or password
```json
{
    "code": 3,
    "message": "email or password is incorrect"
}
```

### Current account brief
* GET /api/account/me/public
- Success
```json
{
    "code": 0,
    "message": "success",
    "fields": {
        "account": {
            "uid": 3,
            "nickname": "pomook",
            "avatar": null,
            "state": "ACTIVE",
            "role": "ADMIN"
        }
    }
}
```

- Access token has expired
```json
  {
    "code": 4,
    "message": "token has expired"
}
```

### Token refresh
* POST /api/auth/refresh
- Success
```json
{
    "code": 0,
    "message": "token is refreshed successfully"
}
```

- Refresh token is empty / expired
```json
{
    "code": 5,
    "message": "refresh token is empty"
}
```

### Logout
* Post /api/auth/logout
- Success
```json
{
    "code": 0,
    "message": "you've been signed out!"
}
```

## Blog Writing
to write a blog, the user must log in, in `ACTIVE` state and have the authority `WRITE_BLOG`, and in step followed:
1. Create a Blog
2. Edit the Blog
3. Change visibility to PUBLIC

### Blog init
POST /api/blog/write
- Params:
  - title: the title of this blog
  - abstract*: a summary or introduction of this blog
    - default: Start writing...
  - isPublic*: is the blog Public or Private at init
    - default: false
* SUCCESS
```json
{
    "code": 0,
    "message": "init article successfully, id [5b2fbfb5-1f02-455e-8884-7d6cdccc48bd]",
    "fields": {
        "author": {
            "uid": 3,
            "nickname": "pomook",
            "avatar": null,
            "state": "ACTIVE",
            "role": "ADMIN"
        },
        "article": {
            "id": "5b2fbfb5-1f02-455e-8884-7d6cdccc48bd",
            "authorUid": 3,
            "title": "Test article",
            "introduction": "this is an article for test",
            "content": "Start writing now...",
            "visibility": "PUBLIC",
            "postTime": "2025-03-17T13:36:51",
            "editedTime": "2025-03-17T13:36:51"
        }
    }
}
```

### Edit article prop
PUT /api/blog/edit/{id}/prop
- JSON:
  - title
  - abstract
  - visibility: PUBLIC, PRIVATE
```json
{
  "title": "this is edited article",
  "abstract": "this article has been edited",
  "visibility": "PRIVATE"
}
```

- SUCCESS
```json
{
    "code": 0,
    "message": "props updated successfully"
}
```

### Edit article content
PUT /api/blog/edit/{id}/content
- JSON:
  - content
```json
{
    "content": "### article title: How to using the blog system"
}
```

- SUCCESS:
```json
{
  "code": 0,
  "message": "content updated successfully"
}
```

## Blog read
`PUBLIC` blog read and search should be available for everyone, including not login guest.
if target blog is `PRIVATE`, the reader must be either the author or has `READ_ALL_BLOG`. 

### read article detail
GET /api/blog/read/{articleId}/public
- SUCCESS:
```json
{
    "code": 0,
    "message": "5b2fbfb5-1f02-455e-8884-7d6cdccc48bd",
    "fields": {
        "author": {
            "uid": 3,
            "nickname": "pomook",
            "avatar": null,
            "state": "ACTIVE",
            "role": "ADMIN"
        },
        "article": {
            "id": "5b2fbfb5-1f02-455e-8884-7d6cdccc48bd",
            "authorUid": 3,
            "title": "this is edited article",
            "introduction": "this article has been edited",
            "content": "### article title: How to using the blog system",
            "visibility": "PRIVATE",
            "postTime": "2025-03-17T13:36:51",
            "editedTime": "2025-03-17T13:55:10"
        }
    }
}
```

### article search
GET /api/blog/search/public
- PARAMS:
  - keyword*: title prefix
  - author*: author id
  - page*: default 0
  - size*: default 12
- EMPTY LIST:
```json
{
    "code": 0,
    "message": "search list",
    "fields": {
        "hasPrevious": false,
        "hasNext": false,
        "articles": [],
        "authors": []
    }
}
```
- SUCCESS:
```json
{
    "code": 0,
    "message": "search list",
    "fields": {
        "hasPrevious": false,
        "hasNext": false,
        "articles": [
            {
                "id": "5b2fbfb5-1f02-455e-8884-7d6cdccc48bd",
                "authorUid": 3,
                "title": "this is edited article",
                "introduction": "this article has been edited",
                "visibility": "PUBLIC",
                "editedTime": "2025-03-17T15:38:12"
            }
        ],
        "authors": [
            {
                "uid": 3,
                "nickname": null,
                "avatar": null,
                "state": null,
                "role": "3"
            }
        ]
    }
}
```

## File upload
provide two ways of file upload:
1. directly upload for single, small (less than 1MB) file
2. chunk upload for large file

chunk upload contains steps:
1. **front** get the file target, calculate the chunk count and size based on file size
2. **front** read file chunk by chunk, calculate the md5 value for each chunk, and store in an array in index
3. **front** also calculate the md5 value of the whole file
4. **front** send an init task request(file name, extension, size, chunk count, chunk size, md5 of the file, path)
5. **back** validate the request, and check if the md5 of file exist in database
   * if exists: directly return uploaded successfully, and store a file_image in database
(image_id, path, owner, size, real_file_id)
   * if not: continue
6. **back** generate a UUID as task id, store a UploadTask(md5 of file, ...other detail) into cache
with task id as the key, and create temp file, record file under a temp folder, then send back the task id
7. **front** receive the task id, slice the file chunk by chunk, after read one chunk,
send an upload request(task id, md5 of chunk, chunk index, chunk size)
8. **back** receive the request, read <index> byte from the record file, if equals 1, meaning this chunk has been
upload. Otherwise, calculate the md5 and compare with front sent to check if chunk has been corrupted
9. **back** open a random access file to the temp file, write the chunk start from index * chunk size
10. after writing chunk successfully, write the <index> byte of record file to 1, and send a success response
11. looping this until all chunk has been uploaded successfully
12. **front** sent a merge request(taskId), **back** then check the record file if all chunk has been uploaded,
then move the temp file to /upload/default/<md5>.<extension>, and store the real_file, and file_image into database

chunk upload resume step:
1. **front** sent the taskId to **back**, which selecting task from the cache
   * if exists: reading from the record file, and return missing index list
   * if not: response task expiry or not exist
2. continues the upload loop