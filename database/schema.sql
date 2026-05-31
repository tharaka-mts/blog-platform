-- Blog Platform - Database Schema
-- Run: mysql -u root -p blog_platform < database/schema.sql

CREATE DATABASE IF NOT EXISTS blog_platform;
USE blog_platform;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
  is_active  TINYINT(1) NOT NULL DEFAULT 1,
  is_deleted TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- BLOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS blogs (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  title       VARCHAR(200) NOT NULL,
  description TEXT         NOT NULL,
  image_url   VARCHAR(500) NULL,
  is_deleted  TINYINT(1)  NOT NULL DEFAULT 0,
  created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_blog_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- BLOG LIKES (one like per user per blog)
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_likes (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  blog_id    INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_blog_like    UNIQUE (user_id, blog_id),
  CONSTRAINT fk_like_user    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_like_blog    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
);

-- ============================================================
-- COMMENTS (supports nested replies via parent_comment_id)
-- ============================================================
CREATE TABLE IF NOT EXISTS comments (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  blog_id           INT UNSIGNED NOT NULL,
  user_id           INT UNSIGNED NOT NULL,
  parent_comment_id INT UNSIGNED NULL DEFAULT NULL,
  content           TEXT         NOT NULL,
  is_edited         TINYINT(1)  NOT NULL DEFAULT 0,
  is_deleted        TINYINT(1)  NOT NULL DEFAULT 0,
  created_at        DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_comment_blog   FOREIGN KEY (blog_id)           REFERENCES blogs(id)    ON DELETE CASCADE,
  CONSTRAINT fk_comment_user   FOREIGN KEY (user_id)           REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_comment_parent FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_blogs_user_id    ON blogs(user_id);
CREATE INDEX idx_blogs_is_deleted ON blogs(is_deleted);
CREATE INDEX idx_comments_blog_id ON comments(blog_id);
CREATE INDEX idx_blog_likes_blog  ON blog_likes(blog_id);
