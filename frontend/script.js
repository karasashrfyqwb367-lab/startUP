const API_URL = 'http://localhost:5000';

// DOM Elements
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('main section');
const authTabs = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');

// State
let token = localStorage.getItem('token');
let currentLang = localStorage.getItem('lang') || 'en';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);

    // Debug: Check server connection
    fetch(`${API_URL}/ping`)
        .then(r => r.json())
        .then(d => console.log('Server connection:', d))
        .catch(e => console.error('Server connection failed:', e));

    if (token) {
        showSection('create-company-section');
        document.getElementById('nav-dashboard').classList.remove('hidden');
        document.getElementById('nav-projects').classList.remove('hidden');
    } else {
        showSection('hero-section');
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('.nav-btn, .primary-btn').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
});

// Language Switcher
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        applyLanguage(lang);
    });
});

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);

    if (lang === 'ar') document.body.classList.add('rtl');
    else document.body.classList.remove('rtl');

    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });

    document.querySelectorAll('[data-placeholder-en]').forEach(el => {
        el.placeholder = el.getAttribute(`data-placeholder-${lang}`);
    });

    const authBtn = document.getElementById('auth-btn');
    if (token) {
        authBtn.textContent = translations[lang].auth_logout;
    } else {
        authBtn.textContent = translations[lang].auth_login;
    }
}

// Navigation
navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        if (targetId) showSection(targetId);
    });
});

const translations = {
    en: {
        logout_success: "Logged out successfully",
        login_success: "Welcome back!",
        auth_login: "Login",
        auth_logout: "Logout",
        applied_success: "Application Sent!",
        verify_success: "Email verified! You can now login.",
        job_publish_success: "Job Published Successfully!",
        company_launch_success: "Company Launched!",
        analysis_complete: "Analysis Complete",
        server_error: "Server error",
        connection_error: "Connection Error: AI Service Unavailable",
        account_created: "Account created! Please check your email for OTP.",
        no_companies: "No companies found.",
        no_jobs: "No jobs found.",
        applicants_for: "Applicants for",
        no_applicants: "No applicants yet.",
        signup_failed: "Signup failed",
        verification_failed: "Verification failed",
        login_required: "Please login first",
        startup_default: "Startup",
        industry_default: "Technology",
        company_desc_default: "A new innovative startup project.",
        strategic_analysis: "Strategic Analysis",
        job_title_default: "Operations Manager",
        job_desc_default: "Seeking a professional to manage daily operations as suggested in the AI report.",
        ai_unavailable: "AI Service Unavailable",
        remote_default: "Remote",
        competitive_salary: "Competitive",
        apply_now_btn: "Apply Now",
        no_jobs_available: "No jobs available yet. Be the first to hire!",
        failed_to_load_jobs: "Failed to load jobs.",
        login_to_apply: "Please login to apply",
        application_failed: "Application failed",
        note: "Cover Letter",
        email: "Email",
        accept: "Accept",
        reject: "Reject",
        username: "Candidate Name",
        phone: "Phone",
        skills: "Skills",
        assign_btn: "Assign & Send Email"
    },
    ar: {
        logout_success: "تم تسجيل الخروج بنجاح",
        login_success: "مرحباً بعودتك!",
        auth_login: "تسجيل الدخول",
        auth_logout: "خروج",
        applied_success: "تم إرسال الطلب بنجاح!",
        verify_success: "تم تفعيل الحساب! يمكنك الدخول الآن.",
        job_publish_success: "تم نشر الوظيفة بنجاح!",
        company_launch_success: "تم إطلاق الشركة بنجاح!",
        analysis_complete: "اكتمل التحليل الذكي",
        server_error: "خطأ في السيرفر",
        connection_error: "عفواً: خدمة الذكاء الاصطناعي غير متاحة حالياً",
        account_created: "تم إنشاء الحساب! برجاء مراجعة بريدك الإلكتروني",
        no_companies: "لا توجد شركات حتى الآن",
        no_jobs: "لا توجد وظائف حتى الآن",
        applicants_for: "المتقدمين لوظيفة",
        no_applicants: "لا يوجد متقدمين حتى الآن",
        signup_failed: "فشل إنشاء الحساب",
        verification_failed: "فشل تفعيل الحساب",
        login_required: "برجاء تسجيل الدخول أولاً",
        startup_default: "شركة ناشئة",
        industry_default: "برمجيات",
        company_desc_default: "مشروع شركة ناشئة مبتكر.",
        strategic_analysis: "التحليل الاستراتيجي",
        job_title_default: "مدير عمليات",
        job_desc_default: "مطلوب محترف لإدارة العمليات اليومية كما هو مقترح في التقرير.",
        ai_unavailable: "خدمة الذكاء الاصطناعي غير متاحة",
        remote_default: "عن بعد",
        competitive_salary: "راتب تنافسي",
        apply_now_btn: "قدم الآن",
        no_jobs_available: "لا توجد وظائف متاحة حالياً. كن أول من يوظف!",
        failed_to_load_jobs: "فشل تحميل الوظائف.",
        login_to_apply: "برجاء تسجيل الدخول للتقديم",
        application_failed: "فشل إرسال الطلب",
        note: "رسالة التقديم",
        email: "البريد الإلكتروني",
        accept: "قبول",
        reject: "رفض",
        username: "اسم المتقدم",
        phone: "رقم الهاتف",
        skills: "المهارات",
        assign_btn: "إسناد وإرسال الإيميل"
    }
};

