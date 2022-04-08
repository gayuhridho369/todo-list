class TodoList {
    constructor(todoInput, todoList) {
        this.todoInput = todoInput;
        this.todoList = todoList;
        this.todos = [];
        this.filter = null;
    }

    getTodos() {
        const todosLocalStorage = JSON.parse(localStorage.getItem('todos'));

        if (todosLocalStorage === null) {
            this.todos = [];
        } else {
            this.todos = todosLocalStorage;
        }

        this.updateDisplay();
    }

    addTodo() {
        if (todoInput.value === '' || todoInput.value.replace(/^\s+|\s+$/g, '').length === 0) return

        this.todos.unshift(
            {
                'task': this.todoInput.value,
                'status': 'process',
            }
        );
        localStorage.setItem('todos', JSON.stringify(this.todos));

        this.todoInput.value = '';
        this.getTodos();
    }

    editTodo(index) {
        document.querySelectorAll('.todo').forEach((todo, i) => {
            if (i === index) {
                todo.classList.add('editable');
            }
        })

        document.querySelector('.add-icon').classList.remove('fa-plus');
        document.querySelector('.add-icon').classList.add('fa-check');

        this.todoInput.value = this.todos[index].task;
        this.todoInput.focus();
    }

    updateTodo(index) {
        document.querySelector('.add-icon').classList.remove('fa-check');
        document.querySelector('.add-icon').classList.add('fa-plus');

        if (todoInput.value !== '' && todoInput.value.replace(/^\s+|\s+$/g, '').length !== 0) {
            this.todos[index].task = this.todoInput.value;
            this.todoInput.value = '';
        }

        localStorage.setItem('todos', JSON.stringify(this.todos));
        this.getTodos();
    }

    completeTodo(index) {
        if (this.todos[index].status === 'completed') {
            this.todos[index].status = 'process';
        } else {
            this.todos[index].status = 'completed';
        }

        localStorage.setItem('todos', JSON.stringify(this.todos));
        this.getTodos();
    }

    deleteTodo(index) {
        this.todos.splice(index, 1);
        localStorage.setItem('todos', JSON.stringify(this.todos));
        this.getTodos();
    }


    filterTodo(status) {
        localStorage.setItem('filter', status);
        this.getTodos();
    }

    updateUtilsText() {
        const sum = this.todos.filter(todo => todo.status !== 'process');

        document.getElementById('completedTask').textContent = sum.length;
        document.getElementById('totalTask').textContent = this.todos.length;
    }

    updateFilter() {
        this.filter = localStorage.getItem('filter') ?? 'all';

        document.querySelectorAll('.filter-button').forEach(button => {
            button.classList.remove('active');
        });

        if (this.filter === 'all') document.getElementById('all').classList.add('active');
        if (this.filter === 'process') document.getElementById('process').classList.add('active');
        if (this.filter === 'completed') document.getElementById('completed').classList.add('active');
    }

    updateTodoList() {
        this.todoList.innerHTML = '';

        this.todos.forEach((todo, index) => {
            if (this.filter === 'process' && todo.status !== 'process') return;
            if (this.filter === 'completed' && todo.status !== 'completed') return;

            const todoDiv = document.createElement('div');
            todoDiv.classList.add('todo');

            const newTodo = document.createElement('li');
            newTodo.classList.add('todo-item');
            newTodo.innerText = todo.task;
            todoDiv.appendChild(newTodo);

            const completeButton = document.createElement('button');
            completeButton.classList.add('button');
            completeButton.classList.add('complete-button');
            completeButton.setAttribute('onclick', `completeTodo(${index})`);
            if (todo.status === 'completed') {
                completeButton.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                completeButton.innerHTML = '<i class="fas fa-check"></i>';
            }
            todoDiv.appendChild(completeButton);

            const editButton = document.createElement('button');
            editButton.classList.add('button');
            editButton.classList.add('edit-button');
            editButton.setAttribute('onclick', `editTodo(${index})`);
            editButton.innerHTML = '<i class="fas fa-pen"></i>';
            todoDiv.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('button');
            deleteButton.classList.add('delete-button');
            deleteButton.setAttribute('onclick', `deleteTodo(${index})`);
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            todoDiv.appendChild(deleteButton);

            if (todo.status === 'completed') todoDiv.classList.add('completed');
            this.todoList.appendChild(todoDiv);
        });
    }

    updateDisplay() {
        this.updateUtilsText();
        this.updateFilter();
        this.updateTodoList();
    }

}

const todoInput = document.querySelector('#todoInput');
const todoAdd = document.querySelector('#todoAdd');
const todoList = document.querySelector('#todoList');
let editIndex;
let isEditActive = false;

const todoListClass = new TodoList(todoInput, todoList);

todoListClass.getTodos();

todoAdd.addEventListener('click', (event) => {
    event.preventDefault();

    if (isEditActive === false) {
        todoListClass.addTodo();
    } else {
        todoListClass.updateTodo(editIndex);

        editIndex = null;
        isEditActive = false;
    }
});

function completeTodo(index) {
    todoListClass.completeTodo(index);
}

function editTodo(index) {
    editIndex = index;
    isEditActive = true;

    todoListClass.editTodo(index);
    document.querySelectorAll('.button').forEach(button => {
        button.setAttribute('disabled', 'true');
    });
}

function deleteTodo(index) {
    todoListClass.deleteTodo(index);
}

function filter(status) {
    todoListClass.filterTodo(status);
}