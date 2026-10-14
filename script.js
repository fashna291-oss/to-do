console.log("JS FILE CHAL RAHI HAI");
const { createClient } = supabase;

const supabaseURL = 'https://xwbitrmhxhqiczyplzfk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Yml0cm1oeGhxaWN6eXBsemZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNzM1MTIsImV4cCI6MjEwNjc0OTUxMn0.mxsYxznrdK2J7Nf1M49pSiOlD1bmCEVLI0GghQlKz8o';
const supabaseclient = createClient(supabaseURL, supabaseKey)

// Todo data
let todos = [];

// HTML elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");


///
let currentUser = null;

async function checkLogin() {
    const { data: { user }, error } =
        await supabaseclient.auth.getUser();

    if (error || !user) {
        window.location.href = "auth.html";
        return false;
    }

    currentUser = user;
    console.log("Current user ID:", currentUser.id);

    return true;
}

// =========================
// ADD TODO
// =========================

addBtn.addEventListener("click", async function () {

    const task = taskInput.value.trim();

    if (task === "") {
        alert("Please enter a task");
        return;
    }

    ///
    const loggedIn = await checkLogin();

    if (!loggedIn) return;

    const newTodo = {
        task: task,
        iscompleted: false,
        user_id: currentUser.id
    };

    // todos.push(newTodo);

    const { error } = await supabaseclient
        .from('todo')
        .insert(newTodo);

    if (error) {
        console.log('Error hai bhai', error);
    } else {
        console.log("Data insert ho gaya:", newTodo.task);
    }

    taskInput.value = "";

    renderTodos();
});

//////////fetch
async function gettodosss() {
    const loggedIn = await checkLogin();

    if (!loggedIn) return;

    const { data, error } = await supabaseclient
        .from("todo")
        .select("*")
        .eq("user_id", currentUser.id);

    if (error) {
        console.log("Fetch error:", error);
        return;
    }

    todos = data;
    renderTodos();
}

gettodosss();
// =========================
// SHOW TODOS
// =========================

function renderTodos() {

    todoList.innerHTML = "";

    todos.forEach(async function (todo) {

        const todoDiv = document.createElement("div");

        todoDiv.className = "todo";

        todoDiv.innerHTML = `
            <div class="todo-text ${todo.iscompleted ? "completed" : ""}">
                ${todo.task}
            </div>

            <div class="actions">

                <button 
                    class="edit-btn"
                    onclick="editTodo(${todo.id})"
                >
                    Edit
                </button>

                <button 
                    class="delete-btn"
                    onclick="deleteTodo(${todo.id})"
                >
                    Delete
                </button>

            </div>
        `;



        todoList.appendChild(todoDiv);
    });
}


// =========================
// DELETE TODO
// =========================

async function deleteTodo(id) {


    const { data, error } = await supabaseclient
        .from("todo")
        .delete()
        .eq("id", id)
        .select();

    if (error) {
        console.log("Delete error:", error);
        return;
    }


    todos = todos.filter(function (todo) {
        return todo.id !== id;
    });

    //     const { data, error } = await supabase
    //   .from('todosss')
    //   .delete()
    //   .match({ id: 666 })

    todos = data;

    renderTodos();
}


// =========================
// EDIT TODO
// =========================

// async function editTodo(id) {

//     const todo = todos.find(function (todo) {
//         return todo.id === id;
//     });

//     const newTask = prompt("Edit your task:", todo.text);

//     if (newTask === null) {
//         return;
//     }

//     if (newTask.trim() === "") {
//         return;
//     }


//     const { error } = await supabaseclient
//     .from('todosss')
//     .update({
//         text: newTask.trim()
//     })
//     .eq('id', id)

//     if(error){
//         console.log('update nhi huwa', error)
//     }

//     todo.text = newTask.trim();


//     renderTodos();
// }

async function editTodo(id) {

    const todo = todos.find(function (todo) {
        return todo.id === id;
    });

    const newTask = prompt("Edit your task:", todo.task);

    if (newTask === null) {
        return;
    }

    if (newTask.trim() === "") {
        return;
    }

    const { data, error } = await supabaseclient
        .from("todo")
        .update({
            task: newTask.trim()
        })
        .eq("id", id)
        .select();

    console.log("UPDATE DATA:", data);
    console.log("UPDATE ERROR:", error);

    if (error) {
        console.log("update nhi huwa", error);
        return;
    }

    todo.text = newTask.trim();

    renderTodos();
}