document.getElementById('auth-btn').addEventListener('click', () => {
    if (token) {
        token = null;
        localStorage.removeItem('token');
        document.getElementById('auth-btn').textContent = translations[currentLang].auth_login;
        document.getElementById('nav-dashboard').classList.add('hidden');
        document.getElementById('nav-projects').classList.add('hidden');
        showToast(translations[currentLang].logout_success);
        showSection('auth-section');
    } else {
        showSection('auth-section');
    }
});

function showSection(id) {
    const allSections = document.querySelectorAll('section, main section');
    allSections.forEach(sec => sec.classList.add('hidden'));

    const target = document.getElementById(id);
    if (target) target.classList.remove('hidden');

    if (id === 'dashboard-section') loadDashboard();
    if (id === 'project-management-section') loadMyTasks();
    if (id === 'jobs-section') loadJobs();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Dashboard Logic ---
async function loadDashboard() {
    if (!token) return;
    loadMyCompanies();
    loadMyJobs();
}

async function loadMyCompanies() {
    const list = document.getElementById('dash-companies-list');
    list.innerHTML = '<div class="loader"></div>';
    try {
        const res = await fetch(`${API_URL}/company/my`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        list.innerHTML = '';
        if (data.companies?.length > 0) {
            data.companies.forEach(company => {
                list.innerHTML += `
                    <div class="dash-item">
                        <div class="dash-item-info">
                            <h4>${company.name}</h4>
                            <p>${company.industry}</p>
                        </div>
                        <button onclick="showSection('ai-report-section'); setupAISection(${JSON.stringify(company).replace(/"/g, '&quot;')})" class="primary-btn" style="padding: 0.4rem 0.8rem; font-size: 0.7rem;">Report</button>
                    </div>
                `;
            });
        } else {
            list.innerHTML = `<p>${translations[currentLang].no_companies}</p>`;
        }
    } catch (err) { list.innerHTML = translations[currentLang].server_error; }
}

async function loadMyJobs() {
    const list = document.getElementById('dash-jobs-list');
    list.innerHTML = '<div class="loader"></div>';
    try {
        const res = await fetch(`${API_URL}/job/my`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        list.innerHTML = '';
        if (data.jobs?.length > 0) {
            data.jobs.forEach(job => {
                list.innerHTML += `
                    <div class="dash-item">
                        <div class="dash-item-info">
                            <h4>${job.title}</h4>
                            <p>${job.company?.name || 'Company'}</p>
                        </div>
                        <button onclick="viewApplicants('${job._id}', '${job.title}')" class="primary-btn" style="padding: 0.4rem 0.8rem; font-size: 0.7rem;">Applicants</button>
                    </div>
                `;
            });
        } else {
            list.innerHTML = `<p>${translations[currentLang].no_jobs}</p>`;
        }
    } catch (err) { list.innerHTML = translations[currentLang].server_error; }
}

async function viewApplicants(jobId, jobTitle) {
    const section = document.getElementById('applicants-detail-section');
    const list = document.getElementById('applicants-list');
    const displayTitle = (jobTitle && jobTitle !== 'undefined' && jobTitle !== 'undefined undefined') ? jobTitle : (translations[currentLang].job_title_default || 'Job');
    document.getElementById('dash-job-title-applicants').textContent = `${translations[currentLang].applicants_for} ${displayTitle}`;
    section.classList.remove('hidden');
    list.innerHTML = '<div class="loader"></div>';

    try {
        const res = await fetch(`${API_URL}/Application/job/${jobId}/applications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        list.innerHTML = '';
        if (res.ok && data.data?.length > 0) {
            data.data.forEach(app => {
                const user = app.user || {};
                let name = 'Candidate';
                if (user.firstName && user.lastName && user.firstName !== 'undefined' && user.lastName !== 'undefined') {
                    name = `${user.firstName} ${user.lastName}`;
                } else if (user.username && user.username !== 'undefined' && user.username !== 'undefined undefined') {
                    name = user.username;
                } else {
                    name = translations[currentLang].username;
                }

                list.innerHTML += `
                    <div class="applicant-card">
                        <div class="ai-header">
                            <div>
                                <h4>${name}</h4>
                                <p style="font-size: 0.7rem; color: var(--secondary); margin-top: 2px;">
                                    <i class="fa-solid fa-brain"></i> ${translations[currentLang].skills}: ${user.skills || '-'}
                                </p>
                            </div>
                            <span class="badge" style="background:${app.status === 'accepted' ? 'var(--success)' : (app.status === 'rejected' ? '#ef233c' : 'rgba(255,255,255,0.1)')}; color:white">${app.status}</span>
                        </div>
                        <div class="applicant-details-grid" style="margin-top: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.8rem;">
                            <p><strong><i class="fa-regular fa-envelope"></i></strong> ${user.email || 'N/A'}</p>
                            <p><strong><i class="fa-solid fa-phone"></i></strong> ${user.phone || 'N/A'}</p>
                        </div>
                        <p style="margin-top: 1rem; font-size: 0.85rem; border-top: 1px solid var(--glass-border); padding-top: 0.5rem;">
                            <strong>${translations[currentLang].note}:</strong> ${app.coverLetter || '...'}
                        </p>
                        <div class="applicant-actions ${app.status !== 'pending' ? 'hidden' : ''}">
                            <button onclick="reviewApplication('${app._id}', 'accepted')" class="action-btn accept-btn">${translations[currentLang].accept}</button>
                            <button onclick="reviewApplication('${app._id}', 'rejected')" class="action-btn reject-btn">${translations[currentLang].reject}</button>
                        </div>
                    </div>
                `;
            });
        } else {
            list.innerHTML = `<p>${translations[currentLang].no_applicants}</p>`;
        }
    } catch (err) { list.innerHTML = translations[currentLang].server_error; }
}

async function reviewApplication(appId, decision) {
    try {
        const res = await fetch(`${API_URL}/Application/applications/${appId}/review`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ decision })
        });
        const data = await res.json();
        if (res.ok) {
            showToast(`Application ${decision}!`, 'success');
            loadDashboard();
            document.getElementById('applicants-detail-section').classList.add('hidden');
        } else {
            showToast(data.message || translations[currentLang].server_error, 'error');
        }
    } catch (err) { showToast(translations[currentLang].server_error, 'error'); }
}

// --- Project Management Logic ---
async function loadMyTasks() {
    const tableBody = document.getElementById('task-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem;"><div class="loader"></div></td></tr>';

    try {
        const res = await fetch(`${API_URL}/task`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        tableBody.innerHTML = '';
        if (data.data?.length > 0) {
            data.data.forEach(task => {
                const row = document.createElement('tr');
                row.className = 'fade-in';
                row.style.borderBottom = '1px solid rgba(255,255,255,0.05)';

                // Determine status badge color
                let statusColor = 'rgba(255,255,255,0.1)';
                if (task.status === 'Completed') statusColor = 'var(--success)';
                if (task.status === 'In Progress') statusColor = 'var(--accent)';

                row.innerHTML = `
                    <td style="padding:1rem">
                        <div style="font-weight:600">${task.employeeName}</div>
                        <small style="color:var(--text-gray)">${task.employeeEmail}</small>
                    </td>
                    <td style="padding:1rem">${task.taskName}</td>
                    <td style="padding:1rem">${task.projectName}</td>
                    <td style="padding:1rem"><i class="fa-regular fa-clock"></i> ${task.expectedDuration}</td>
                    <td style="padding:1rem">
                        <select onchange="updateTaskStatus('${task._id}', this.value)" 
                                style="background:rgba(255,255,255,0.05); color:white; border:1px solid var(--glass-border); padding:5px 10px; border-radius:8px; outline:none; cursor:pointer;">
                            <option value="Not Started" ${task.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                            <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </td>
                    <td style="padding:1rem">
                        <span class="badge" style="background:${statusColor}; color:white; border:none; padding: 4px 12px; font-size: 0.75rem;">${task.status}</span>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 3rem; color: var(--text-gray);"><i class="fa-solid fa-clipboard-list" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i> No tasks assigned yet.</td></tr>';
        }
    } catch (err) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--error);">Failed to load tasks. Please try again.</td></tr>';
        showToast('Connection error', 'error');
    }
}

async function updateTaskStatus(taskId, status) {
    try {
        const res = await fetch(`${API_URL}/task/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        if (res.ok) {
            showToast('Task updated successfully', 'success');
            loadMyTasks(); // Refresh to update colors
        } else {
            const error = await res.json();
            showToast(error.message || 'Failed to update', 'error');
        }
    } catch (err) {
        showToast('Server connection failed', 'error');
    }
}

document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Assigning...';

    const taskData = {
        employeeName: document.getElementById('task-emp-name').value,
        employeeEmail: document.getElementById('task-emp-email').value,
        projectName: document.getElementById('task-project').value,
        taskName: document.getElementById('task-name').value,
        expectedDuration: document.getElementById('task-duration').value
    };

    try {
        const res = await fetch(`${API_URL}/task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(taskData)
        });
        if (res.ok) {
            showToast('Task assigned and email sent!');
            e.target.reset();
            loadMyTasks();
        } else {
            const data = await res.json();
            showToast(data.message || 'Failed to assign task', 'error');
        }
    } catch (err) { showToast('Server connection failed', 'error'); }
    finally {
        btn.disabled = false;
        btn.textContent = translations[currentLang].assign_btn;
    }
});

