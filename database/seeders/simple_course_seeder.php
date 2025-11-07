<?php

/**
 * Simple Frontend Development Course Seeder
 * Run: php database/seeders/simple_course_seeder.php
 */

// Load configuration
$config = require __DIR__ . '/../../config/database.php';

// Create PDO connection
try {
    $dsn = "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']}";
    $pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
    echo "✓ Database connected\n\n";
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage() . "\n");
}

// Helper function to generate UUID
function generateUuid() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

echo "Starting Frontend Development Course Seeder...\n\n";

// 1. Create or get facilitator
echo "1. Creating facilitator user...\n";
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
$stmt->execute(['facilitator@nebatech.com']);
$facilitator = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$facilitator) {
    $password = password_hash('Password123!', PASSWORD_BCRYPT, ['cost' => 12]);
    $stmt = $pdo->prepare("
        INSERT INTO users (email, password, first_name, last_name, role, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute(['facilitator@nebatech.com', $password, 'Sarah', 'Johnson', 'facilitator']);
    $facilitatorId = $pdo->lastInsertId();
    echo "   ✓ Facilitator created (ID: $facilitatorId)\n";
} else {
    $facilitatorId = $facilitator['id'];
    echo "   ✓ Facilitator exists (ID: $facilitatorId)\n";
}

// 2. Create course
echo "\n2. Creating Frontend Development course...\n";

// Check if course already exists
$stmt = $pdo->prepare("SELECT id FROM courses WHERE slug = ? LIMIT 1");
$stmt->execute(['frontend-development-fundamentals']);
$existingCourse = $stmt->fetch(PDO::FETCH_ASSOC);

if ($existingCourse) {
    $courseId = $existingCourse['id'];
    echo "   ✓ Course already exists (ID: $courseId) - Skipping\n";
} else {
    $stmt = $pdo->prepare("
        INSERT INTO courses (
            uuid, facilitator_id, title, slug, description, 
            category, level, duration_hours, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    $courseUuid = generateUuid();
    $stmt->execute([
        $courseUuid,
        $facilitatorId,
        'Frontend Development Fundamentals',
        'frontend-development-fundamentals',
        'Master the essentials of modern frontend web development. Learn HTML5, CSS3, JavaScript, and React.',
        'frontend',
        'beginner',
        60,
        'published'
    ]);
    $courseId = $pdo->lastInsertId();
    echo "   ✓ Course created (ID: $courseId)\n";
}

// 3. Create modules
echo "\n3. Creating modules...\n";
$modules = [
    ['HTML5 Fundamentals', 'Learn HTML5 building blocks'],
    ['CSS3 & Responsive Design', 'Style with CSS3 and responsive techniques'],
    ['JavaScript Basics', 'Programming fundamentals'],
    ['Advanced JavaScript', 'ES6+ and async programming'],
    ['React Fundamentals', 'Build UIs with React'],
    ['React Advanced', 'Advanced React patterns'],
    ['Git & GitHub', 'Version control mastery'],
    ['Capstone Project', 'Build your portfolio project']
];

$moduleIds = [];
foreach ($modules as $index => $module) {
    $stmt = $pdo->prepare("
        INSERT INTO modules (uuid, course_id, title, description, order_index, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([generateUuid(), $courseId, $module[0], $module[1], $index, 'published']);
    $moduleIds[] = $pdo->lastInsertId();
    echo "   ✓ Module $index: {$module[0]}\n";
}

// 4. Create lessons for first 3 modules
echo "\n4. Creating lessons...\n";

$lessonData = [
    // Module 1: HTML
    [$moduleIds[0], 'Introduction to HTML', 'text', 30],
    [$moduleIds[0], 'HTML Document Structure', 'text', 45],
    [$moduleIds[0], 'Forms and Input', 'text', 40],
    [$moduleIds[0], 'Practice: Contact Form', 'code', 60],
    
    // Module 2: CSS
    [$moduleIds[1], 'CSS Basics', 'text', 45],
    [$moduleIds[1], 'Flexbox Layout', 'text', 50],
    [$moduleIds[1], 'CSS Grid', 'text', 50],
    [$moduleIds[1], 'Responsive Design', 'text', 45],
    [$moduleIds[1], 'Project: Portfolio Page', 'project', 180],
    
    // Module 3: JavaScript
    [$moduleIds[2], 'JS Variables & Types', 'text', 40],
    [$moduleIds[2], 'Functions & Control Flow', 'text', 45],
    [$moduleIds[2], 'DOM Manipulation', 'text', 50],
    [$moduleIds[2], 'Project: Calculator', 'code', 120],
];

$lessonIds = [];
$orderIndex = 0;
$currentModule = null;
foreach ($lessonData as $lesson) {
    if ($currentModule !== $lesson[0]) {
        $currentModule = $lesson[0];
        $orderIndex = 0;
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO lessons (
            uuid, module_id, title, content, type, 
            duration_minutes, order_index, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([
        generateUuid(),
        $lesson[0],
        $lesson[1],
        "Content for {$lesson[1]} lesson will be here...",
        $lesson[2],
        $lesson[3],
        $orderIndex
    ]);
    $lessonIds[] = $pdo->lastInsertId();
    echo "   ✓ Lesson: {$lesson[1]}\n";
    $orderIndex++;
}

// 5. Create assignments
echo "\n5. Creating assignments...\n";

$assignments = [
    ['Contact Form Project', 'Build an HTML contact form', $lessonIds[3]],
    ['Portfolio Website', 'Create a responsive portfolio', $lessonIds[8]],
    ['Calculator App', 'Build a JavaScript calculator', $lessonIds[12]]
];

foreach ($assignments as $assignment) {
    $rubric = json_encode([
        ['criteria' => 'Functionality', 'description' => 'Works as expected', 'max_points' => 40],
        ['criteria' => 'Code Quality', 'description' => 'Clean, organized code', 'max_points' => 30],
        ['criteria' => 'Design', 'description' => 'Professional appearance', 'max_points' => 30]
    ]);
    
    $stmt = $pdo->prepare("
        INSERT INTO assignments (
            uuid, lesson_id, title, description, rubric, 
            max_score, due_date, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY), NOW())
    ");
    $stmt->execute([
        generateUuid(),
        $assignment[2],
        $assignment[0],
        $assignment[1],
        $rubric,
        100
    ]);
    echo "   ✓ Assignment: {$assignment[0]}\n";
}

// 6. Create placeholder lessons for remaining modules
echo "\n6. Creating placeholder lessons for remaining modules...\n";
for ($i = 3; $i < count($moduleIds); $i++) {
    $numLessons = ($i === count($moduleIds) - 1) ? 3 : 5;
    for ($j = 0; $j < $numLessons; $j++) {
        $stmt = $pdo->prepare("
            INSERT INTO lessons (
                uuid, module_id, title, content, type,
                duration_minutes, order_index, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            generateUuid(),
            $moduleIds[$i],
            "Lesson " . ($j + 1),
            "Content will be generated...",
            ($j === $numLessons - 1) ? 'project' : 'text',
            45,
            $j
        ]);
    }
    echo "   ✓ Module $i placeholder lessons created\n";
}

// Final summary
echo "\n" . str_repeat("=", 60) . "\n";
echo "✅ FRONTEND DEVELOPMENT COURSE CREATED SUCCESSFULLY!\n";
echo str_repeat("=", 60) . "\n\n";

$stmt = $pdo->prepare("
    SELECT 
        (SELECT COUNT(*) FROM modules WHERE course_id = ?) as modules,
        (SELECT COUNT(*) FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id = ?)) as lessons,
        (SELECT COUNT(*) FROM assignments WHERE lesson_id IN (SELECT id FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id = ?))) as assignments
");
$stmt->execute([$courseId, $courseId, $courseId]);
$stats = $stmt->fetch(PDO::FETCH_ASSOC);

echo "Course Summary:\n";
echo "  📚 Course ID: $courseId\n";
echo "  👤 Facilitator: Sarah Johnson\n";
echo "  📖 Modules: {$stats['modules']}\n";
echo "  📝 Lessons: {$stats['lessons']}\n";
echo "  📋 Assignments: {$stats['assignments']}\n";
echo "  ✅ Status: Published\n\n";

echo "Login Credentials:\n";
echo "  📧 Email: facilitator@nebatech.com\n";
echo "  🔑 Password: Password123!\n\n";

echo "Access course at:\n";
echo "  🌐 URL: http://localhost/Nebatech-AI-Academy/courses/frontend-development-fundamentals\n\n";
