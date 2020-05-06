# ToDoList api documentation

## Users
| api URL | HTTP Method | Description | Request JSON | Response JSON |
| ------ | ------ | ------ | ------ | ------ |
| /api/auth | POST | Login user ito system | {"username": "userlogin", "password": "userpass"} | {"WebAPIToken": "LoNgSTRingTokEnWiTHusErseSSiOn"} |
| /api/auth/out | GET | Logout user from the sysem | | {"message": "User logged out"} |
| /api/user/add | POST | Add new user into the sytem | {"username": "userlogin", "password": "userpass"} | {"id": "5b7c04b448da35000bfa6930", "username": "userlogin", "password": "userpass"} |

## Tasks
| api URL | HTTP Method | Description | Request JSON | Response JSON |
| ------ | ------ | ------ | ------ | ------ |
| /api/tasks | GET | Get list of all task of current user | | [{"name": "task name example", "description": "description for task", "task_id": "idexample", "date": "11.08.2018"}] |
| /api/tasks/taskid | GET | Get info about task by id | | {"name": "task name example", "description": "description for task", "task_id": "idexample", "date": "11.08.2018"} |
| /api/tasks | POST | Add new task for current user | {"WebAPIToken": "LoNgSTRingTokEnWiTHusErseSSiOn", "name": "task name example", "description": "description for task", "date": "11.08.2018"} | {"name": "task name example", "description": "description for task", "task_id": "idexample", "date": "11.08.2018"} |
| /api/tasks/taskid | PUT | Update task for corrent user by task id | {"WebAPIToken": "LoNgSTRingTokEnWiTHusErseSSiOn", "task_id": "idexample","name": "new task name", "date": "13.08.2018"} | {"name": "new task name", "description": "description for task", "task_id": "idexample", "date": "13.08.2018"} |
| /api/tasks/taskid | DELETE | Drop task by task id | {"WebAPIToken": "LoNgSTRingTokEnWiTHusErseSSiOn", "task_id": "idexample"} | {"message": "task was deleted"} |