// --- Auth Logic ---
authTabs.forEach(btn => {
    btn.addEventListener('click', () => {
        authTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        authForms.forEach(f => f.classList.remove('active'));
        document.getElementById(btn.getAttribute('data-tab')).classList.add('active');
    });
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            token = data.data?.credentialsToken?.access_token;
            localStorage.setItem('token', token);
            showToast(translations[currentLang].login_success, 'success');
            document.getElementById('auth-btn').textContent = translations[currentLang].auth_logout;
            document.getElementById('nav-dashboard').classList.remove('hidden');
            document.getElementById('nav-projects').classList.remove('hidden');
            showSection('create-company-section');
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (err) { showToast(translations[currentLang].server_error, 'error'); }
});

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userName = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userName, email, password })
        });
        const data = await res.json();

        if (res.ok) {
            showToast(translations[currentLang].account_created, 'success');
            document.getElementById('otp-email').value = email;
            document.getElementById('otp-modal').classList.remove('hidden');
        } else {
            showToast(data.message || translations[currentLang].signup_failed, 'error');
        }
    } catch (err) { showToast(translations[currentLang].server_error, 'error'); }
});

document.getElementById('otp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('otp-email').value;
    const otp = document.getElementById('otp-code').value;

    try {
        const res = await fetch(`${API_URL}/auth/confirmEmail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        if (res.ok) {
            showToast(translations[currentLang].verify_success, 'success');
            document.getElementById('otp-modal').classList.add('hidden');
            authTabs[0].click();
        } else {
            const data = await res.json();
            showToast(data.message || translations[currentLang].verification_failed, 'error');
        }
    } catch (err) { showToast(translations[currentLang].server_error, 'error'); }
});

// --- Company & AI & Jobs Logic ---
document.getElementById('company-industry').addEventListener('change', (e) => {
    const otherGroup = document.getElementById('other-industry-group');
    if (e.target.value === 'Other') {
        otherGroup.classList.remove('hidden');
        document.getElementById('other-industry').required = true;
    } else {
        otherGroup.classList.add('hidden');
        document.getElementById('other-industry').required = false;
    }
});

document.getElementById('company-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!token) return showToast(translations[currentLang].login_required, 'error');

    let industry = document.getElementById('company-industry').value;
    if (industry === 'Other') industry = document.getElementById('other-industry').value;

    const companyData = {
        name: document.getElementById('company-name').value || `${translations[currentLang].startup_default} ${Math.floor(Math.random() * 1000)}`,
        industry: industry || translations[currentLang].industry_default,
        initialCapital: Number(document.getElementById('company-capital').value) || 100000,
        description: document.getElementById('company-desc').value || translations[currentLang].company_desc_default,
        companyEmail: `info@startup${Math.floor(Math.random() * 1000)}.com`
    };

    try {
        const res = await fetch(`${API_URL}/company/Create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(companyData)
        });
        const data = await res.json();
        if (res.ok) {
            showToast(translations[currentLang].company_launch_success, 'success');
            setupAISection(data.company || data);
        } else {
            showToast(data.message || translations[currentLang].server_error, 'error');
        }
    } catch (err) { showToast(translations[currentLang].server_error, 'error'); }
});

