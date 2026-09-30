import { TodoService } from './TodoService.js';
import { TodoRenderer } from './TodoRenderer.js';
import { LocalStorageHandler } from './LocalStorageHandler.js';
import { TodoController } from './TodoController.js';

const service = new TodoService(new LocalStorageHandler());
const renderer = new TodoRenderer('task-container');
const controller = new TodoController(service, renderer);

controller.start();

const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-btn');
const addUrgentBtn = document.getElementById('add-urgent-btn');

function add(type) {
  try {
    const newId = controller.addTask(input.value, type);

    if (newId) {
      input.value = '';
    } else {
      renderer.showError('Task needs at least 3 characters.');
    }
  } catch (error) {
    console.error(error);
    renderer.showError('Could not add the task.');
  }
}

addBtn.addEventListener('click', (event) => {
  event.preventDefault();
  add('simple');
});

addUrgentBtn.addEventListener('click', (event) => {
  event.preventDefault();
  add('urgent');
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.isComposing) {
    event.preventDefault();
    add('simple');
  }
});