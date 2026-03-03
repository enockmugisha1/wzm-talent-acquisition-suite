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