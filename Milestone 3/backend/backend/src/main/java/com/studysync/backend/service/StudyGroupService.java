package com.studysync.backend.service;

import com.studysync.backend.model.StudyGroup;
import com.studysync.backend.model.User;
import com.studysync.backend.model.Task;
import com.studysync.backend.repository.StudyGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudyGroupService {

    @Autowired
    private StudyGroupRepository studyGroupRepository;

    // CREATE GROUP (Demo Step 3)
    public StudyGroup createGroup(StudyGroup group) {
        return studyGroupRepository.save(group);
    }

    // ADD USER TO GROUP (CRITICAL FOR DEMO)
    public StudyGroup addUserToGroup(StudyGroup group, User user) {

        //  IMPORTANT PART (bidirectional relationship)
        group.getMembers().add(user);
        user.getGroups().add(group);

        return studyGroupRepository.save(group);
    }

    //  ADD TASK TO GROUP (Demo Step 4)
    public StudyGroup addTaskToGroup(StudyGroup group, Task task) {

        group.getGroupTasks().add(task);
        task.setGroup(group);

        return studyGroupRepository.save(group);
    }

    public StudyGroup getGroupById(Long id) {

        return studyGroupRepository.findById(id).orElse(null);
    }
}// service/StudyGroupService.java