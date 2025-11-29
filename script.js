// Edu Track - Student Performance Analytics & Reporting System
// Advanced JavaScript application with LocalStorage functionality

// Global variables
const SUBJECTS = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Computer Science'];

// LocalStorage Keys
const STORAGE_KEYS = {
    TEACHERS: 'teachers',
    STUDENTS: 'students',
    STUDENT_ACCOUNTS: 'student_accounts',
    MARKS: 'marks',
    PERFORMANCE_HISTORY: 'performance_history'
};

// Navigation function
function navigateTo(page) {
    window.location.href = page;
}

// LocalStorage helper functions
function getTeachers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TEACHERS)) || [];
}

function saveTeachers(teachers) {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
}

function getStudents() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS)) || [];
}

function saveStudents(students) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
}

function getStudentAccounts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENT_ACCOUNTS)) || [];
}

function saveStudentAccounts(accounts) {
    localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(accounts));
}

function getMarks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MARKS)) || [];
}

function saveMarks(marks) {
    localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(marks));
}

function getPerformanceHistory() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PERFORMANCE_HISTORY)) || [];
}

function savePerformanceHistory(history) {
    localStorage.setItem(STORAGE_KEYS.PERFORMANCE_HISTORY, JSON.stringify(history));
}

// Student Management Functions
function saveStudent() {
    const studentId = document.getElementById('studentId').value;
    const studentName = document.getElementById('studentName').value;
    const studentEmail = document.getElementById('studentEmail').value;
    const studentClass = document.getElementById('studentClass').value;
    const studentSection = document.getElementById('studentSection').value;
    const studentDOB = document.getElementById('studentDOB').value;

    if (!studentId || !studentName || !studentEmail || !studentClass || !studentSection || !studentDOB) {
        alert('Please fill in all fields');
        return;
    }

    const students = getStudents();

    // Check if student ID already exists
    if (students.find(s => s.id === studentId)) {
        alert('Student ID already exists!');
        return;
    }

    const newStudent = {
        id: studentId,
        name: studentName,
        email: studentEmail,
        class: studentClass,
        section: studentSection,
        dob: studentDOB,
        createdAt: new Date().toISOString()
    };

    students.push(newStudent);
    saveStudents(students);

    alert('Student added successfully!');
    navigateTo('admin_dashboard.html');
}

