package com.example.taskmate;

import com.example.taskmate.model.Category;
import com.example.taskmate.model.Priority;
import com.example.taskmate.model.Task;
import com.example.taskmate.repository.TaskRepository;
import com.example.taskmate.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TaskMateApplicationTests {

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskRepository taskRepository;

    @Test
    void contextLoads() {
        assertNotNull(taskService);
        assertNotNull(taskRepository);
    }

    @Test
    void testCreateAndRetrieveTask() {
        Task task = new Task("Test Unit Task", "Testing Service Logic", Priority.HIGH, Category.WORK, LocalDate.now());
        Task created = taskService.createTask(task);

        assertNotNull(created.getId());
        assertEquals("Test Unit Task", created.getTitle());
        assertFalse(created.isCompleted());

        Task found = taskService.getTaskById(created.getId()).orElse(null);
        assertNotNull(found);
        assertEquals(Priority.HIGH, found.getPriority());
    }

    @Test
    void testToggleTaskStatus() {
        Task task = new Task("Toggle Test", "Check status flip", Priority.LOW, Category.PERSONAL, LocalDate.now());
        Task created = taskService.createTask(task);
        assertFalse(created.isCompleted());

        Task toggled = taskService.toggleTaskStatus(created.getId()).orElseThrow();
        assertTrue(toggled.isCompleted());

        Task toggledBack = taskService.toggleTaskStatus(created.getId()).orElseThrow();
        assertFalse(toggledBack.isCompleted());
    }

    @Test
    void testSearchTasks() {
        List<Task> results = taskService.searchTasks("Build");
        assertNotNull(results);
        assertFalse(results.isEmpty());
    }
}
