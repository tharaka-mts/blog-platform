-- Blog Platform - Seed Data
-- Passwords are bcrypt hashed: admin123 / user123
-- Run AFTER schema.sql

USE blog_platform;

-- ============================================================
-- USERS
-- password: admin123 → $2b$10$...
-- password: user123  → $2b$10$...
-- ============================================================
INSERT INTO users (username, email, password, role, is_active) VALUES
  ('admin',   'admin@blog.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 1),
  ('alice',   'alice@blog.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER',  1),
  ('bob',     'bob@blog.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER',  1);

-- NOTE: The bcrypt hash above corresponds to the literal string "password"
-- Use these credentials to log in during testing:
--   admin@blog.com  / password
--   alice@blog.com  / password
--   bob@blog.com    / password

-- ============================================================
-- BLOGS
-- ============================================================
INSERT INTO blogs (user_id, title, description) VALUES
  (2, 'Getting Started with Angular 20',
      'Angular 20 introduces standalone components as the default. In this post we explore the new project structure, the removal of NgModule boilerplate, and how to set up routing with the new functional router guards.'),
  (2, 'Node.js Best Practices in 2024',
      'From layered architecture to dependency injection, this post covers the essential patterns every Node.js developer should know when building production-ready REST APIs.'),
  (3, 'MySQL Performance Tuning Tips',
      'Proper indexing, query analysis with EXPLAIN, and connection pooling are just the beginning. Learn how to squeeze the most performance out of MySQL 8 for your web applications.'),
  (3, 'TailwindCSS vs Plain CSS',
      'TailwindCSS utility classes speed up development significantly, but there are trade-offs. We compare the two approaches for developer experience, bundle size, and maintainability.'),
  (1, 'JWT Authentication Deep Dive',
      'Access tokens, refresh tokens, expiration strategies, and secure storage – a comprehensive guide to implementing JWT authentication in a Node.js + Angular application.');

-- ============================================================
-- LIKES
-- ============================================================
INSERT INTO blog_likes (user_id, blog_id) VALUES
  (1, 1), (3, 1),
  (1, 2), (2, 3),
  (1, 4), (2, 4), (3, 4);

-- ============================================================
-- COMMENTS
-- ============================================================
INSERT INTO comments (blog_id, user_id, parent_comment_id, content) VALUES
  (1, 3, NULL, 'Great intro! Standalone components really simplify things.'),
  (1, 1, 1,    'Agreed – the NgModule removal was long overdue.'),
  (1, 2, NULL, 'Do you have a follow-up planned for signals?'),
  (2, 3, NULL, 'The layered architecture tip is gold. Easy to test each layer independently.'),
  (2, 2, 4,    'Exactly! Services become so much cleaner when you separate the repo layer.'),
  (3, 2, NULL, 'EXPLAIN is underused. Saved us hours of debugging slow queries.'),
  (4, 1, NULL, 'Tailwind wins for me – utility classes = faster iteration.'),
  (4, 3, 7,    'Fair point, though generated class lists can get long!'),
  (5, 2, NULL, 'Really clear breakdown of JWT expiry strategies. Bookmarked!');
