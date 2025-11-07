<?php

/**
 * Web Routes
 * Routes that return HTML views
 */

use Nebatech\Controllers\HomeController;
use Nebatech\Controllers\AuthController;
use Nebatech\Controllers\CourseController;
use Nebatech\Controllers\BlogController;
use Nebatech\Controllers\ContactController;
use Nebatech\Controllers\DashboardController;
use Nebatech\Controllers\FacilitatorController;
use Nebatech\Controllers\AIController;

// Home
$router->get('/', [HomeController::class, 'index']);
$router->get('/about', [HomeController::class, 'about']);

// Blog
$router->get('/blog', [BlogController::class, 'index']);
$router->get('/blog/{slug}', [BlogController::class, 'show']);

// Contact
$router->get('/contact', [ContactController::class, 'index']);
$router->post('/contact', [ContactController::class, 'submit']);

// Authentication
$router->get('/login', [AuthController::class, 'showLogin']);
$router->post('/login', [AuthController::class, 'login']);
$router->get('/register', [AuthController::class, 'showRegister']);
$router->post('/register', [AuthController::class, 'register']);
$router->get('/logout', [AuthController::class, 'logout']);

// Dashboard (protected routes)
$router->get('/dashboard', [DashboardController::class, 'index']);

// Facilitator Routes (protected)
$router->get('/facilitator/dashboard', [FacilitatorController::class, 'dashboard']);
$router->get('/facilitator/courses/create', [FacilitatorController::class, 'createCourse']);
$router->post('/facilitator/courses/create', [FacilitatorController::class, 'storeCourse']);
$router->get('/facilitator/courses/{id}/edit', [FacilitatorController::class, 'editCourse']);
$router->post('/facilitator/courses/{id}/edit', [FacilitatorController::class, 'updateCourse']);
$router->post('/facilitator/courses/{id}/publish', [FacilitatorController::class, 'publishCourse']);
$router->post('/facilitator/courses/{id}/modules', [FacilitatorController::class, 'addModule']);
$router->post('/facilitator/modules/{id}/lessons', [FacilitatorController::class, 'addLesson']);

// AI Generation Routes (facilitator only)
$router->post('/ai/generate-course-outline', [AIController::class, 'generateCourseOutline']);
$router->post('/ai/generate-lesson-content', [AIController::class, 'generateLessonContent']);
$router->post('/ai/generate-project-brief', [AIController::class, 'generateProjectBrief']);
$router->post('/ai/generate-complete-course', [AIController::class, 'generateCompleteCourse']);
$router->post('/ai/generate-quiz', [AIController::class, 'generateQuiz']);

// Courses
$router->get('/courses', [CourseController::class, 'index']);

// Course Categories
$router->get('/courses/frontend', [CourseController::class, 'frontend']);
$router->get('/courses/backend', [CourseController::class, 'backend']);
$router->get('/courses/fullstack', [CourseController::class, 'fullstack']);
$router->get('/courses/mobile', [CourseController::class, 'mobile']);
$router->get('/courses/ai', [CourseController::class, 'ai']);
$router->get('/courses/data-science', [CourseController::class, 'dataScience']);
$router->get('/courses/cybersecurity', [CourseController::class, 'cybersecurity']);
$router->get('/courses/cloud', [CourseController::class, 'cloud']);

// Individual Course
$router->get('/courses/{slug}', [CourseController::class, 'show']);