function setupAISection(company) {
    showSection('ai-report-section');
    document.getElementById('report-company-name').textContent = company.name;
    document.getElementById('generate-ai-btn').onclick = () => generateAIReport(company._id);
}

async function generateAIReport(companyId) {
    const loader = document.getElementById('ai-loading');
    const content = document.getElementById('ai-content');
    loader.classList.remove('hidden');
    content.classList.add('hidden');

    try {
        const res = await fetch(`${API_URL}/ai/company/${companyId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
            loader.classList.add('hidden');
            content.classList.remove('hidden');
            const reportText = typeof data.aiReport === 'string' ? data.aiReport : (data.aiReport?.rawAnalysis || '');
            content.innerHTML = `<h3>${translations[currentLang].strategic_analysis}</h3><p>${reportText.replace(/\n/g, '<br>')}</p>`;
            showToast(translations[currentLang].analysis_complete, 'success');
            const jobBtn = document.getElementById('show-job-btn');
            jobBtn.classList.remove('hidden');
            jobBtn.onclick = () => {
                showSection('create-job-section');
                document.getElementById('job-company-id').value = companyId;
                document.getElementById('job-title').value = translations[currentLang].job_title_default;
                document.getElementById('job-desc').value = translations[currentLang].job_desc_default;
            };
        } else {
            loader.classList.add('hidden');
            showToast(data.message || translations[currentLang].ai_unavailable, 'error');
        }
    } catch (err) {
        loader.classList.add('hidden');
        showToast(translations[currentLang].connection_error, 'error');
    }
}

document.getElementById('job-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!token) return showToast(translations[currentLang].login_required, 'error');

    const companyId = document.getElementById('job-company-id').value;
    const jobData = {
        title: document.getElementById('job-title').value,
        location: document.getElementById('job-location').value,
        salary: Number(document.getElementById('job-salary').value),
        description: document.getElementById('job-desc').value
    };

    try {
        const res = await fetch(`${API_URL}/job/company/${companyId}/job/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(jobData)
        });
        if (res.ok) {
            showToast(translations[currentLang].job_publish_success, 'success');
            showSection('jobs-section');
        } else {
            const data = await res.json();
            showToast(data.message || translations[currentLang].server_error, 'error');
        }
    } catch (err) { showToast(translations[currentLang].server_error, 'error'); }
});

