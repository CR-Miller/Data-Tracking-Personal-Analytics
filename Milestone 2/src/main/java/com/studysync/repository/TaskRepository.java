package com.studysync.repository;

import com.studysync.model.Task;
import com.studysync.model.User;
import com.studysync.model.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignedUser(User user);

    List<Task> findByGroup(StudyGroup group);
}