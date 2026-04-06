export type Language = 'en' | 'zh';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

export const translations: Translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.jobs': 'Jobs',
    'nav.apply': 'Apply',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    
    // Hero
    'hero.title': 'People First, Success Follows',
    'hero.subtitle': 'We provide professional HR outsourcing, management training, labor dispatch, and recruitment services to help businesses grow and people succeed.',
    'hero.browse_jobs': 'Browse Jobs',
    'hero.submit_cv': 'Submit CV',

    // Home - Sections
    'home.employers.title': 'For Employers',
    'home.employers.desc': 'We provide reliable staffing, HR outsourcing, and workforce solutions tailored to your business needs.',
    'home.employers.btn': 'Request Staff',
    
    'home.candidates.title': 'For Candidates',
    'home.candidates.desc': 'Explore job opportunities and submit your CV to start your career journey with us.',
    'home.candidates.btn': 'Browse Jobs',

    'home.services.title': 'Our Services',
    'home.services.training': 'Management Training',
    'home.services.dispatch': 'Labor Dispatch',
    'home.services.outsourcing': 'HR Outsourcing',
    'home.services.recruitment': 'Recruitment & Talent Placement',

    'home.process.title': 'Recruitment Process',
    'home.process.step1': 'Submit Application',
    'home.process.step2': 'Screening',
    'home.process.step3': 'Interview',
    'home.process.step4': 'Job Offer',
    'home.process.step5': 'Deployment',

    'home.testimonials.title': 'What Our Clients Say',

    // About
    'about.title': 'About WZM',
    'about.desc': 'WZM Human Resource Solution Co. Ltd is a professional HR service provider specializing in recruitment, labor dispatch, HR outsourcing, and management training. We deliver people-centered solutions that improve business efficiency and career success.',
    'about.mission': 'Mission',
    'about.vision': 'Vision',
    'about.values': 'Values',
    
    // Services
    'services.title': 'Professional HR Services',
    'services.outsourcing.desc': 'Payroll, employee records, compliance.',
    'services.dispatch.desc': 'Skilled, temporary, contract workers.',
    'services.recruitment.desc': 'Job posting, screening, placement.',
    'services.training.desc': 'Leadership and performance programs.',

    // Jobs
    'jobs.title': 'Open Positions',
    'jobs.apply': 'Apply Now',
    'jobs.closed': 'Applications Closed',
    
    // Apply
    'apply.title': 'Submit Your Application',
    'apply.fullname': 'Full Name',
    'apply.email': 'Email',
    'apply.phone': 'Phone',
    'apply.position': 'Position Applied For',
    'apply.cv': 'Upload CV (PDF/DOCX required)',
    'apply.coverletter': 'Upload Cover Letter (optional)',
    'apply.certificates': 'Upload Certificates (optional)',
    'apply.submit': 'Submit Application',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.name': 'Name',
    'contact.email': 'Email Address',
    'contact.subject': 'Subject',
    'contact.subject_placeholder': 'How can we help?',
    'contact.message': 'Message',
    'contact.message_placeholder': 'Write your message here...',
    'contact.send': 'Send Message',
    'contact.get_in_touch': 'Get in Touch',
    'contact.get_in_touch_desc': "Whether you're looking for HR solutions or seeking new career opportunities, our team is ready to assist you.",
    'contact.location': 'Office Location',
    'contact.location_address': 'WZM Human Resource Solution.,LTD',
    'contact.get_directions': 'Click to get directions',
    'contact.phone': 'Phone',
    'contact.email_label': 'Email',
    'contact.business_hours': 'Business Hours',
    'contact.business_hours_weekdays': 'Monday - Friday: 8:30 AM - 5:30 PM',
    'contact.business_hours_saturday': 'Saturday: 8:30 AM - 12:30 PM',

    // ── Admin Login ─────────────────────────────────────────────────────────────
    'admin.login.title': 'Admin Login',
    'admin.login.desc': 'Enter your credentials to access the dashboard',
    'admin.login.username': 'Username',
    'admin.login.username_ph': 'Enter username',
    'admin.login.password': 'Password',
    'admin.login.password_ph': 'Enter password',
    'admin.login.btn': 'Login',
    'admin.login.loading': 'Logging in...',
    'admin.login.return': 'Return to Website',
    'admin.login.forgot': 'Forgot password?',

    // ── Forgot Password
    'admin.forgot.title': 'Forgot Password',
    'admin.forgot.desc': "Enter your email and we'll send you a reset link",
    'admin.forgot.email': 'Email Address',
    'admin.forgot.email_ph': 'Enter your email',
    'admin.forgot.btn': 'Send Reset Link',
    'admin.forgot.loading': 'Sending...',
    'admin.forgot.sent_title': 'Check your inbox',
    'admin.forgot.sent_desc': "If that email is registered, we've sent a password reset link. It expires in 1 hour.",
    'admin.forgot.back': 'Back to Login',

    // ── Admin Setup ──────────────────────────────────────────────────────────────
    'admin.setup.badge': 'First-time Setup',
    'admin.setup.title': 'Create Super Admin',
    'admin.setup.desc': 'No admin accounts exist yet. Create the company owner account to get started.',
    'admin.setup.username': 'Username',
    'admin.setup.username_ph': 'e.g. Company Owner',
    'admin.setup.email': 'Email Address',
    'admin.setup.password': 'Password',
    'admin.setup.password_ph': 'Minimum 6 characters',
    'admin.setup.confirm': 'Confirm Password',
    'admin.setup.confirm_ph': 'Repeat password',
    'admin.setup.info': 'Super Admin has full control: post/edit/delete jobs, review applicants, download CVs, and manage other admin accounts.',
    'admin.setup.btn': 'Create Super Admin Account',
    'admin.setup.loading': 'Creating account...',
    'admin.setup.super_admin': 'Super Admin',

    // ── Reset Password ───────────────────────────────────────────────────────────
    'admin.reset.title': 'Set Your Password',
    'admin.reset.desc': 'Welcome, {name}. Choose a strong password to activate your account.',
    'admin.reset.invalid_title': 'This link is invalid or has expired',
    'admin.reset.invalid_desc': 'Password setup links expire after 24 hours. Please ask your super admin to resend the invitation.',
    'admin.reset.new_password': 'New Password',
    'admin.reset.confirm': 'Confirm Password',
    'admin.reset.btn': 'Activate My Account',
    'admin.reset.loading': 'Setting password...',
    'admin.reset.success_title': 'Password set successfully!',
    'admin.reset.success_desc': 'Your account is now active. You can log in with your username and new password.',
    'admin.reset.goto_login': 'Go to Login',

    // ── Change Password ──────────────────────────────────────────────────────────
    'admin.change.title': 'Change Password',
    'admin.change.desc': 'You must change your password before continuing',
    'admin.change.new': 'New Password',
    'admin.change.confirm': 'Confirm Password',
    'admin.change.btn': 'Update Password',
    'admin.change.loading': 'Updating...',

    // ── Dashboard – Sidebar ──────────────────────────────────────────────────────
    'admin.portal.name': 'WZM HR Solution',
    'admin.portal.subtitle': 'Admin Portal',
    'admin.tab.overview': 'Overview',
    'admin.tab.jobs': 'Jobs',
    'admin.tab.applications': 'Applications',
    'admin.tab.messages': 'Messages',
    'admin.tab.testimonials': 'Testimonials',
    'admin.tab.admins': 'Admins',

    // ── Dashboard – Overview ─────────────────────────────────────────────────────
    'admin.overview.greeting': 'Good day,',
    'admin.overview.total_jobs': 'Total Jobs',
    'admin.overview.total_applicants': 'Total Applicants',
    'admin.overview.new_apps': 'New Applications',
    'admin.overview.team_admins': 'Team Admins',
    'admin.overview.all_time': 'all time',
    'admin.overview.awaiting': 'awaiting review',
    'admin.overview.total_accounts': 'total accounts',
    'admin.overview.super_only': 'visible to super admin',
    'admin.overview.recent_apps': 'Recent Applications',
    'admin.overview.active_jobs': 'Active Job Listings',
    'admin.overview.no_apps': 'No applications yet',
    'admin.overview.no_jobs': 'No jobs posted yet',
    'admin.view_all': 'View all',
    'admin.manage': 'Manage',

    // ── Dashboard – Jobs ─────────────────────────────────────────────────────────
    'admin.jobs.title': 'Job Listings',
    'admin.jobs.post_new': 'Post New Job',
    'admin.jobs.empty_title': 'No jobs posted yet',
    'admin.jobs.empty_desc': 'Create your first listing to start receiving applications.',
    'admin.jobs.post_first': 'Post First Job',
    'admin.jobs.deadline': 'Deadline:',
    'admin.job.expired': 'Expired',
    'admin.job.open': 'Open',
    'admin.job.closed': 'Closed',

    // ── Dashboard – Applications ─────────────────────────────────────────────────
    'admin.applications.title': 'Applications',
    'admin.applications.empty_title': 'No applications yet',
    'admin.applications.empty_desc': 'Applications will appear here once candidates apply.',
    'admin.download_cv': 'CV',
    'admin.status.new': 'New',
    'admin.status.reviewed': 'Reviewed',
    'admin.status.shortlisted': 'Shortlisted',
    'admin.status.rejected': 'Rejected',

    // ── Dashboard – Admins ───────────────────────────────────────────────────────
    'admin.admins.title': 'Admin Management',
    'admin.admins.all': 'All Administrators',
    'admin.admins.you': 'you',
    'admin.admins.pending': 'Pending setup',
    'admin.admins.active': 'Active',
    'admin.admins.remove': 'Remove admin',
    'admin.admins.cant_remove': 'Cannot remove yourself',
    'admin.admins.add': 'Add New Admin',
    'admin.admins.invite_hint': 'A secure setup link will be emailed to them.',
    'admin.admins.create_btn': 'Create & Send Invite',
    'admin.admins.creating': 'Sending invite…',

    // ── Dashboard – Job Dialog ───────────────────────────────────────────────────
    'admin.dialog.edit_job': 'Edit Job Listing',
    'admin.dialog.new_job': 'Post New Job',
    'admin.dialog.job_title': 'Job Title *',
    'admin.dialog.location': 'Location *',
    'admin.dialog.job_type': 'Job Type *',
    'admin.dialog.status': 'Status',
    'admin.dialog.deadline': 'Application Deadline *',
    'admin.dialog.description': 'Description *',
    'admin.dialog.desc_ph': 'Describe the role, key responsibilities, and requirements…',
    'admin.dialog.cancel': 'Cancel',
    'admin.dialog.save': 'Save Changes',
    'admin.dialog.post': 'Post Job',

    // ── Common Admin ─────────────────────────────────────────────────────────────
    'admin.role.admin': 'Admin',
    'admin.role.super_admin': 'Super Admin',
    'admin.field.username': 'Username',
    'admin.field.email': 'Email Address',
    'admin.field.role': 'Role',
    'admin.field.password': 'Password',
    'admin.field.confirm_password': 'Confirm Password',
    'admin.placeholder.min6': 'Minimum 6 characters',
    'admin.loading': 'Loading dashboard…',
    'admin.new_badge': 'new application',
    'admin.new_badge_plural': 'new applications',
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.about': '关于我们',
    'nav.services': '服务项目',
    'nav.jobs': '最新招聘',
    'nav.apply': '申请职位',
    'nav.contact': '联系我们',
    'nav.admin': '管理员',
    
    // Hero
    'hero.title': '以人为本，共创成功',
    'hero.subtitle': '我们提供专业的人力资源外包、管理培训、劳务派遣和招聘服务，助力企业发展与个人成功。',
    'hero.browse_jobs': '浏览职位',
    'hero.submit_cv': '提交简历',

    // Home - Sections
    'home.employers.title': '企业客户',
    'home.employers.desc': '我们提供量身定制的可靠人员配备、人事外包和劳动力解决方案。',
    'home.employers.btn': '招聘需求',
    
    'home.candidates.title': '求职者',
    'home.candidates.desc': '探索工作机会并提交简历，开启您的职业旅程。',
    'home.candidates.btn': '浏览职位',

    'home.services.title': '我们的服务',
    'home.services.training': '管理培训',
    'home.services.dispatch': '劳务派遣',
    'home.services.outsourcing': '人事外包',
    'home.services.recruitment': '人才招聘与安置',

    'home.process.title': '招聘流程',
    'home.process.step1': '提交申请',
    'home.process.step2': '简历筛选',
    'home.process.step3': '面试',
    'home.process.step4': '录用通知',
    'home.process.step5': '入职',

    'home.testimonials.title': '客户评价',

    // About
    'about.title': '关于威泽姆',
    'about.desc': '威泽姆人力资源解决方案有限公司是一家专业的人力资源服务提供商，专注于招聘、劳务派遣、人事外包和管理培训。我们提供以人为本的解决方案，提高企业效率并促进职业成功。',
    'about.mission': '使命',
    'about.vision': '愿景',
    'about.values': '价值观',
    
    // Services
    'services.title': '专业人力资源服务',
    'services.outsourcing.desc': '薪酬管理、员工档案、合规。',
    'services.dispatch.desc': '技能型、临时、合同工。',
    'services.recruitment.desc': '职位发布、筛选、安置。',
    'services.training.desc': '领导力与绩效计划。',

    // Jobs
    'jobs.title': '开放职位',
    'jobs.apply': '立即申请',
    'jobs.closed': '申请已截止',
    
    // Apply
    'apply.title': '提交申请',
    'apply.fullname': '姓名',
    'apply.email': '邮箱',
    'apply.phone': '电话',
    'apply.position': '申请职位',
    'apply.cv': '上传简历 (需PDF/DOCX格式)',
    'apply.coverletter': '上传求职信 (可选)',
    'apply.certificates': '上传证书 (可选)',
    'apply.submit': '提交申请',
    
    // Contact
    'contact.title': '联系我们',
    'contact.name': '姓名',
    'contact.email': '电子邮箱',
    'contact.subject': '主题',
    'contact.subject_placeholder': '我们能为您提供什么帮助？',
    'contact.message': '留言',
    'contact.message_placeholder': '请在此输入您的留言...',
    'contact.send': '发送消息',
    'contact.get_in_touch': '取得联系',
    'contact.get_in_touch_desc': '无论您是在寻找人力资源解决方案还是寻求新的职业机会，我们的团队都随时准备为您提供帮助。',
    'contact.location': '办公地点',
    'contact.location_address': '威泽姆人力资源解决方案有限公司',
    'contact.get_directions': '点击获取路线',
    'contact.phone': '电话',
    'contact.email_label': '邮箱',
    'contact.business_hours': '营业时间',
    'contact.business_hours_weekdays': '周一至周五：上午 8:30 - 下午 5:30',
    'contact.business_hours_saturday': '周六：上午 8:30 - 中午 12:30',

    // ── Admin Login ─────────────────────────────────────────────────────────────
    'admin.login.title': '管理员登录',
    'admin.login.desc': '请输入凭据以访问控制台',
    'admin.login.username': '用户名',
    'admin.login.username_ph': '请输入用户名',
    'admin.login.password': '密码',
    'admin.login.password_ph': '请输入密码',
    'admin.login.btn': '登录',
    'admin.login.loading': '登录中...',
    'admin.login.return': '返回网站',
    'admin.login.forgot': '忘记密码？',

    // ── Forgot Password
    'admin.forgot.title': '忘记密码',
    'admin.forgot.desc': '输入您的邮箱，我们将发送重置链接',
    'admin.forgot.email': '邮箱地址',
    'admin.forgot.email_ph': '请输入邮箱',
    'admin.forgot.btn': '发送重置链接',
    'admin.forgot.loading': '发送中...',
    'admin.forgot.sent_title': '请查收邮件',
    'admin.forgot.sent_desc': '如果该邮箱已注册，我们已发送密码重置链接，有效期1小时。',
    'admin.forgot.back': '返回登录',

    // ── Admin Setup ──────────────────────────────────────────────────────────────
    'admin.setup.badge': '首次设置',
    'admin.setup.title': '创建超级管理员',
    'admin.setup.desc': '暂无管理员账户。请创建公司负责人账户以开始使用。',
    'admin.setup.username': '用户名',
    'admin.setup.username_ph': '例如：公司负责人',
    'admin.setup.email': '电子邮箱',
    'admin.setup.password': '密码',
    'admin.setup.password_ph': '至少6个字符',
    'admin.setup.confirm': '确认密码',
    'admin.setup.confirm_ph': '重复密码',
    'admin.setup.info': '超级管理员拥有全部权限：发布/编辑/删除职位、审核申请人、下载简历及管理其他管理员账户。',
    'admin.setup.btn': '创建超级管理员账户',
    'admin.setup.loading': '创建中...',
    'admin.setup.super_admin': '超级管理员',

    // ── Reset Password ───────────────────────────────────────────────────────────
    'admin.reset.title': '设置密码',
    'admin.reset.desc': '欢迎，{name}。请设置强密码以激活您的账户。',
    'admin.reset.invalid_title': '此链接无效或已过期',
    'admin.reset.invalid_desc': '密码设置链接24小时后过期。请联系超级管理员重新发送邀请。',
    'admin.reset.new_password': '新密码',
    'admin.reset.confirm': '确认密码',
    'admin.reset.btn': '激活我的账户',
    'admin.reset.loading': '设置中...',
    'admin.reset.success_title': '密码设置成功！',
    'admin.reset.success_desc': '您的账户已激活。可使用用户名和新密码登录。',
    'admin.reset.goto_login': '前往登录',

    // ── Change Password ──────────────────────────────────────────────────────────
    'admin.change.title': '修改密码',
    'admin.change.desc': '请先修改密码后再继续',
    'admin.change.new': '新密码',
    'admin.change.confirm': '确认密码',
    'admin.change.btn': '更新密码',
    'admin.change.loading': '更新中...',

    // ── Dashboard – Sidebar ──────────────────────────────────────────────────────
    'admin.portal.name': '威泽姆人力资源',
    'admin.portal.subtitle': '管理控制台',
    'admin.tab.overview': '概览',
    'admin.tab.jobs': '职位管理',
    'admin.tab.applications': '申请管理',
    'admin.tab.messages': '留言消息',
    'admin.tab.testimonials': '客户评价',
    'admin.tab.admins': '管理员',

    // ── Dashboard – Overview ─────────────────────────────────────────────────────
    'admin.overview.greeting': '你好，',
    'admin.overview.total_jobs': '职位总数',
    'admin.overview.total_applicants': '申请人总数',
    'admin.overview.new_apps': '新申请',
    'admin.overview.team_admins': '管理团队',
    'admin.overview.all_time': '累计',
    'admin.overview.awaiting': '待审核',
    'admin.overview.total_accounts': '账户总数',
    'admin.overview.super_only': '超级管理员可见',
    'admin.overview.recent_apps': '最新申请',
    'admin.overview.active_jobs': '在招职位',
    'admin.overview.no_apps': '暂无申请',
    'admin.overview.no_jobs': '暂无职位',
    'admin.view_all': '查看全部',
    'admin.manage': '管理',

    // ── Dashboard – Jobs ─────────────────────────────────────────────────────────
    'admin.jobs.title': '职位列表',
    'admin.jobs.post_new': '发布新职位',
    'admin.jobs.empty_title': '暂无职位',
    'admin.jobs.empty_desc': '创建第一个职位开始接收申请。',
    'admin.jobs.post_first': '发布第一个职位',
    'admin.jobs.deadline': '截止日期：',
    'admin.job.expired': '已截止',
    'admin.job.open': '招聘中',
    'admin.job.closed': '已关闭',

    // ── Dashboard – Applications ─────────────────────────────────────────────────
    'admin.applications.title': '申请记录',
    'admin.applications.empty_title': '暂无申请',
    'admin.applications.empty_desc': '候选人提交申请后将在此处显示。',
    'admin.download_cv': '简历',
    'admin.status.new': '新申请',
    'admin.status.reviewed': '已查看',
    'admin.status.shortlisted': '已入围',
    'admin.status.rejected': '已拒绝',

    // ── Dashboard – Admins ───────────────────────────────────────────────────────
    'admin.admins.title': '管理员管理',
    'admin.admins.all': '所有管理员',
    'admin.admins.you': '你',
    'admin.admins.pending': '待设置',
    'admin.admins.active': '已激活',
    'admin.admins.remove': '移除管理员',
    'admin.admins.cant_remove': '不能移除自己',
    'admin.admins.add': '添加新管理员',
    'admin.admins.invite_hint': '将向其发送安全的密码设置链接。',
    'admin.admins.create_btn': '创建并发送邀请',
    'admin.admins.creating': '发送中…',

    // ── Dashboard – Job Dialog ───────────────────────────────────────────────────
    'admin.dialog.edit_job': '编辑职位',
    'admin.dialog.new_job': '发布新职位',
    'admin.dialog.job_title': '职位名称 *',
    'admin.dialog.location': '工作地点 *',
    'admin.dialog.job_type': '工作类型 *',
    'admin.dialog.status': '状态',
    'admin.dialog.deadline': '申请截止日期 *',
    'admin.dialog.description': '职位描述 *',
    'admin.dialog.desc_ph': '请描述职位要求、主要职责及任职条件…',
    'admin.dialog.cancel': '取消',
    'admin.dialog.save': '保存更改',
    'admin.dialog.post': '发布职位',

    // ── Common Admin ─────────────────────────────────────────────────────────────
    'admin.role.admin': '管理员',
    'admin.role.super_admin': '超级管理员',
    'admin.field.username': '用户名',
    'admin.field.email': '电子邮箱',
    'admin.field.role': '角色',
    'admin.field.password': '密码',
    'admin.field.confirm_password': '确认密码',
    'admin.placeholder.min6': '至少6个字符',
    'admin.loading': '加载中…',
    'admin.new_badge': '条新申请',
    'admin.new_badge_plural': '条新申请',
  }
};

import { create } from 'zustand';

interface I18nStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const useI18n = create<I18nStore>((set, get) => ({
  language: 'en',
  setLanguage: (lang: Language) => set({ language: lang }),
  t: (key: string) => {
    const lang = get().language;
    return translations[lang][key] || key;
  },
}));