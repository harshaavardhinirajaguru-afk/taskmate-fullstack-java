package com.example.taskmate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TaskMateApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskMateApplication.class, args);
        System.out.println("\n========================================================");
        System.out.println("   TaskMate Application is running!");
        System.out.println("   Web UI:      http://localhost:8080");
        System.out.println("   REST API:    http://localhost:8080/api/tasks");
        System.out.println("   H2 Console:  http://localhost:8080/h2-console");
        System.out.println("========================================================\n");
    }
}
