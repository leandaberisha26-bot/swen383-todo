// Handles task data and business logic.
export class TodoService {
  constructor(storage) {
    this.storage = storage;
    this.tasks = this.storage.load();
  }

  addTask(description, type = 'simple') {
    const trimmed = description.trim();

    if (trimmed.length < 3) {
      throw new Error(
        'Task needs at least a few characters.'
      );
    }

    let id = Date.now();

    while (
      this.tasks.some(task => task.id === id)
    ) {
      id++;
    }

    const task = {
      id,
      desc:
        type === 'urgent'
          ? `[URGENT] ${trimmed}`
          : trimmed,
      completed: false,
      priority:
        type === 'urgent'
          ? 'high'
          : 'normal',
      createdAt:
        new Date().toLocaleTimeString()
    };

    this.tasks.push(task);

    this.storage.save(this.tasks);

    return task;
  }

  toggleComplete(id) {
    const task = this.tasks.find(
      task => task.id === id
    );

    if (task) {
      task.completed = !task.completed;
      this.storage.save(this.tasks);
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(
      task => task.id !== id
    );

    this.storage.save(this.tasks);
  }

  getPendingTasks() {
    return this.tasks.filter(
      task => !task.completed
    );
  }

  getCompletedTasks() {
    return this.tasks.filter(
      task => task.completed
    );
  }

  getSummary() {
    const pending =
      this.getPendingTasks();

    const urgent = pending.filter(
      task => task.priority === 'high'
    ).length;

    return {
      total: this.tasks.length,
      done:
        this.tasks.length -
        pending.length,
      urgent,
      normal:
        pending.length - urgent,
      oldest:
        pending[0]?.desc ?? 'none'
    };
  }
}