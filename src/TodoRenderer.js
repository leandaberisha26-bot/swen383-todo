// Handles DOM rendering and user controls.
export class TodoRenderer {
  constructor(containerId, service) {
    this.container =
      document.getElementById(containerId);

    if (!this.container) {
      throw new Error(
        `Missing container: ${containerId}`
      );
    }

    this.service = service;
  }

  createElement(
    tag,
    text,
    className = ''
  ) {
    const element =
      document.createElement(tag);

    if (text !== undefined) {
      element.textContent = text;
    }

    element.className = className;

    return element;
  }

  buildTaskRow(task, justAddedId) {
    const row = this.createElement(
      'li',
      undefined,
      task.completed
        ? 'completed'
        : ''
    );

    row.dataset.row = task.id;

    const label =
      task.desc.length > 40
        ? `${task.desc.slice(0, 40)}...`
        : task.desc;

    const description =
      this.createElement(
        'span',
        label,
        `task-desc${
          task.priority === 'high'
            ? ' priority-high'
            : ''
        }`
      );

    const time =
      this.createElement(
        'span',
        task.createdAt,
        'task-time'
      );

    const actions =
      this.createElement(
        'span',
        undefined,
        'task-actions'
      );

    const toggleButton =
      this.createElement(
        'button',
        task.completed
          ? 'Undo'
          : 'Done'
      );

    toggleButton.type = 'button';

    toggleButton.addEventListener(
      'click',
      () => {
        try {
          this.service.toggleComplete(
            task.id
          );

          this.render();
        } catch (error) {
          console.error(error);

          this.showError(
            'Could not update the task.'
          );
        }
      }
    );

    const deleteButton =
      this.createElement(
        'button',
        'Delete'
      );

    deleteButton.type = 'button';

    deleteButton.addEventListener(
      'click',
      () => {
        try {
          this.service.deleteTask(
            task.id
          );

          this.render();
        } catch (error) {
          console.error(error);

          this.showError(
            'Could not delete the task.'
          );
        }
      }
    );

    actions.append(
      toggleButton,
      deleteButton
    );

    row.append(
      description,
      time,
      actions
    );

    if (task.id === justAddedId) {
      row.classList.add('flash');

      setTimeout(() => {
        row.classList.remove(
          'flash'
        );
      }, 1500);
    }

    return row;
  }

  renderRows(
    tasks,
    emptyMessage,
    justAddedId
  ) {
    const list =
      this.createElement('ul');

    if (tasks.length === 0) {
      list.append(
        this.createElement(
          'li',
          emptyMessage
        )
      );
    }

    for (const task of tasks) {
      list.append(
        this.buildTaskRow(
          task,
          justAddedId
        )
      );
    }

    return list;
  }

  render(justAddedId) {
    const pending =
      this.service.getPendingTasks();

    const completed =
      this.service.getCompletedTasks();

    const summary =
      this.service.getSummary();

    const {
      done,
      total,
      urgent,
      normal,
      oldest
    } = summary;

    const status =
      `${done}/${total} done - ` +
      `${urgent} urgent, ` +
      `${normal} normal remaining - ` +
      `oldest: ${oldest}`;

    this.container.replaceChildren(
      this.createElement(
        'p',
        status,
        'status'
      ),

      this.createElement(
        'h2',
        'To do',
        'section-title'
      ),

      this.renderRows(
        pending,
        'Nothing pending. Add a task above.',
        justAddedId
      ),

      this.createElement(
        'h2',
        'Completed',
        'section-title'
      ),

      this.renderRows(
        completed,
        'Nothing completed yet.',
        justAddedId
      )
    );

    document.title =
      `Todo (${pending.length})`;
  }

  bindControls() {
    const input =
      document.getElementById(
        'task-input'
      );

    const addButton =
      document.getElementById(
        'add-task-btn'
      );

    const urgentButton =
      document.getElementById(
        'add-urgent-btn'
      );

    if (
      !input ||
      !addButton ||
      !urgentButton
    ) {
      throw new Error(
        'Missing task input or add buttons.'
      );
    }

    const add = type => {
      try {
        const task =
          this.service.addTask(
            input.value,
            type
          );

        if (
          this.service.tasks.length > 20
        ) {
          console.warn(
            'This list is getting long - consider clearing completed tasks.'
          );
        }

        input.value = '';

        this.render(task.id);
      } catch (error) {
        console.error(error);
        this.showError(error.message);
      }
    };

    addButton.addEventListener(
      'click',
      event => {
        event.preventDefault();
        add('simple');
      }
    );

    urgentButton.addEventListener(
      'click',
      event => {
        event.preventDefault();
        add('urgent');
      }
    );

    input.addEventListener(
      'keydown',
      event => {
        if (
          event.key === 'Enter' &&
          !event.isComposing
        ) {
          event.preventDefault();
          add('simple');
        }
      }
    );
  }

  showError(message) {
    window.alert(message);
  }
}