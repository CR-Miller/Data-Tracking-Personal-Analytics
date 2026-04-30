package com.studysync.backend.repository;

import com.studysync.backend.model.StudyGroup;
import com.studysync.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {

    List<StudyGroup> findByMembersContaining(User user);
}// repository/StudyGroupRepository.java