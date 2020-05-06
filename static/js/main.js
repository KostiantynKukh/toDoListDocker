const d = document,
      output = d.body;

let APIToken = '',
    userInfo = {},
    userTasks = [];

class LoginPage {
    constructor() {
      this.username = '';
      this.password = '';
    }

    async signIn(){
        event.preventDefault();
        let username = d.autho_form.username,
            password = d.autho_form.password;

        this.username = username.value;
        this.password = password.value;
        
        let user = {
            "username": this.username,
            "password": this.password,
        }
        
        let res = await fetch('/api/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        });
        
        if (res.ok) {
            let result = await res.json();
            APIToken = result.WebAPIToken;
            userInfo = user; 
            taskList.getTasks();                 
          } else {
            let result = await res.json();
            
            username.value = '';
            password.value = '';
            alert("You haven't an account. Sign up, please.");            
            console.log(`Error at Login Page: ${result.error}`);
          }
          
        }    
    
    async signUp(){
        event.preventDefault();
        
        this.username = d.reg_form.username.value;
        this.password = d.reg_form.password.value;

        let user = {
            "username": this.username,
            "password": this.password,
        }

        let res = await fetch('/api/user/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        });
        
        if (res.ok) {
            let result = await res.json();
            userInfo = user;
            userInfo.id = result.id;

            alert("You have created an account, please Sign in.");
            loginPage.render();                 
          } else {
            let result = await res.json();
            console.log(`Error at Registration Page: ${result.error}`);
          }
    }

    render() {
        let contentLog = `
            <div class="wrap_enter">
                <div class="wrap">
                    <div class="wrap_reg">
                        <header class="header_reg">
                            <h1 class="title_reg">Clean Your Mind <br> with <br> To Do List</h1>
                        </header>
                        <main class="main_reg">
                            <form name="autho_form" id="autho_form" class="main_form">
                                <input type="text" name="username" id="username" placeholder="Enter your user name" required>
                                <input type="password" name="password" id="password" placeholder="Enter your password" required>
                                <input type="submit" name="submit" class="submit" value="Sign in">
                                <input type="button" name="button" class="button" value="Sign up">
                            </form>
                        </main>
                    </div>
                </div>
            </div>`;

        output.innerHTML = contentLog;

        let signIn = d.autho_form.submit;
        
        let signUp = d.autho_form.button;
        
        signIn.addEventListener('click', loginPage.signIn);
        signUp.addEventListener('click', loginPage.renderSignUp);      
        
    }

    async logOut(){

        let res = await fetch('/api/auth/out');
        
        if (res.ok) {
            let result = await res.json();
            console.log(result.message);
            loginPage.render()                
          } else {
            let result = await res.json();
            console.log(`Error at log out page: ${result.error}`);
          }
    }

    renderSignUp(){
        let contentReg = `
            <div class="wrap_enter">
                <div class="wrap">
                    <div class="wrap_reg">
                        <header class="header_reg">
                            <h1 class="title_reg">Clean Your Mind <br> with <br> To Do List</h1>
                        </header>
                        <main class="main_reg">
                            <form name="reg_form" id="reg_form" class="main_form">
                                <input type="text" name="username" id="username" placeholder="Enter your user name" required>
                                <input type="password" name="password" id="password" placeholder="Enter your password" required>
                                <input type="submit" name="submit" class="submit" value="Sign up">
                                <input type="button" name="button" class="button" value="Back to sign in">
                            </form>
                        </main>
                    </div>
                </div>
            </div>`;

            output.innerHTML = contentReg;
            
            let signUp = d.reg_form.submit;
        
            let backTo = d.reg_form.button;

            
            signUp.addEventListener('click', loginPage.signUp);
            backTo.addEventListener('click', loginPage.render);
    }   
  }

class TaskList{
    constructor(){
        this.tasks = [];
    }
    
  async getTasks() {
    let res = await fetch('/api/tasks');

    if (res.ok) {
        let result = await res.json();
        this.tasks = result;
        userTasks = this.tasks;   
        this.render();
        //console.log(this.tasks);
        
    } else {
        console.log(`Error at Get Tasks: ${res.error}`);
    }
  }

  async getInfoTask(taskId){
        
        let res = await fetch(`/api/tasks/${taskId}`);
    
        if (res.ok) {
            let result = await res.json();
            return result;
        } else {
            console.log(`Error at Get info about task: ${res.error}`);
        }
  }

 async renderEditTask(){
    let taskId = this.dataset.id;
    
    let taskInfo = await taskList.getInfoTask(taskId);
    console.log(taskInfo);
        
    let contentEdit = `
            <div class="wrap_external_new_task">
                <div class="wrap">
                    <div class="wrap_new_task">                        
                        <header class="header_new_task">
                        <span class="log_out">Log out</span>
                            <h1>Edit Task &emsp; &#9997;</h1>
                        </header>
                        <main class="main_new_task">
                            <form name="new_task">
                                <input type="text" id="new_task_name" value='${taskInfo.name}' autofocus placeholder="Enter task name" required>
                                <textarea wrap="soft" class="new_task_description" placeholder="Enter task description " required>${taskInfo.description}</textarea>
                                <input type="submit" id="edit_Task" value="Edit task">
                            </form>
                        </main>
                    </div>
                </div>
            </div>`;

        output.innerHTML = contentEdit;

        let logOut = d.querySelector('.log_out');
        logOut.addEventListener('click', loginPage.logOut);

        let editTask = d.querySelector('#edit_Task');
        
        editTask.addEventListener('click', () => taskList.editTask(taskId))
  }

  async editTask(taskId){
      event.preventDefault();
    let taskName = d.getElementById('new_task_name').value;
    let taskDesc = d.querySelector('.new_task_description').value;
        let body = {
            WebAPIToken: APIToken,
            task_id: taskId,
            name: taskName,
            description: taskDesc,
            date: taskList.createDate(), 
        }

      let res = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            let result = await res.json();
                       
            taskList.getTasks();            
        } else {
            let result = await res.json();
            console.log(`Error at editing task: ${result.error}`);            
        }
  }
  
  render(){
      let contentTasks = `
        <div class="wrap_External_tasks">
            <div class="wrap">
                <div class="wrap_tasks">
                    <header class="header_tasks">
                        <span class="log_out">Log out</span>
                        <h1>&#10023; My Tasks	&#10023;</h1>
                        <span class="add_task">new task &emsp; &#9997;</span>
                    </header> 
                    <main class="main_tasks">
                        <ul></ul>
                    </main>
                </div>
            </div>
        </div>`;
        output.innerHTML = contentTasks;
        
        let ul = d.querySelector('.main_tasks').firstElementChild;
        
        userTasks.forEach(item => {
            ul.innerHTML += `<li class="task_list"><span class="edit_task" data-id="${item.id}">✏ </span><span class="task_date">${item.date}</span> | ${item.name}<span data-id="${item.id}" class="remove_task">&#10060;</span><p class="tool-tip dsp_none">${item.description}</p></li>`
        });
        
        let addTask = d.querySelector('.add_task');
        addTask.addEventListener('click', taskList.renderAddTask);

        let logOut = d.querySelector('.log_out');
        logOut.addEventListener('click', loginPage.logOut);
        
        let removeTask = d.querySelectorAll('.remove_task');
        removeTask.forEach(item => {
            item.addEventListener('click', this.deleteTask);            
        });
        
        let editTask = d.querySelectorAll('.edit_task');
        editTask.forEach(item => {
            item.addEventListener('click', this.renderEditTask)
        });

        if(ul.hasChildNodes){
            ul.addEventListener('click', () => {
                if(event.target.tagName == 'LI') {
                    let elem = event.target;
                    elem.lastElementChild.classList.toggle('dsp_none');
                }                
            })
        }
    }

    async deleteTask(){
        let bodyDel = {
            WebAPIToken: APIToken,
            task_id: this.dataset.id,
        }
        
        let res = await fetch(`/api/tasks/${this.dataset.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyDel),
        });

        if (res.ok) {
            let result = await res.json();     
                        
            console.log(result.message);  
            taskList.getTasks();                      
        } else {
            let result = await res.json();
            console.log(`Error at removing task: ${result.error}`);
        }
    }

    createDate(){
        let date = new Date();
        let month = date.getMonth();
        let day = date.getDate();
        let year = date.getFullYear();
        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + (month + 1) : month + 1;

        return `${day}.${month}.${year}`; 
    }

    async addTask(){
        event.preventDefault();

        let taskName = d.getElementById('new_task_name').value,
            taskDesc = d.querySelector('.new_task_description').value,
            taskDate = taskList.createDate();
            
        let bodyPost = {
            WebAPIToken: APIToken,
            name: taskName,
            description: taskDesc,
            date: taskDate,
        }
        //console.log(bodyPost);
        
        let res = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyPost),
        });

        if (res.ok) {
            let result = await res.json();
            userTasks.push(result);            
            taskList.render();
            
        } else {
            let result = await res.json();
            console.log(`Error at add task: ${result.error}`);
        }
    }

    renderAddTask(){
                
        let contentAdd = `
            <div class="wrap_external_new_task">
                <div class="wrap">
                    <div class="wrap_new_task">                        
                        <header class="header_new_task">
                        <span class="log_out">Log out</span>
                            <h1>New Task &emsp; &#9997;</h1>
                        </header>
                        <main class="main_new_task">
                            <form name="new_task">
                                <input type="text" id="new_task_name" autofocus placeholder="Enter task name" required>
                                <textarea wrap="soft" class="new_task_description" placeholder="Enter task description " required></textarea>
                                <input type="submit" id="add_New_Task" value="Add a new task">
                            </form>
                        </main>
                    </div>
                </div>
            </div>`;

            output.innerHTML = contentAdd;

            let logOut = d.querySelector('.log_out');
            logOut.addEventListener('click', loginPage.logOut);

            let addNewTask = d.getElementById('add_New_Task');
            addNewTask.addEventListener('click',  taskList.addTask);
    }
}

const taskList = new TaskList();
const loginPage = new LoginPage();
loginPage.render();