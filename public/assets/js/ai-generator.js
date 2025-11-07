/**
 * AI Generation Functions for Facilitator Dashboard
 */

// Show AI Course Outline Generator Modal
function showAICourseOutlineModal() {
    const modal = document.getElementById('aiCourseOutlineModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Hide AI Course Outline Generator Modal
function hideAICourseOutlineModal() {
    const modal = document.getElementById('aiCourseOutlineModal');
    if (modal) {
        modal.classList.add('hidden');
        // Reset form
        document.getElementById('aiCourseOutlineForm').reset();
    }
}

// Generate Course Outline using AI
async function generateCourseOutline(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generating...';
    
    try {
        const response = await fetch('/Nebatech-AI-Academy/ai/generate-course-outline', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Display generated modules
            displayGeneratedModules(data.modules);
            hideAICourseOutlineModal();
            showNotification('Course outline generated successfully! Review and edit as needed.', 'success');
        } else {
            showNotification(data.error || 'Failed to generate course outline', 'error');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.', 'error');
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// Display generated modules in a modal for review
function displayGeneratedModules(modules) {
    const modalContent = `
        <div class="space-y-4">
            <h3 class="text-xl font-bold mb-4">Generated Course Modules</h3>
            ${modules.map((module, index) => `
                <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div class="flex items-start gap-3">
                        <span class="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                            ${index + 1}
                        </span>
                        <div class="flex-1">
                            <h4 class="font-bold text-lg">${module.title}</h4>
                            <p class="text-sm text-gray-600 mt-1">${module.description}</p>
                            ${module.objectives && module.objectives.length > 0 ? `
                                <div class="mt-2">
                                    <p class="text-sm font-semibold text-gray-700">Learning Objectives:</p>
                                    <ul class="list-disc list-inside text-sm text-gray-600 mt-1">
                                        ${module.objectives.map(obj => `<li>${obj}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            <p class="text-xs text-gray-500 mt-2">
                                <i class="fas fa-clock mr-1"></i>Estimated: ${module.estimated_hours || 4} hours
                            </p>
                        </div>
                    </div>
                </div>
            `).join('')}
            <div class="flex gap-3 pt-4">
                <button onclick="createCourseFromModules(${JSON.stringify(modules).replace(/"/g, '&quot;')})" 
                        class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex-1">
                    Create Course with These Modules
                </button>
                <button onclick="hideGeneratedModulesModal()" 
                        class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    // Create or update modal
    let modal = document.getElementById('generatedModulesModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'generatedModulesModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            ${modalContent}
        </div>
    `;
    modal.classList.remove('hidden');
}

// Hide generated modules modal
function hideGeneratedModulesModal() {
    const modal = document.getElementById('generatedModulesModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Create course from generated modules (redirects to create course page)
function createCourseFromModules(modules) {
    // Store modules in session storage
    sessionStorage.setItem('aiGeneratedModules', JSON.stringify(modules));
    // Redirect to create course page
    window.location.href = '/Nebatech-AI-Academy/facilitator/courses/create';
}

// Show AI Lesson Generator Modal
function showAILessonModal() {
    const modal = document.getElementById('aiLessonModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Hide AI Lesson Generator Modal
function hideAILessonModal() {
    const modal = document.getElementById('aiLessonModal');
    if (modal) {
        modal.classList.add('hidden');
        document.getElementById('aiLessonForm').reset();
    }
}

// Generate Lesson Content using AI
async function generateLessonContent(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generating...';
    
    try {
        const response = await fetch('/Nebatech-AI-Academy/ai/generate-lesson-content', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayGeneratedLesson(data.content);
            hideAILessonModal();
        } else {
            showNotification(data.error || 'Failed to generate lesson content', 'error');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.', 'error');
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// Display generated lesson content
function displayGeneratedLesson(content) {
    const modalContent = `
        <div class="space-y-4">
            <h3 class="text-xl font-bold mb-4">Generated Lesson Content</h3>
            
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 class="font-semibold mb-2">Content Preview:</h4>
                <div class="prose max-w-none text-sm">
                    ${content.content ? content.content.substring(0, 500) + '...' : 'No content generated'}
                </div>
            </div>
            
            ${content.key_points && content.key_points.length > 0 ? `
                <div class="border border-gray-200 rounded-lg p-4 bg-blue-50">
                    <h4 class="font-semibold mb-2">Key Points:</h4>
                    <ul class="list-disc list-inside text-sm space-y-1">
                        ${content.key_points.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${content.resources && content.resources.length > 0 ? `
                <div class="border border-gray-200 rounded-lg p-4 bg-green-50">
                    <h4 class="font-semibold mb-2">Resources:</h4>
                    <ul class="space-y-2">
                        ${content.resources.map(res => `
                            <li class="text-sm">
                                <i class="fas fa-link mr-1"></i>
                                <a href="${res.url}" target="_blank" class="text-blue-600 hover:underline">
                                    ${res.title}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <p class="text-sm text-gray-600">
                <i class="fas fa-clock mr-1"></i>Estimated Duration: ${content.duration_minutes || 30} minutes
            </p>
            
            <div class="flex gap-3 pt-4">
                <button onclick="saveLessonContent(${JSON.stringify(content).replace(/"/g, '&quot;')})" 
                        class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex-1">
                    Use This Content
                </button>
                <button onclick="hideGeneratedLessonModal()" 
                        class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    let modal = document.getElementById('generatedLessonModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'generatedLessonModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            ${modalContent}
        </div>
    `;
    modal.classList.remove('hidden');
}

// Hide generated lesson modal
function hideGeneratedLessonModal() {
    const modal = document.getElementById('generatedLessonModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Save lesson content (store in session for use when adding lesson)
function saveLessonContent(content) {
    sessionStorage.setItem('aiGeneratedLesson', JSON.stringify(content));
    hideGeneratedLessonModal();
    showNotification('Lesson content saved! You can now add it to a module.', 'success');
}

// Show AI Project Generator Modal
function showAIProjectModal() {
    const modal = document.getElementById('aiProjectModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Hide AI Project Generator Modal
function hideAIProjectModal() {
    const modal = document.getElementById('aiProjectModal');
    if (modal) {
        modal.classList.add('hidden');
        document.getElementById('aiProjectForm').reset();
    }
}

// Generate Project Brief using AI
async function generateProjectBrief(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generating...';
    
    try {
        const response = await fetch('/Nebatech-AI-Academy/ai/generate-project-brief', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayGeneratedProject(data.project);
            hideAIProjectModal();
        } else {
            showNotification(data.error || 'Failed to generate project brief', 'error');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.', 'error');
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// Display generated project
function displayGeneratedProject(project) {
    const modalContent = `
        <div class="space-y-4">
            <h3 class="text-xl font-bold mb-4">${project.title}</h3>
            
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 class="font-semibold mb-2">Description:</h4>
                <p class="text-sm">${project.description}</p>
            </div>
            
            ${project.requirements && project.requirements.length > 0 ? `
                <div class="border border-gray-200 rounded-lg p-4 bg-blue-50">
                    <h4 class="font-semibold mb-2">Requirements:</h4>
                    <ul class="list-decimal list-inside text-sm space-y-1">
                        ${project.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${project.rubric && project.rubric.length > 0 ? `
                <div class="border border-gray-200 rounded-lg p-4 bg-green-50">
                    <h4 class="font-semibold mb-2">Grading Rubric:</h4>
                    <div class="space-y-2">
                        ${project.rubric.map(criterion => `
                            <div class="flex justify-between items-start text-sm">
                                <div class="flex-1">
                                    <p class="font-semibold">${criterion.criteria}</p>
                                    <p class="text-gray-600">${criterion.description}</p>
                                </div>
                                <span class="font-bold text-green-600 ml-4">${criterion.max_points} pts</span>
                            </div>
                        `).join('')}
                    </div>
                    <p class="text-sm font-bold mt-3 pt-3 border-t border-green-200">
                        Total: ${project.max_score} points
                    </p>
                </div>
            ` : ''}
            
            <div class="flex gap-3 pt-4">
                <button onclick="saveProjectBrief(${JSON.stringify(project).replace(/"/g, '&quot;')})" 
                        class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex-1">
                    Use This Project
                </button>
                <button onclick="hideGeneratedProjectModal()" 
                        class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    let modal = document.getElementById('generatedProjectModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'generatedProjectModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            ${modalContent}
        </div>
    `;
    modal.classList.remove('hidden');
}

// Hide generated project modal
function hideGeneratedProjectModal() {
    const modal = document.getElementById('generatedProjectModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Save project brief
function saveProjectBrief(project) {
    sessionStorage.setItem('aiGeneratedProject', JSON.stringify(project));
    hideGeneratedProjectModal();
    showNotification('Project brief saved! You can now add it to a course.', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-transform`;
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}
