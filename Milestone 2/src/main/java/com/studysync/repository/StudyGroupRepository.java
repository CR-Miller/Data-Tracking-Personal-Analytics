package com.studysync.repository;

import com.studysync.model.StudyGroup;
import com.studysync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {

    List<StudyGroup> findByMembersContaining(User user);
}// repository/StudyGroupRepository.java