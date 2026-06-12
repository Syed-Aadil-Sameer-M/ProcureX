package com.procurex.service;

import com.procurex.entity.Notification;
import com.procurex.entity.User;
import com.procurex.repository.NotificationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> findByUser(User user) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(user.getId());
    }

    @Transactional
    public Notification markAsRead(Long id) {
        logger.info("Marking notification ID {} as read", id);
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found with id " + id));
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public Notification createNotification(User user, String message, String type) {
        logger.info("Creating notification for user {}: {}", user.getUsername(), message);
        Notification notification = new Notification();
        notification.setUser(user);
        // Note: 'type' parameter is ignored as Notification entity doesn't have a type field, or we prepend it
        notification.setMessage(message);
        notification.setIsRead(false);
        notification.setTimestamp(LocalDateTime.now());
        return notificationRepository.save(notification);
    }
}
