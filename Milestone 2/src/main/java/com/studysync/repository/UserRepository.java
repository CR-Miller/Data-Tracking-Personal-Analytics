package com.studysync.repository;

import com.studysync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // IMPORTANT (for login)
    Optional<User> findByEmail(String email);
}