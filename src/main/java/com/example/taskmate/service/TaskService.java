package com.example.taskmate.service;

import com.example.taskmate.dto.TaskStatsDto;
import com.example.taskmate.model.Category;
import com.example.taskmate.model.Priority;
import com.example.taskmate.model.Task;
import com.example.taskmate.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Task> getTasksByStatus(boolean completed) {
        return taskRepository.findByCompleted(completed);
    }

    @Transactional(readOnly = true)
    public List<Task> getTasksByPriority(Priority priority) {
        return taskRepository.findByPriority(priority);
    }

    @Transactional(readOnly = true)
    public List<Task> getTasksByCategory(Category category) {
        return taskRepository.findByCategory(category);
    }

    @Transactional(readOnly = true)
    public List<Task> searchTasks(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllTasks();
        }
        return taskRepository.searchTasks(query.trim());
    }

    public Task createTask(Task task) {
        task.setId(null); // Ensure fresh ID is generated
        return taskRepository.save(task);
    }

    public Optional<Task> updateTask(Long id, Task updatedDetails) {
        return taskRepository.findById(id).map(existingTask -> {
            existingTask.setTitle(updatedDetails.getTitle());
            existingTask.setDescription(updatedDetails.getDescription());
            existingTask.setPriority(updatedDetails.getPriority());
            existingTask.setCategory(updatedDetails.getCategory());
            existingTask.setDueDate(updatedDetails.getDueDate());
            existingTask.setCompleted(updatedDetails.isCompleted());
            return taskRepository.save(existingTask);
        });
    }

    public Optional<Task> toggleTaskStatus(Long id) {
        return taskRepository.findById(id).map(task -> {
            task.setCompleted(!task.isCompleted());
            return taskRepository.save(task);
        });
    }

    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional(readOnly = true)
    public TaskStatsDto getStats() {
        long total = taskRepository.count();
        long completed = taskRepository.countByCompleted(true);
        long pending = taskRepository.countByCompleted(false);
        long highPriority = taskRepository.countByPriority(Priority.HIGH);

        double rate = total == 0 ? 0.0 : Math.round(((double) completed / total) * 1000.0) / 10.0;

        return new TaskStatsDto(total, completed, pending, highPriority, rate);
    }
}
