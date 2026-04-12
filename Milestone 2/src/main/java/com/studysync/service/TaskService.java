package com.studysync.service;

import com.studysync.model.Task;
import com.studysync.model.User;
import com.studysync.model.StudyGroup;
import com.studysync.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // CREATE TASK (Demo Step 2)
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // ASSIGN TASK TO USER
    public Task assignTaskToUser(Task task, User user) {
        task.setAssignedUser(user);

        if (user.getTasks() != null) {
            user.getTasks().add(task);
        }

        return taskRepository.save(task);
    }

    // ADD TASK TO GROUP
    public Task assignTaskToGroup(Task task, StudyGroup group) {
        task.setGroup(group);

        if (group.getGroupTasks() != null) {
            group.getGroupTasks().add(task);
        }

        return taskRepository.save(task);
    }

    public List<Task> getTasksByUser(User user) {
        return taskRepository.findByAssignedUser(user);
    }

    public List<Task> getTasksByGroup(StudyGroup group) {
        return taskRepository.findByGroup(group);
    }
}// service/TaskService.java