async function loadJobs() {
    const grid = document.getElementById('jobs-grid');
    grid.innerHTML = '<div class="loader"></div>';
    try {
        const res = await fetch(`${API_URL}/job`);
        const data = await res.json();
        grid.innerHTML = '';
        if (data.jobs?.length > 0) {
            data.jobs.forEach(job => {
                const card = document.createElement('div');
                card.className = 'job-card';
                card.innerHTML = `
                    <div class="job-role">${job.title}</div>
                    <span class="job-company">${job.company?.name || translations[currentLang].startup_default}</span>
                    <div class="job-details">
                        <span><i class="fa-solid fa-location-dot"></i> ${job.location || translations[currentLang].remote_default}</span>
                        <span><i class="fa-solid fa-money-bill"></i> $${job.salary || translations[currentLang].competitive_salary}</span>
                    </div>
                    <button onclick="openApplyModal('${job._id}')" class="primary-btn" style="font-size:0.8rem">${translations[currentLang].apply_now_btn}</button>
                `;
                grid.appendChild(card);
            });
        } else {
            grid.innerHTML = `<p style="text-align:center; grid-column:1/-1">${translations[currentLang].no_jobs_available}</p>`;
        }
    } catch (err) { grid.innerHTML = `<p>${translations[currentLang].failed_to_load_jobs}</p>`; }
}