function loadStudentsForMarks() {
    const students = getStudents();
    const studentSelect = document.getElementById('studentSelect');

    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.name} (${student.id})`;
        studentSelect.appendChild(option);
    });
}

function loadStudentsForSelection() {
    const students = getStudents();
    const studentSelect = document.getElementById('studentSelect');

    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = student.name;
        studentSelect.appendChild(option);
    });
}

function loadStudentsList() {
    const students = getStudents();
    const tableBody = document.getElementById('studentsTableBody');
    const noStudentsMessage = document.getElementById('noStudentsMessage');
    const table = document.getElementById('studentsTable');

    if (students.length === 0) {
        table.style.display = 'none';
        noStudentsMessage.style.display = 'block';
        return;
    }

    table.style.display = 'table';
    noStudentsMessage.style.display = 'none';

    tableBody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>Grade ${student.class}</td>
            <td>Section ${student.section}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="viewStudent('${student.id}')">View</button>
                <button class="btn btn-secondary btn-sm" onclick="editStudent('${student.id}')">Edit</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function filterStudents(searchTerm) {
    const students = getStudents();
    const tableBody = document.getElementById('studentsTableBody');

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    tableBody.innerHTML = '';

    filteredStudents.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>Grade ${student.class}</td>
            <td>Section ${student.section}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="viewStudent('${student.id}')">View</button>
                <button class="btn btn-secondary btn-sm" onclick="editStudent('${student.id}')">Edit</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function viewStudent(studentId) {
    localStorage.setItem('selectedStudentId', studentId);
    navigateTo('view_report.html');
}

function editStudent(studentId) {
    // For now, just show an alert. In a full implementation, this would open an edit form.
    alert('Edit functionality would be implemented here');
}

// Marks Management Functions
function createSubjectInputs() {
    const container = document.getElementById('marksContainer');
    container.innerHTML = '';

    SUBJECTS.forEach(subject => {
        const subjectDiv = document.createElement('div');
        subjectDiv.className = 'form-group';
        subjectDiv.innerHTML = `
            <label for="${subject.toLowerCase().replace(' ', '')}">${subject}</label>
            <div style="display: flex; gap: 10px;">
                <input type="number" id="${subject.toLowerCase().replace(' ', '')}Obtained" placeholder="Marks Obtained" min="0" max="100" required>
                <input type="number" id="${subject.toLowerCase().replace(' ', '')}Total" placeholder="Total Marks" min="1" value="100" required>
            </div>
        `;
        container.appendChild(subjectDiv);
    });
}

function saveMarks() {
    const studentId = document.getElementById('studentSelect').value;
    const examType = document.getElementById('examType').value;

    if (!studentId || !examType) {
        alert('Please select a student and exam type');
        return;
    }

    const marks = getMarks();
    const subjectMarks = [];

    SUBJECTS.forEach(subject => {
        const obtainedId = subject.toLowerCase().replace(' ', '') + 'Obtained';
        const totalId = subject.toLowerCase().replace(' ', '') + 'Total';

        const obtained = parseFloat(document.getElementById(obtainedId).value);
        const total = parseFloat(document.getElementById(totalId).value);

        if (obtained > total) {
            alert(`Marks obtained cannot be greater than total marks for ${subject}`);
            return;
        }

        subjectMarks.push({
            subject: subject,
            obtained: obtained,
            total: total,
            percentage: (obtained / total) * 100
        });
    });

    // Check if marks already exist for this student and exam type
    const existingIndex = marks.findIndex(m => m.studentId === studentId && m.examType === examType);
    const marksData = {
        studentId: studentId,
        examType: examType,
        subjects: subjectMarks,
        totalObtained: subjectMarks.reduce((sum, s) => sum + s.obtained, 0),
        totalPossible: subjectMarks.reduce((sum, s) => sum + s.total, 0),
        overallPercentage: (subjectMarks.reduce((sum, s) => sum + s.obtained, 0) / subjectMarks.reduce((sum, s) => sum + s.total, 0)) * 100,
        createdAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
        marks[existingIndex] = marksData;
    } else {
        marks.push(marksData);
    }

    saveMarks(marks);
    alert('Marks saved successfully!');
    navigateTo('admin_dashboard.html');
}

// Dashboard Functions
function loadDashboardStats() {
    const students = getStudents();
    const marks = getMarks();

    // Enhanced statistics with sample data and trends
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('studentsTrend').textContent = '↗️ +2 this month';

    document.getElementById('totalSubjects').textContent = SUBJECTS.length;

    // Calculate average performance with trend
    if (marks.length > 0) {
        const totalPercentage = marks.reduce((sum, mark) => sum + mark.overallPercentage, 0);
        const avgPerformance = (totalPercentage / marks.length).toFixed(1);
        document.getElementById('avgPerformance').textContent = avgPerformance + '%';
        document.getElementById('performanceTrend').textContent = '↗️ +5.2% improvement';
    } else {
        document.getElementById('avgPerformance').textContent = '0%';
        document.getElementById('performanceTrend').textContent = '📊 No data yet';
    }

    // Top performer analysis
    if (marks.length > 0) {
        const topMark = marks.reduce((max, mark) =>
            mark.overallPercentage > max.overallPercentage ? mark : max
        );
        const topStudent = students.find(s => s.id === topMark.studentId);
        if (topStudent) {
            document.getElementById('topPerformer').textContent = topStudent.name;
            document.getElementById('topScore').textContent = topMark.overallPercentage.toFixed(1) + '% average';
        }
    }

    // Weak subjects analysis
    const weakSubjectsCount = calculateWeakSubjectsCount(marks);
    document.getElementById('weakSubjectsCount').textContent = weakSubjectsCount;
    document.getElementById('weakSubjectsTrend').textContent = weakSubjectsCount > 0 ? '⚠️ Need attention' : '✅ All good';

    // Attendance rate (simulated)
    const attendanceRate = Math.floor(85 + Math.random() * 10); // 85-95%
    document.getElementById('attendanceRate').textContent = attendanceRate + '%';
    document.getElementById('attendanceTrend').textContent = attendanceRate >= 90 ? '📈 Above target' : '🎯 On track';

    // Calculate additional insights
    if (marks.length > 0) {
        const classHealthScore = calculateClassHealthScore(marks);
        const improvementAreas = calculateImprovementAreas(marks);
        const topPerformersCount = calculateTopPerformersCount(marks);

        // Update insight cards if they exist
        const classHealthEl = document.getElementById('classHealthScore');
        const improvementEl = document.getElementById('improvementAreas');
        const topPerformersEl = document.getElementById('topPerformersCount');

        if (classHealthEl) classHealthEl.textContent = classHealthScore + '%';
        if (improvementEl) improvementEl.textContent = improvementAreas;
        if (topPerformersEl) topPerformersEl.textContent = topPerformersCount;
    }

    // Create admin dashboard charts if on admin dashboard page
    if (document.getElementById('adminGradeChart')) {
        createAdminCharts();
    }
}

function calculateClassHealthScore(marks) {
    if (marks.length === 0) return 0;

    const avgPercentage = marks.reduce((sum, m) => sum + m.overallPercentage, 0) / marks.length;
    const weakSubjectsPenalty = calculateWeakSubjectsCount(marks) * 2;
    const attendanceBonus = 5; // Simulated attendance bonus

    return Math.max(0, Math.min(100, Math.round(avgPercentage - weakSubjectsPenalty + attendanceBonus)));
}

function calculateImprovementAreas(marks) {
    const weakSubjects = new Set();
    marks.forEach(markData => {
        markData.subjects.forEach(subject => {
            if (subject.percentage < 60) {
                weakSubjects.add(subject.subject);
            }
        });
    });
    return weakSubjects.size;
}

function calculateTopPerformersCount(marks) {
    const topPerformers = marks.filter(m => m.overallPercentage >= 85);
    return topPerformers.length;
}

function calculateWeakSubjectsCount(marks) {
    let weakCount = 0;
    marks.forEach(markData => {
        markData.subjects.forEach(subject => {
            if (subject.percentage < 50) {
                weakCount++;
            }
        });
    });
    return weakCount;
}

function generateReport() {
    // For admin, generate a general report or redirect to student selection
    navigateTo('student_dashboard.html');
}

// Report Generation Functions
function loadStudentReport() {
    const selectedStudentId = localStorage.getItem('selectedStudentId');
    if (!selectedStudentId) {
        alert('No student selected');
        navigateTo('student_dashboard.html');
        return;
    }

    const students = getStudents();
    const marks = getMarks();
    const student = students.find(s => s.id === selectedStudentId);
    const studentMarks = marks.filter(m => m.studentId === selectedStudentId);

    if (!student) {
        alert('Student not found');
        navigateTo('student_dashboard.html');
        return;
    }

    // Populate student info
    document.getElementById('studentName').textContent = student.name;
    document.getElementById('studentId').textContent = student.id;
    document.getElementById('studentClass').textContent = `Grade ${student.class} - Section ${student.section}`;
    document.getElementById('reportDate').textContent = new Date().toLocaleDateString();

    if (studentMarks.length > 0) {
        // Use the latest marks
        const latestMarks = studentMarks[studentMarks.length - 1];
        displayStudentReport(student, latestMarks);
    } else {
        // No marks available
        document.getElementById('overallPercentage').textContent = 'N/A';
        document.getElementById('overallGrade').textContent = 'N/A';
        document.getElementById('performanceStatus').textContent = 'No marks available';
        document.getElementById('performanceStatus').className = 'status-badge';
    }
}

function displayStudentReport(student, marksData) {
    const percentage = marksData.overallPercentage;
    const grade = calculateGrade(percentage);
    const status = getPerformanceStatus(percentage);

    // Update summary
    document.getElementById('overallPercentage').textContent = percentage.toFixed(1) + '%';
    document.getElementById('overallGrade').textContent = grade;
    document.getElementById('performanceStatus').textContent = status;
    document.getElementById('performanceStatus').className = `status-badge ${status.toLowerCase().replace(' ', '-')}`;

    // Create all charts
    createSubjectChart(marksData.subjects);
    createGradeDistributionChart(marksData.subjects);
    createPerformanceTrendChart(marksData);

    // Populate marks table
    const tableBody = document.getElementById('marksTableBody');
    tableBody.innerHTML = '';

    marksData.subjects.forEach(subject => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${subject.subject}</td>
            <td>${subject.obtained}</td>
            <td>${subject.total}</td>
            <td>${subject.percentage.toFixed(1)}%</td>
            <td>${calculateGrade(subject.percentage)}</td>
        `;
        tableBody.appendChild(row);
    });

    // Generate recommendations
    generateRecommendations(marksData.subjects, percentage);
}

function calculateGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
}

function getPerformanceStatus(percentage) {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Needs Improvement';
    return 'Critical';
}

function createSubjectChart(subjects) {
    const ctx = document.getElementById('subjectChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subjects.map(s => s.subject),
            datasets: [{
                label: 'Percentage',
                data: subjects.map(s => s.percentage),
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(236, 72, 153, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createGradeDistributionChart(subjects) {
    const ctx = document.getElementById('gradeChart').getContext('2d');

    // Calculate grade distribution
    const grades = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'F': 0 };

    subjects.forEach(subject => {
        const grade = calculateGrade(subject.percentage);
        grades[grade]++;
    });

    // Filter out grades with 0 count
    const labels = Object.keys(grades).filter(grade => grades[grade] > 0);
    const data = labels.map(grade => grades[grade]);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',   // A+
                    'rgba(34, 197, 94, 0.8)',    // A
                    'rgba(59, 130, 246, 0.8)',   // B+
                    'rgba(96, 165, 250, 0.8)',   // B
                    'rgba(245, 158, 11, 0.8)',   // C+
                    'rgba(251, 191, 36, 0.8)',   // C
                    'rgba(239, 68, 68, 0.8)'     // F
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(96, 165, 250, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(251, 191, 36, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createPerformanceTrendChart(marksData) {
    const ctx = document.getElementById('trendChart').getContext('2d');

    // For now, create a sample trend. In a real app, you'd have historical data
    // This simulates performance over different assessments
    const assessments = ['Quiz 1', 'Midterm', 'Quiz 2', 'Final'];
    const trendData = [];

    // Generate trend data based on current performance
    const basePerformance = marksData.overallPercentage;
    assessments.forEach((assessment, index) => {
        // Simulate some variation around the base performance
        const variation = (Math.random() - 0.5) * 20; // ±10 variation
        trendData.push(Math.max(0, Math.min(100, basePerformance + variation)));
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: assessments,
            datasets: [{
                label: 'Performance Trend',
                data: trendData,
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function generateRecommendations(subjects, overallPercentage) {
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';

    // Overall performance recommendation
    let overallRecommendation = '';
    let overallClass = '';

    if (overallPercentage >= 80) {
        overallRecommendation = 'Excellent performance! Keep up the great work and maintain your study habits.';
        overallClass = 'excellent';
    } else if (overallPercentage >= 60) {
        overallRecommendation = 'Good performance! Focus on consistent practice and time management.';
        overallClass = 'good';
    } else if (overallPercentage >= 40) {
        overallRecommendation = 'Needs improvement. Consider seeking extra help in challenging subjects.';
        overallClass = 'improvement';
    } else {
        overallRecommendation = 'Critical improvement required. Immediate attention and support needed.';
        overallClass = 'critical';
    }

    const overallItem = document.createElement('div');
    overallItem.className = `recommendation-item ${overallClass}`;
    overallItem.innerHTML = `<strong>Overall Performance:</strong> ${overallRecommendation}`;
    recommendationsList.appendChild(overallItem);

    // Subject-specific recommendations
    subjects.forEach(subject => {
        if (subject.percentage < 50) {
            const subjectItem = document.createElement('div');
            subjectItem.className = 'recommendation-item improvement';
            subjectItem.innerHTML = `<strong>${subject.subject}:</strong> Requires additional focus and practice. Consider extra tutoring or study sessions.`;
            recommendationsList.appendChild(subjectItem);
        }
    });

    // General recommendations
    const generalRecommendations = [
        'Maintain regular study schedule and attendance.',
        'Participate actively in class discussions and group activities.',
        'Complete assignments on time and seek help when needed.',
        'Review class notes regularly and practice past questions.'
    ];

    generalRecommendations.forEach(rec => {
        const item = document.createElement('div');
        item.className = 'recommendation-item';
        item.innerHTML = `<strong>General:</strong> ${rec}`;
        recommendationsList.appendChild(item);
    });
}

// PDF Export Function
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get report data
    const studentName = document.getElementById('studentName').textContent;
    const studentId = document.getElementById('studentId').textContent;
    const studentClass = document.getElementById('studentClass').textContent;
    const overallPercentage = document.getElementById('overallPercentage').textContent;
    const overallGrade = document.getElementById('overallGrade').textContent;

    // Add header
    doc.setFontSize(20);
    doc.text('Student Performance Report', 20, 30);

    doc.setFontSize(12);
    doc.text(`Student Name: ${studentName}`, 20, 50);
    doc.text(`Student ID: ${studentId}`, 20, 60);
    doc.text(`Class: ${studentClass}`, 20, 70);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 80);

    // Add performance summary
    doc.setFontSize(16);
    doc.text('Performance Summary', 20, 100);

    doc.setFontSize(12);
    doc.text(`Overall Percentage: ${overallPercentage}`, 20, 115);
    doc.text(`Grade: ${overallGrade}`, 20, 125);

    // Add subject marks table
    doc.text('Subject-wise Performance', 20, 145);

    let yPos = 160;
    doc.text('Subject', 20, yPos);
    doc.text('Marks', 80, yPos);
    doc.text('Percentage', 120, yPos);
    doc.text('Grade', 160, yPos);

    // Get marks table data
    const tableRows = document.querySelectorAll('#marksTableBody tr');
    tableRows.forEach((row, index) => {
        yPos += 10;
        const cells = row.querySelectorAll('td');
        doc.text(cells[0].textContent, 20, yPos); // Subject
        doc.text(`${cells[1].textContent}/${cells[2].textContent}`, 80, yPos); // Marks
        doc.text(cells[3].textContent, 120, yPos); // Percentage
        doc.text(cells[4].textContent, 160, yPos); // Grade
    });

    // Save the PDF
    doc.save(`${studentName.replace(' ', '_')}_Report.pdf`);
}

// Admin Dashboard Charts
function createAdminCharts() {
    const marks = getMarks();

    if (marks.length === 0) {
        // Generate sample data if no data exists
        generateSampleData();
        // Reload marks after generation
        const updatedMarks = getMarks();
        if (updatedMarks.length === 0) return;
        createEnhancedCharts();
        return;
    }

    createEnhancedCharts();
}

function createAdminGradeChart(marks) {
    const ctx = document.getElementById('adminGradeChart').getContext('2d');

    // Calculate overall grade distribution across all students
    const grades = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'F': 0 };

    marks.forEach(markData => {
        const grade = calculateGrade(markData.overallPercentage);
        grades[grade]++;
    });

    // Filter out grades with 0 count
    const labels = Object.keys(grades).filter(grade => grades[grade] > 0);
    const data = labels.map(grade => grades[grade]);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',   // A+
                    'rgba(34, 197, 94, 0.8)',    // A
                    'rgba(59, 130, 246, 0.8)',   // B+
                    'rgba(96, 165, 250, 0.8)',   // B
                    'rgba(245, 158, 11, 0.8)',   // C+
                    'rgba(251, 191, 36, 0.8)',   // C
                    'rgba(239, 68, 68, 0.8)'     // F
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createAdminSubjectChart(marks) {
    const ctx = document.getElementById('adminSubjectChart').getContext('2d');

    // Calculate average performance per subject
    const subjectAverages = {};

    SUBJECTS.forEach(subject => {
        const subjectMarks = marks.map(m => m.subjects.find(s => s.subject === subject)?.percentage || 0).filter(p => p > 0);
        if (subjectMarks.length > 0) {
            subjectAverages[subject] = subjectMarks.reduce((sum, p) => sum + p, 0) / subjectMarks.length;
        }
    });

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(subjectAverages),
            datasets: [{
                label: 'Average Performance',
                data: Object.values(subjectAverages),
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function createAdminPerformanceChart(marks) {
    const ctx = document.getElementById('adminPerformanceChart').getContext('2d');

    // Group students by performance ranges
    const ranges = {
        '90-100%': 0,
        '80-89%': 0,
        '70-79%': 0,
        '60-69%': 0,
        '50-59%': 0,
        'Below 50%': 0
    };

    marks.forEach(markData => {
        const percentage = markData.overallPercentage;
        if (percentage >= 90) ranges['90-100%']++;
        else if (percentage >= 80) ranges['80-89%']++;
        else if (percentage >= 70) ranges['70-79%']++;
        else if (percentage >= 60) ranges['60-69%']++;
        else if (percentage >= 50) ranges['50-59%']++;
        else ranges['Below 50%']++;
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(ranges),
            datasets: [{
                label: 'Number of Students',
                data: Object.values(ranges),
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Student Dashboard Functions
function loadStudentDashboard() {
    const selectedStudentId = localStorage.getItem('selectedStudentId');
    if (!selectedStudentId) {
        alert('No student selected');
        navigateTo('student_login.html');
        return;
    }

    const students = getStudents();
    const marks = getMarks();
    const student = students.find(s => s.id === selectedStudentId);
    const studentMarks = marks.filter(m => m.studentId === selectedStudentId);

    if (!student) {
        alert('Student not found');
        navigateTo('student_login.html');
        return;
    }

    // Update student name
    document.getElementById('studentName').textContent = student.name;

    if (studentMarks.length > 0) {
        // Use the latest marks
        const latestMarks = studentMarks[studentMarks.length - 1];
        updateStudentStats(student, latestMarks);
        createStudentDashboardCharts(latestMarks);
    } else {
        // No marks available
        document.getElementById('currentGrade').textContent = 'N/A';
        document.getElementById('overallPercentage').textContent = '0%';
        document.getElementById('classRank').textContent = '#N/A';
    }
}

function updateStudentStats(student, marksData) {
    const percentage = marksData.overallPercentage;
    const grade = calculateGrade(percentage);

    document.getElementById('currentGrade').textContent = grade;
    document.getElementById('overallPercentage').textContent = percentage.toFixed(1) + '%';

    // Calculate class rank (simplified)
    const allMarks = getMarks();
    const studentPercentages = allMarks.map(m => ({
        studentId: m.studentId,
        percentage: m.overallPercentage
    }));

    studentPercentages.sort((a, b) => b.percentage - a.percentage);
    const rank = studentPercentages.findIndex(s => s.studentId === student.id) + 1;
    document.getElementById('classRank').textContent = '#' + rank;

    // Add performance badge
    const badge = getPerformanceBadge(percentage);
    const badgeContainer = document.getElementById('performanceBadge');
    badgeContainer.innerHTML = createBadgeElement(badge);
    lucide.createIcons();
}

function createStudentDashboardCharts(marksData) {
    // Subject performance chart
    const subjectCtx = document.getElementById('subjectChart').getContext('2d');
    new Chart(subjectCtx, {
        type: 'bar',
        data: {
            labels: marksData.subjects.map(s => s.subject.substring(0, 3)), // Shortened labels
            datasets: [{
                label: 'Percentage',
                data: marksData.subjects.map(s => s.percentage),
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Progress chart (simulated data)
    const progressCtx = document.getElementById('progressChart').getContext('2d');
    const progressData = [75, 78, 82, 85, 88, marksData.overallPercentage]; // Last 6 assessments

    new Chart(progressCtx, {
        type: 'line',
        data: {
            labels: ['Ass1', 'Ass2', 'Ass3', 'Ass4', 'Ass5', 'Latest'],
            datasets: [{
                label: 'Performance Trend',
                data: progressData,
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Authentication Functions
function registerTeacher() {
    const name = document.getElementById('teacherName').value;
    const email = document.getElementById('teacherEmail').value;
    const password = document.getElementById('teacherPassword').value;
    const confirmPassword = document.getElementById('teacherConfirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    const teachers = getTeachers();

    // Check if email already exists
    if (teachers.find(t => t.email === email)) {
        showAlert('Email already registered', 'error');
        return;
    }

    const newTeacher = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };

    teachers.push(newTeacher);
    saveTeachers(teachers);

    showAlert('Teacher registered successfully!', 'success');
    setTimeout(() => {
        navigateTo('teacher_login.html');
    }, 1500);
}

function loginTeacher() {
    const email = document.getElementById('teacherEmail').value;
    const password = document.getElementById('teacherPassword').value;

    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    const teachers = getTeachers();
    const teacher = teachers.find(t => t.email === email && t.password === password);

    if (teacher) {
        localStorage.setItem('currentTeacher', JSON.stringify(teacher));
        showAlert('Login successful!', 'success');
        setTimeout(() => {
            navigateTo('admin_dashboard.html');
        }, 1000);
    } else {
        showAlert('Invalid email or password', 'error');
    }
}

function registerStudent() {
    const name = document.getElementById('studentName').value;
    const email = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;
    const confirmPassword = document.getElementById('studentConfirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    const studentAccounts = getStudentAccounts();

    // Check if email already exists
    if (studentAccounts.find(s => s.email === email)) {
        showAlert('Email already registered', 'error');
        return;
    }

    const newStudentAccount = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };

    studentAccounts.push(newStudentAccount);
    saveStudentAccounts(studentAccounts);

    showAlert('Student registered successfully!', 'success');
    setTimeout(() => {
        navigateTo('student_login.html');
    }, 1500);
}

function loginStudent() {
    const email = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;

    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    const studentAccounts = getStudentAccounts();
    const student = studentAccounts.find(s => s.email === email && s.password === password);

    if (student) {
        localStorage.setItem('currentStudent', JSON.stringify(student));
        showAlert('Login successful!', 'success');
        setTimeout(() => {
            navigateTo('student_dashboard.html');
        }, 1000);
    } else {
        showAlert('Invalid email or password', 'error');
    }
}

// Performance Badge System
function getPerformanceBadge(percentage) {
    if (percentage >= 85) return { type: 'gold', label: 'Gold' };
    if (percentage >= 70) return { type: 'silver', label: 'Silver' };
    if (percentage >= 50) return { type: 'bronze', label: 'Bronze' };
    return { type: 'warning', label: 'Red Alert' };
}

function createBadgeElement(badge) {
    return `<span class="performance-badge badge-${badge.type}">
        <i data-lucide="award"></i>
        ${badge.label}
    </span>`;
}

// Weak Subject Detection
function detectWeakSubjects(subjects) {
    const weakSubjects = [];
    subjects.forEach(subject => {
        if (subject.percentage < 50) {
            weakSubjects.push({
                ...subject,
                tips: getSubjectTips(subject.subject)
            });
        }
    });
    return weakSubjects;
}

function getSubjectTips(subject) {
    const tips = {
        'Mathematics': [
            'Practice daily problem-solving',
            'Focus on understanding concepts rather than memorization',
            'Use visual aids and diagrams',
            'Break down complex problems into smaller steps'
        ],
        'Science': [
            'Conduct simple experiments at home',
            'Create mind maps for different topics',
            'Watch educational videos',
            'Connect concepts to real-world applications'
        ],
        'English': [
            'Read books regularly',
            'Practice writing daily',
            'Learn 5 new words each day',
            'Join conversation groups'
        ],
        'History': [
            'Create timelines for events',
            'Connect historical events to current events',
            'Use flashcards for important dates',
            'Watch historical documentaries'
        ],
        'Geography': [
            'Use maps and globes regularly',
            'Learn about current events in different regions',
            'Create labeled diagrams',
            'Study climate patterns and landforms'
        ],
        'Computer Science': [
            'Practice coding daily',
            'Build small projects',
            'Learn one concept at a time',
            'Join coding communities'
        ]
    };
    return tips[subject] || ['Seek help from teachers', 'Practice regularly', 'Focus on understanding basics'];
}

// Class Ranking System
function getClassRanking() {
    const marks = getMarks();
    const students = getStudents();

    // Calculate latest performance for each student
    const studentPerformances = students.map(student => {
        const studentMarks = marks.filter(m => m.studentId === student.id);
        if (studentMarks.length === 0) return null;

        const latestMarks = studentMarks[studentMarks.length - 1];
        return {
            student: student,
            percentage: latestMarks.overallPercentage,
            grade: calculateGrade(latestMarks.overallPercentage)
        };
    }).filter(p => p !== null);

    // Sort by percentage (descending)
    studentPerformances.sort((a, b) => b.percentage - a.percentage);

    return studentPerformances;
}

// Progress Tracking
function savePerformanceHistory(studentId, marksData) {
    const history = getPerformanceHistory();
    const historyEntry = {
        studentId: studentId,
        date: new Date().toISOString(),
        percentage: marksData.overallPercentage,
        subjects: marksData.subjects
    };

    history.push(historyEntry);
    savePerformanceHistory(history);
}

function getStudentProgress(studentId) {
    const history = getPerformanceHistory();
    return history.filter(h => h.studentId === studentId).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Notification System
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert-notification');
    existingAlerts.forEach(alert => alert.remove());

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-notification alert-${type}`;
    alertDiv.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}"></i>
        <span>${message}</span>
    `;

    // Add to page
    document.body.appendChild(alertDiv);

    // Initialize Lucide icons for the alert
    lucide.createIcons();

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}

// Enhanced Chart Functions
function createComparisonChart() {
    const selectedStudentId = localStorage.getItem('selectedStudentId');
    if (!selectedStudentId) return;

    const marks = getMarks();
    const studentMarks = marks.filter(m => m.studentId === selectedStudentId);
    if (studentMarks.length === 0) return;

    const latestMarks = studentMarks[studentMarks.length - 1];
    const allMarks = getMarks();

    // Calculate class average for each subject
    const classAverages = {};
    SUBJECTS.forEach(subject => {
        const subjectScores = allMarks.map(m => m.subjects.find(s => s.subject === subject)?.percentage || 0).filter(p => p > 0);
        classAverages[subject] = subjectScores.length > 0 ? subjectScores.reduce((sum, p) => sum + p, 0) / subjectScores.length : 0;
    });

    const ctx = document.getElementById('studentVsClassChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: SUBJECTS.map(s => s.substring(0, 3)),
            datasets: [{
                label: 'Your Score',
                data: SUBJECTS.map(subject => latestMarks.subjects.find(s => s.subject === subject)?.percentage || 0),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
            }, {
                label: 'Class Average',
                data: SUBJECTS.map(subject => classAverages[subject]),
                backgroundColor: 'rgba(156, 163, 175, 0.8)',
                borderColor: 'rgba(156, 163, 175, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Analytics Dashboard Functions
function loadAnalyticsDashboard() {
    loadClassRankings();
    loadWeakSubjectsAnalysis();
    createAnalyticsCharts();
    loadPerformanceInsights();
}

function loadClassRankings() {
    const rankings = getClassRanking();

    // Top 5 performers
    const topPerformers = rankings.slice(0, 5);
    const topContainer = document.getElementById('topPerformers');
    topContainer.innerHTML = '';

    topPerformers.forEach((ranking, index) => {
        const rankingItem = document.createElement('div');
        rankingItem.className = 'ranking-item';
        rankingItem.innerHTML = `
            <div class="student-info">
                <div class="student-avatar">${ranking.student.name.charAt(0)}</div>
                <div>
                    <div class="font-medium">${ranking.student.name}</div>
                    <div class="text-sm text-gray-500">${ranking.percentage.toFixed(1)}% - ${ranking.grade}</div>
                </div>
            </div>
            <div class="font-bold text-lg">#${index + 1}</div>
        `;
        topContainer.appendChild(rankingItem);
    });

    // Bottom 5 performers (needs attention)
    const lowPerformers = rankings.slice(-5).reverse();
    const lowContainer = document.getElementById('lowPerformers');
    lowContainer.innerHTML = '';

    lowPerformers.forEach((ranking, index) => {
        const rankingItem = document.createElement('div');
        rankingItem.className = 'ranking-item';
        rankingItem.innerHTML = `
            <div class="student-info">
                <div class="student-avatar">${ranking.student.name.charAt(0)}</div>
                <div>
                    <div class="font-medium">${ranking.student.name}</div>
                    <div class="text-sm text-gray-500">${ranking.percentage.toFixed(1)}% - ${ranking.grade}</div>
                </div>
            </div>
            <div class="font-bold text-lg text-red-600">#${rankings.length - 4 + index}</div>
        `;
        lowContainer.appendChild(rankingItem);
    });
}

function loadWeakSubjectsAnalysis() {
    const marks = getMarks();
    const weakSubjectsCount = {};

    marks.forEach(markData => {
        markData.subjects.forEach(subject => {
            if (subject.percentage < 50) {
                weakSubjectsCount[subject.subject] = (weakSubjectsCount[subject.subject] || 0) + 1;
            }
        });
    });

    const container = document.getElementById('weakSubjectsContainer');
    container.innerHTML = '';

    Object.entries(weakSubjectsCount).forEach(([subject, count]) => {
        const card = document.createElement('div');
        card.className = 'weak-subject-card';
        card.innerHTML = `
            <h4><i data-lucide="alert-triangle"></i> ${subject}</h4>
            <p>${count} student${count > 1 ? 's' : ''} struggling</p>
        `;
        container.appendChild(card);
    });

    if (Object.keys(weakSubjectsCount).length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500">No weak subjects detected! 🎉</p>';
    }

    lucide.createIcons();
}

function createAnalyticsCharts() {
    const marks = getMarks();

    if (marks.length === 0) return;

    // Grade Distribution Chart
    createGradeDistributionChart(marks);

    // Subject Performance Radar
    createSubjectPerformanceRadar(marks);

    // Performance Trends
    createPerformanceTrendsChart(marks);

    // Student vs Class Comparison
    createComparisonChart();
}

function createGradeDistributionChart(marks) {
    const ctx = document.getElementById('gradeDistributionChart').getContext('2d');

    const grades = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'F': 0 };

    marks.forEach(markData => {
        const grade = calculateGrade(markData.overallPercentage);
        grades[grade]++;
    });

    const labels = Object.keys(grades).filter(grade => grades[grade] > 0);
    const data = labels.map(grade => grades[grade]);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(96, 165, 250, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function createSubjectPerformanceRadar(marks) {
    const ctx = document.getElementById('subjectComparisonChart').getContext('2d');

    const subjectAverages = {};
    SUBJECTS.forEach(subject => {
        const subjectScores = marks.map(m => m.subjects.find(s => s.subject === subject)?.percentage || 0).filter(p => p > 0);
        subjectAverages[subject] = subjectScores.length > 0 ? subjectScores.reduce((sum, p) => sum + p, 0) / subjectScores.length : 0;
    });

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: SUBJECTS,
            datasets: [{
                label: 'Average Performance',
                data: Object.values(subjectAverages),
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function createPerformanceTrendsChart(marks) {
    const ctx = document.getElementById('performanceTrendsChart').getContext('2d');

    // Group by date and calculate averages
    const dateGroups = {};
    marks.forEach(mark => {
        const date = new Date(mark.createdAt).toLocaleDateString();
        if (!dateGroups[date]) {
            dateGroups[date] = [];
        }
        dateGroups[date].push(mark.overallPercentage);
    });

    const labels = Object.keys(dateGroups).sort();
    const data = labels.map(date => {
        const percentages = dateGroups[date];
        return percentages.reduce((sum, p) => sum + p, 0) / percentages.length;
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Class Average Performance',
                data: data,
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function loadPerformanceInsights() {
    const marks = getMarks();
    const rankings = getClassRanking();

    if (marks.length === 0) return;

    // Class Average
    const classAverage = marks.reduce((sum, m) => sum + m.overallPercentage, 0) / marks.length;
    document.getElementById('classAverage').textContent = classAverage.toFixed(1) + '%';

    // Improvement Rate (simplified - students with >70%)
    const improvedCount = marks.filter(m => m.overallPercentage >= 70).length;
    const improvementRate = (improvedCount / marks.length) * 100;
    document.getElementById('improvementRate').textContent = improvementRate.toFixed(1) + '%';

    // At-risk students (<50%)
    const atRiskCount = marks.filter(m => m.overallPercentage < 50).length;
    document.getElementById('atRiskCount').textContent = atRiskCount;

    // Top Performer
    if (rankings.length > 0) {
        document.getElementById('topPerformer').textContent = rankings[0].student.name;
    }
}

// Subject Improvement Page
function loadSubjectImprovement() {
    const selectedStudentId = localStorage.getItem('selectedStudentId');
    if (!selectedStudentId) {
        navigateTo('student_login.html');
        return;
    }

    const marks = getMarks();
    const studentMarks = marks.filter(m => m.studentId === selectedStudentId);

    if (studentMarks.length === 0) {
        document.getElementById('strongSubjectsAlert').style.display = 'block';
        return;
    }

    const latestMarks = studentMarks[studentMarks.length - 1];
    const weakSubjects = detectWeakSubjects(latestMarks.subjects);

    if (weakSubjects.length > 0) {
        document.getElementById('weakSubjectsAlert').style.display = 'block';

        const container = document.getElementById('improvementContainer');
        container.innerHTML = '';

        weakSubjects.forEach(subject => {
            const card = document.createElement('div');
            card.className = 'improvement-card weak';
            card.innerHTML = `
                <h3><i data-lucide="target"></i> ${subject.subject}</h3>
                <div class="current-score">Current Score: ${subject.percentage.toFixed(1)}%</div>
                <div class="tips">
                    <h4>Improvement Tips:</h4>
                    <ul>
                        ${subject.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            `;
            container.appendChild(card);
        });
    } else {
        document.getElementById('strongSubjectsAlert').style.display = 'block';
    }

    lucide.createIcons();
}

// Sample Data Generation Functions
function generateSampleData() {
    // Only generate if no data exists
    const students = getStudents();
    const marks = getMarks();

    if (students.length === 0) {
        generateSampleStudents();
    }

    if (marks.length === 0) {
        generateSampleMarks();
    }
}

function generateSampleStudents() {
    const sampleStudents = [
        { id: 'STU001', name: 'Alice Johnson', email: 'alice.johnson@school.edu', class: '10', section: 'A', dob: '2008-05-15' },
        { id: 'STU002', name: 'Bob Wilson', email: 'bob.wilson@school.edu', class: '10', section: 'A', dob: '2008-03-22' },
        { id: 'STU003', name: 'Charlie Brown', email: 'charlie.brown@school.edu', class: '10', section: 'B', dob: '2008-07-08' },
        { id: 'STU004', name: 'Diana Prince', email: 'diana.prince@school.edu', class: '10', section: 'B', dob: '2008-11-30' },
        { id: 'STU005', name: 'Edward Norton', email: 'edward.norton@school.edu', class: '10', section: 'A', dob: '2008-09-12' },
        { id: 'STU006', name: 'Fiona Green', email: 'fiona.green@school.edu', class: '10', section: 'B', dob: '2008-01-25' },
        { id: 'STU007', name: 'George Lucas', email: 'george.lucas@school.edu', class: '10', section: 'A', dob: '2008-04-18' },
        { id: 'STU008', name: 'Helen Troy', email: 'helen.troy@school.edu', class: '10', section: 'B', dob: '2008-06-03' },
        { id: 'STU009', name: 'Ian Malcolm', email: 'ian.malcolm@school.edu', class: '10', section: 'A', dob: '2008-08-27' },
        { id: 'STU010', name: 'Julia Roberts', email: 'julia.roberts@school.edu', class: '10', section: 'B', dob: '2008-12-05' }
    ];

    const students = getStudents();
    sampleStudents.forEach(student => {
        student.createdAt = new Date().toISOString();
        students.push(student);
    });
    saveStudents(students);

    // Also create student accounts
    const studentAccounts = getStudentAccounts();
    sampleStudents.forEach(student => {
        studentAccounts.push({
            id: student.id,
            name: student.name,
            email: student.email,
            password: 'password123', // Default password
            createdAt: new Date().toISOString()
        });
    });
    saveStudentAccounts(studentAccounts);
}

function generateSampleMarks() {
    const students = getStudents();
    const marks = getMarks();

    // Generate marks for different exam types
    const examTypes = ['Midterm Exam', 'Final Exam', 'Quiz 1', 'Quiz 2'];

    students.forEach(student => {
        examTypes.forEach(examType => {
            const subjects = SUBJECTS.map(subject => {
                // Generate realistic marks with some variation
                const baseScore = 60 + Math.random() * 35; // 60-95 range
                const obtained = Math.round(baseScore);
                const total = 100;

                return {
                    subject: subject,
                    obtained: obtained,
                    total: total,
                    percentage: (obtained / total) * 100
                };
            });

            const overallPercentage = subjects.reduce((sum, s) => sum + s.percentage, 0) / subjects.length;

            marks.push({
                studentId: student.id,
                examType: examType,
                subjects: subjects,
                totalObtained: subjects.reduce((sum, s) => sum + s.obtained, 0),
                totalPossible: subjects.reduce((sum, s) => sum + s.total, 0),
                overallPercentage: overallPercentage,
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Random date within last 30 days
            });
        });
    });

    saveMarks(marks);
}

// Enhanced Chart Data with Better Sample Data
function createEnhancedCharts() {
    // Generate sample data if needed
    generateSampleData();

    const marks = getMarks();

    if (marks.length === 0) return;

    // Create multiple enhanced charts
    createGradeDistributionChart(marks);
    createSubjectPerformanceRadar(marks);
    createPerformanceTrendsChart(marks);
    createStudentVsClassChart(marks);
    createSubjectWiseTrendsChart(marks);
}

function createStudentVsClassChart(marks) {
    const ctx = document.getElementById('studentVsClassChart').getContext('2d');

    // Calculate class averages for each subject
    const classAverages = {};
    SUBJECTS.forEach(subject => {
        const subjectScores = marks.map(m => m.subjects.find(s => s.subject === subject)?.percentage || 0).filter(p => p > 0);
        classAverages[subject] = subjectScores.length > 0 ? subjectScores.reduce((sum, p) => sum + p, 0) / subjectScores.length : 0;
    });

    // Get a sample student's performance (first student)
    const sampleStudent = marks.find(m => m.studentId === 'STU001');
    const studentScores = sampleStudent ? SUBJECTS.map(subject =>
        sampleStudent.subjects.find(s => s.subject === subject)?.percentage || 0
    ) : SUBJECTS.map(() => 0);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: SUBJECTS.map(s => s.substring(0, 4)),
            datasets: [{
                label: 'Sample Student',
                data: studentScores,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
            }, {
                label: 'Class Average',
                data: Object.values(classAverages),
                backgroundColor: 'rgba(156, 163, 175, 0.8)',
                borderColor: 'rgba(156, 163, 175, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Student vs Class Performance Comparison'
                }
            }
        }
    });
}

function createSubjectWiseTrendsChart(marks) {
    const ctx = document.getElementById('subjectTrendsChart').getContext('2d');

    // Group marks by exam type and calculate subject averages
    const examGroups = {};
    marks.forEach(mark => {
        if (!examGroups[mark.examType]) {
            examGroups[mark.examType] = {};
        }
        mark.subjects.forEach(subject => {
            if (!examGroups[mark.examType][subject.subject]) {
                examGroups[mark.examType][subject.subject] = [];
            }
            examGroups[mark.examType][subject.subject].push(subject.percentage);
        });
    });

    // Calculate averages for each exam type and subject
    const datasets = [];
    const colors = ['rgba(59, 130, 246, 1)', 'rgba(16, 185, 129, 1)', 'rgba(245, 158, 11, 1)', 'rgba(239, 68, 68, 1)', 'rgba(139, 92, 246, 1)', 'rgba(236, 72, 153, 1)'];

    SUBJECTS.forEach((subject, index) => {
        const data = Object.keys(examGroups).map(examType => {
            const scores = examGroups[examType][subject] || [];
            return scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;
        });

        datasets.push({
            label: subject,
            data: data,
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length].replace('1)', '0.1)'),
            borderWidth: 2,
            fill: false,
            tension: 0.4
        });
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(examGroups),
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Subject-wise Performance Trends'
                }
            }
        }
    });
}

// Utility functions
function calculatePercentage(obtained, total) {
    return (obtained / total) * 100;
}