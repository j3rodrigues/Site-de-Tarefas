document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const taskName = document.getElementById('taskName').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;

    addTask(taskName, dueDate, priority);

    document.getElementById('taskForm').reset();
});

function addTask(name, dueDate, priority) {
    const task = {
        name,
        dueDate,
        priority,
        completed: false,
        completionDate: null
    };

    const taskElement = document.createElement('li');
    taskElement.textContent = `${name} - Prioridade: ${priority} - Vencimento: ${dueDate}`;

    if (new Date(dueDate) < new Date() && !task.completed) {
        taskElement.classList.add('overdue');
    }

    taskElement.addEventListener('click', function() {
        task.completed = true;
        task.completionDate = new Date().toLocaleDateString();
        taskElement.classList.add('completed');

        moveTaskToCompleted(taskElement, task);
        sortPendingTasksByPriority(); // Reordenar as tarefas pendentes após mover uma para concluídas
    });

    // Adiciona o tooltip
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.textContent = `Data de Conclusão: ${task.completionDate || 'Não concluída'}`;
    taskElement.appendChild(tooltip);

    const pendingTasks = document.getElementById('pendingTasks');
    pendingTasks.appendChild(taskElement);

    sortPendingTasksByPriority(); // Ordenar as tarefas pendentes após adicionar uma nova
}

function moveTaskToCompleted(taskElement, task) {
    const completedTasks = document.getElementById('completedTasks');
    taskElement.removeEventListener('click', null);

    // Atualiza o tooltip com a data de conclusão e o status
    const tooltip = taskElement.querySelector('.tooltip');
    const completionStatus = new Date(task.dueDate) < new Date(task.completionDate) ? 'Atrasada' : 'No prazo';
    tooltip.textContent = `Data de Conclusão: ${task.completionDate} - Status: ${completionStatus}`;

    completedTasks.appendChild(taskElement);
}

function sortPendingTasksByPriority() {
    const pendingTasks = document.getElementById('pendingTasks');
    const tasks = Array.from(pendingTasks.children);

    tasks.sort((a, b) => {
        const priorityOrder = { alta: 1, media: 2, baixa: 3 };
        const aPriority = a.textContent.match(/Prioridade: (\w+)/)[1];
        const bPriority = b.textContent.match(/Prioridade: (\w+)/)[1];
        return priorityOrder[aPriority] - priorityOrder[bPriority];
    });

    pendingTasks.innerHTML = '';
    tasks.forEach(task => pendingTasks.appendChild(task));
}