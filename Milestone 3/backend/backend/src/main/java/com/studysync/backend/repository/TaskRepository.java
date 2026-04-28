package com.studysync.backend.repository;

import com.studysync.backend.model.Task;
import com.studysync.backend.model.User;
import com.studysync.backend.model.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignedUser(User user);

    List<Task> findByGroup(StudyGroup group);
}