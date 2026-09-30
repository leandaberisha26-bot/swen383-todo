import { TodoService } from './TodoService.js';
import { TodoRenderer } from './TodoRenderer.js';
import { LocalStorageHandler } from './LocalStorageHandler.js';

function initializeTodoApp() {
  try {
    // main.js decides which storage to use
    const storage =
      new LocalStorageHandler();

    // TodoService receives storage
    const service =
      new TodoService(storage);

    // Renderer receives the service
    const renderer =
      new TodoRenderer(
        'task-container',
        service
      );

    renderer.bindControls();
    renderer.render();

  } catch (error) {
    console.error(error);

    window.alert(
      `Could not start the todo app: ${error.message}`
    );
  }
}

if (
  document.readyState === 'loading'
) {
  window.addEventListener(
    'DOMContentLoaded',
    initializeTodoApp,
    { once: true }
  );
} else {
  initializeTodoApp();
}