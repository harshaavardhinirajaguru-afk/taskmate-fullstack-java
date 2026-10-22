package com.example.taskmate.dto;

public class TaskStatsDto {

    private long total;
    private long completed;
    private long pending;
    private long highPriority;
    private double completionRate;

    public TaskStatsDto() {
    }

    public TaskStatsDto(long total, long completed, long pending, long highPriority, double completionRate) {
        this.total = total;
        this.completed = completed;
        this.pending = pending;
        this.highPriority = highPriority;
        this.completionRate = completionRate;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getCompleted() {
        return completed;
    }

    public void setCompleted(long completed) {
        this.completed = completed;
    }

    public long getPending() {
        return pending;
    }

    public void setPending(long pending) {
        this.pending = pending;
    }

    public long getHighPriority() {
        return highPriority;
    }

    public void setHighPriority(long highPriority) {
        this.highPriority = highPriority;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }
}
