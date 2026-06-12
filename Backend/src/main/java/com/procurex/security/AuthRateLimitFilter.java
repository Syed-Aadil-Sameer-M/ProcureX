package com.procurex.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AuthRateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Long> requestCounts = new ConcurrentHashMap<>();
    private static final long TIME_WINDOW = 1000; // 1 second

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (request.getRequestURI().startsWith("/api/auth/")) {
            String clientIp = request.getRemoteAddr();
            long currentTime = System.currentTimeMillis();
            
            requestCounts.entrySet().removeIf(entry -> currentTime - entry.getValue() > TIME_WINDOW);

            if (requestCounts.containsKey(clientIp)) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("Too many requests");
                return;
            }

            requestCounts.put(clientIp, currentTime);
        }

        filterChain.doFilter(request, response);
    }
}
