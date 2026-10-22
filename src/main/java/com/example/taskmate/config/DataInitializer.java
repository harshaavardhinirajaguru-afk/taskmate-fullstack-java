package com.example.taskmate.config;

import com.example.taskmate.model.Category;
import com.example.taskmate.model.Priority;
import com.example.taskmate.model.Task;
import com.example.taskmate.repository.TaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(TaskRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Task t1 = new Task(
                        "Build Full Stack Java Application",
                        "Design and build Spring Boot REST API with modern responsive frontend.",
                        Priority.HIGH,
                        Category.WORK,
                        LocalDate.now().plusDays(2)
                );
                t1.setCompleted(true);

                Task t2 = new Task(
                        "Study Data Structures & Algorithms",
                        "Review graph traversal algorithms (BFS/DFS) and dynamic programming problems.",
                        Priority.HIGH,
                        Category.STUDY,
                        LocalDate.now().plusDays(3)
                );

                Task t3 = new Task(
                        "Morning Workout & Hydration",
                        "Complete 45-minute cardio and strength session.",
                        Priority.MEDIUM,
                        Category.HEALTH,
                        LocalDate.now().plusDays(1)
                );
                t3.setCompleted(true);

                Task t4 = new Task(
                        "Review Monthly Budget & Savings",
                        "Audit credit card statements and transfer 20% to savings account.",
                        Priority.LOW,
                        Category.FINANCE,
                        LocalDate.now().plusDays(5)
                );

                Task t5 = new Task(
                        "Push Project to GitHub",
                        "Initialize repository, commit full stack source code, and push to GitHub.",
                        Priority.HIGH,
                        Category.WORK,
                        LocalDate.now()
                );

                repository.saveAll(List.of(t1, t2, t3, t4, t5));
                System.out.println(">> Database pre-seeded with 5 sample tasks.");
            }
        };
    }
}