window.openApplyModal = (jobId) => {
    document.getElementById('apply-job-id').value = jobId;
    document.getElementById('apply-modal').classList.remove('hidden');
};

document.querySelector('.close-modal').onclick = () => {
    document.getElementById('apply-modal').classList.add('hidden');
};

document.getElementById('apply-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!token) return showToast(translations[currentLang].login_to_apply, 'error');

    const jobId = document.getElementById('apply-job-id').value;
    const coverLetter = document.getElementById('apply-note').value;

    try {
        const res = await fetch(`${API_URL}/Application/jobs/${jobId}/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ coverLetter, cv: "https://example.com/cv.pdf" })
        });
        if (res.ok) {
            showToast(translations[currentLang].applied_success, 'success');
            document.getElementById('apply-modal').classList.add('hidden');
        } else {
            const data = await res.json();
            showToast(data.message || translations[currentLang].application_failed, 'error');
        }
    } catch (err) { showToast(translations[currentLang].server_error, 'error'); }
});

// Utilities
function showToast(msg, type = 'success') {
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.position = 'fixed';
    div.style.bottom = '20px';
    div.style.right = '20px';
    div.style.padding = '1rem 2rem';
    div.style.background = type === 'success' ? 'var(--success)' : '#ef233c';
    div.style.color = 'white';
    div.style.borderRadius = '8px';
    div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    div.style.zIndex = '2000';
    div.style.animation = 'fadeIn 0.3s';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// Initial Load
loadJobs();
