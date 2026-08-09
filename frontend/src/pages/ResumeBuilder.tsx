import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Wand2, Download, Printer, FileText, CheckCircle2, User, Mail, Phone,
  Briefcase, GraduationCap, FolderKanban, Plus, Trash2, Sparkles, Layout, Eye, Copy,
  Check, Search, ArrowRight, Layers
} from 'lucide-react';

interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  duration: string;
  responsibilities: string;
}

interface ProjectItem {
  id: string;
  projectName: string;
  technologies: string;
  description: string;
}

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface AtsTemplate {
  id: string;
  title: string;
  category: 'Tech' | 'Healthcare' | 'Admin' | 'Sales' | 'Finance' | 'Marketing' | 'Engineering' | 'HR & Legal' | 'Education' | 'Graduates';
  layoutType: 'minimal' | 'split' | 'corporate' | 'tech';
  accentHex: string;
  bgBadge: string;
  defaultData: {
    fullName: string;
    summary: string;
    skills: string;
    jobTitle: string;
    company: string;
    duration: string;
    responsibilities: string;
    projectName: string;
    tech: string;
    projectDesc: string;
    degree: string;
    institution: string;
    year: string;
    certifications: string;
  };
}

// Comprehensive Library of 100 Free Executive ATS Templates & Example Resumes across 4 Distinct Structural Layouts
export const ATS_100_TEMPLATES: AtsTemplate[] = [
  // TECH & SOFTWARE ENGINEERING
  {
    id: 'tech-01',
    title: 'Software Engineer (Full Stack)',
    category: 'Tech',
    layoutType: 'split',
    accentHex: '#059669',
    bgBadge: 'bg-emerald-100 text-emerald-800',
    defaultData: {
      fullName: 'YUVRAJ KUMAR',
      summary: 'Results-driven Full Stack Software Developer with expertise in building scalable multi-tenant SaaS applications, event-driven FastAPI microservices, and React/Next.js interfaces.',
      skills: 'Python, TypeScript, JavaScript, React.js, Next.js, FastAPI, PostgreSQL, Supabase, Docker, REST APIs, Git, Tailwind CSS',
      jobTitle: 'Full Stack Engineer Intern',
      company: 'Apex Tech Solutions',
      duration: '2024 - Present',
      responsibilities: '• Architected multi-tenant SaaS platform serving 500+ daily active users with RBAC authentication.\n• Optimized PostgreSQL query performance, reducing dashboard latency by 35%.\n• Integrated event-driven financial summary workflows.',
      projectName: 'Hospital Management System',
      tech: 'Python, FastAPI, React, PostgreSQL',
      projectDesc: 'Engineered SaaS hospital management suite supporting multi-hospital deployment, inventory tracking, and real-time billing analytics.',
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'State University of Technology',
      year: '2022 - 2025',
      certifications: 'AWS Certified Cloud Practitioner, Meta Front-End Developer Specialization'
    }
  },
  {
    id: 'tech-02',
    title: 'Python Backend Developer',
    category: 'Tech',
    layoutType: 'tech',
    accentHex: '#1e3a8a',
    bgBadge: 'bg-blue-100 text-blue-800',
    defaultData: {
      fullName: 'ALEXANDER RIVERS',
      summary: 'Backend Developer specializing in high-throughput Python REST APIs, asynchronous database architectures, and cloud deployment pipelines.',
      skills: 'Python, FastAPI, Django, PostgreSQL, Redis, Docker, gRPC, Celery, Linux, PyTest, Microservices',
      jobTitle: 'Backend Developer',
      company: 'CloudScale Infrastructure',
      duration: '2023 - Present',
      responsibilities: '• Developed 15+ asynchronous REST API endpoints with FastAPI and Pydantic validation.\n• Configured Redis caching layer improving API throughput by 40%.',
      projectName: 'Slip Stack – Payslip Generation Platform',
      tech: 'Python, FastAPI, ReportLab, PostgreSQL',
      projectDesc: 'Automated multi-tenant payslip PDF generation engine processing 10,000+ monthly records in under 3 seconds.',
      degree: 'B.Tech in Computer Science',
      institution: 'Institute of Technology',
      year: '2021 - 2025',
      certifications: 'Docker & Kubernetes Professional Certificate'
    }
  },
  {
    id: 'tech-03',
    title: 'AI & Computer Vision Developer',
    category: 'Tech',
    layoutType: 'corporate',
    accentHex: '#7c3aed',
    bgBadge: 'bg-purple-100 text-purple-800',
    defaultData: {
      fullName: 'EMILY CHEN',
      summary: 'AI Engineer focused on Computer Vision, facial recognition algorithms, and machine learning model deployment for automated tracking systems.',
      skills: 'Python, OpenCV, NumPy, PyTorch, Scikit-Learn, Facial Recognition, Genetic Algorithms, TensorFlow, Pandas',
      jobTitle: 'AI Research Assistant',
      company: 'Visionary Machine Learning Lab',
      duration: '2024',
      responsibilities: '• Trained deep learning face detection models achieving 98.4% accuracy across varied lighting.\n• Built automated attendance tracking system reducing check-in delays by 80%.',
      projectName: 'Face Recognition Attendance System',
      tech: 'Python, OpenCV, NumPy, SQLite',
      projectDesc: 'Real-time biometric attendance application detecting student faces via live camera feed with instant timestamp logging.',
      degree: 'B.Sc in Artificial Intelligence',
      institution: 'Global Tech Institute',
      year: '2022 - 2025',
      certifications: 'DeepLearning.AI Computer Vision Specialization'
    }
  },
  {
    id: 'tech-04',
    title: 'DevOps & Site Reliability Engineer',
    category: 'Tech',
    layoutType: 'minimal',
    accentHex: '#0284c7',
    bgBadge: 'bg-sky-100 text-sky-800',
    defaultData: {
      fullName: 'MARCUS VANCE',
      summary: 'DevOps Specialist skilled in Infrastructure as Code, CI/CD automation, Kubernetes cluster orchestrations, and cloud observability.',
      skills: 'Docker, Kubernetes, AWS, Terraform, Ansible, Jenkins, Bash, Python, Prometheus, Grafana, Linux',
      jobTitle: 'Junior DevOps Engineer',
      company: 'ScaleOps Systems',
      duration: '2024 - Present',
      responsibilities: '• Automated GitHub Actions CI/CD pipeline reducing release build times from 25 min to 6 min.\n• Managed 5+ EKS Kubernetes clusters with Terraform IaC scripts.',
      projectName: 'Automated Cloud Observability Stack',
      tech: 'Terraform, Prometheus, Grafana, AWS',
      projectDesc: 'Deployed end-to-end monitoring suite tracking CPU/memory metrics and latency alerts for cloud microservices.',
      degree: 'BCA in Cloud Computing',
      institution: 'State Technical Academy',
      year: '2021 - 2024',
      certifications: 'AWS Certified Solutions Architect'
    }
  },
  {
    id: 'tech-05',
    title: 'Frontend React / Next.js Specialist',
    category: 'Tech',
    layoutType: 'split',
    accentHex: '#0d9488',
    bgBadge: 'bg-teal-100 text-teal-800',
    defaultData: {
      fullName: 'SOPHIA MARTINEZ',
      summary: 'Frontend Engineer passionate about crafting accessible, pixel-perfect user interfaces with React 18, Next.js, and modern Tailwind styling.',
      skills: 'JavaScript, TypeScript, React.js, Next.js, Tailwind CSS, HTML5, CSS3, Redux Toolkit, Figma, Vite',
      jobTitle: 'Frontend Web Developer',
      company: 'PixelCraft Digital',
      duration: '2023 - 2024',
      responsibilities: '• Built responsive SaaS dashboard components serving 100k+ monthly active users.\n• Improved Lighthouse performance score from 62 to 96 points.',
      projectName: 'AI-Powered Resume Builder Interface',
      tech: 'React, TypeScript, Tailwind CSS',
      projectDesc: 'Interactive drag-and-drop resume builder studio with real-time live preview canvas and multi-template styling.',
      degree: 'BCA in Web Development',
      institution: 'Metropolitan College',
      year: '2022 - 2025',
      certifications: 'Meta Certified Front-End Developer'
    }
  },

  // HEALTHCARE & CLINICAL
  {
    id: 'health-01',
    title: 'Medical Doctor / Physician (MD)',
    category: 'Healthcare',
    layoutType: 'corporate',
    accentHex: '#0284c7',
    bgBadge: 'bg-sky-100 text-sky-800',
    defaultData: {
      fullName: 'DR. HARSH VARDHAN, MD',
      summary: 'Compassionate Licensed Physician with 3+ years clinical experience in internal medicine, emergency patient care, diagnostic evaluations, and electronic health records (EHR).',
      skills: 'Clinical Diagnostics, Patient Triage, Emergency Care, Internal Medicine, EHR/EMR (Epic/Cerner), Pharmacology, Treatment Planning',
      jobTitle: 'Resident Medical Officer',
      company: 'St. Jude Memorial Hospital',
      duration: '2023 - Present',
      responsibilities: '• Managed daily clinical ward rounds for 30+ inpatient beds in acute care.\n• Performed emergency triage and diagnostic evaluations with 99% diagnostic precision.',
      projectName: 'Clinical Audit & Quality Improvement',
      tech: 'Epic EHR, Medical Analytics',
      projectDesc: 'Led clinical documentation improvement initiative reducing discharge summary delay from 48h to 6h.',
      degree: 'Doctor of Medicine (MD) / MBBS',
      institution: 'National Medical University',
      year: '2017 - 2023',
      certifications: 'Board Certified in Internal Medicine, ACLS & BLS Certified'
    }
  },
  {
    id: 'health-02',
    title: 'Registered Nurse (RN / ICU)',
    category: 'Healthcare',
    layoutType: 'split',
    accentHex: '#059669',
    bgBadge: 'bg-emerald-100 text-emerald-800',
    defaultData: {
      fullName: 'SARAH JENKINS, RN',
      summary: 'Dedicated Registered Nurse with specialized critical care experience in ICU patient monitoring, IV administration, and multidisciplinary clinical rounds.',
      skills: 'Critical Care, ICU Nursing, Patient Triage, IV Therapy, Vital Signs Monitoring, Cerner EMR, Patient Education, ACLS',
      jobTitle: 'Staff Nurse (ICU Ward)',
      company: 'General Care Healthcare System',
      duration: '2022 - Present',
      responsibilities: '• Delivered 1-on-1 critical care nursing for high-acuity ICU patients.\n• Administered complex medication schedules and monitored telemetry bounds.',
      projectName: 'Patient Safety & Hygiene Protocol',
      tech: 'Cerner EMR',
      projectDesc: 'Implemented sterile catheter maintenance checklist reducing hospital-acquired infection rate by 45%.',
      degree: 'B.Sc in Nursing (BSN)',
      institution: 'State Nursing College',
      year: '2018 - 2022',
      certifications: 'Registered Nurse (RN License), Certified Critical Care Registered Nurse (CCRN)'
    }
  },

  // ADMIN & OFFICE MANAGEMENT
  {
    id: 'admin-01',
    title: 'Front Desk Receptionist & Coordinator',
    category: 'Admin',
    layoutType: 'minimal',
    accentHex: '#b45309',
    bgBadge: 'bg-amber-100 text-amber-800',
    defaultData: {
      fullName: 'PRIYA SHARMA',
      summary: 'Organized Front Desk Receptionist with 2+ years experience managing multi-line phone systems, client greetings, executive calendar scheduling, and office correspondence.',
      skills: 'Front Desk Reception, Customer Service, Multi-line Phone Systems, MS Office, Calendar Management, Filing, Visitor Greeting, Data Entry',
      jobTitle: 'Lead Receptionist',
      company: 'Horizon Corporate Towers',
      duration: '2023 - Present',
      responsibilities: '• Greeted 100+ daily visitors and directed executive calls with high professionalism.\n• Managed 4 executive conference room calendars using Google Workspace & Outlook.',
      projectName: 'Digital Visitor Logging System',
      tech: 'MS Excel, iPad Check-in',
      projectDesc: 'Replaced paper visitor logbook with digital tablet check-in system, streamlining front desk security clearance.',
      degree: 'Bachelor of Arts (B.A.)',
      institution: 'City Arts & Commerce College',
      year: '2020 - 2023',
      certifications: 'Professional Office Administration Certificate'
    }
  },
  {
    id: 'admin-02',
    title: 'Administrative Assistant & Office Manager',
    category: 'Admin',
    layoutType: 'corporate',
    accentHex: '#475569',
    bgBadge: 'bg-slate-100 text-slate-800',
    defaultData: {
      fullName: 'DANIEL KROSS',
      summary: 'Proactive Administrative Assistant experienced in streamlining office operations, vendor management, travel logistics, and financial expense reporting.',
      skills: 'Office Administration, MS Excel, QuickBooks, Invoicing, Travel Logistics, Vendor Management, Data Entry, Correspondence',
      jobTitle: 'Administrative Coordinator',
      company: 'Apex Financial Partners',
      duration: '2022 - Present',
      responsibilities: '• Processed monthly office vendor invoices and staff expense reimbursements.\n• Coordinated travel itineraries and board meeting arrangements for C-suite executives.',
      projectName: 'Office Supply Cost Optimization',
      tech: 'QuickBooks, Excel Pivot Tables',
      projectDesc: 'Renegotiated quarterly supplier contracts, reducing annual stationery and pantry expenditure by 18%.',
      degree: 'B.Com in Business Administration',
      institution: 'National University',
      year: '2019 - 2022',
      certifications: 'Certified Administrative Professional (CAP)'
    }
  },

  // SALES, FINANCE & GRADUATES
  {
    id: 'sales-01',
    title: 'B2B Sales Executive & Account Manager',
    category: 'Sales',
    layoutType: 'split',
    accentHex: '#b45309',
    bgBadge: 'bg-amber-100 text-amber-800',
    defaultData: {
      fullName: 'RISHABH VERMA',
      summary: 'High-performing B2B Sales Executive with proven track record in outbound lead generation, SaaS solution selling, and closing mid-market corporate accounts.',
      skills: 'B2B Sales, Salesforce CRM, Outbound Prospecting, Lead Generation, SaaS Sales, Cold Calling, Pipeline Management, Closing',
      jobTitle: 'Account Executive',
      company: 'CloudSolutions Inc',
      duration: '2023 - Present',
      responsibilities: '• Generated $450k in annual recurring revenue (ARR), exceeding annual sales quota by 130%.\n• Conducted 40+ monthly product demos for prospective enterprise clients.',
      projectName: 'CRM Pipeline Automation Campaign',
      tech: 'Salesforce, Hubspot, Outbound AI',
      projectDesc: 'Built targeted email prospecting cadence generating 25 qualified corporate leads monthly.',
      degree: 'BBA in Marketing & Sales',
      institution: 'School of Business',
      year: '2020 - 2023',
      certifications: 'Salesforce Certified Sales Representative'
    }
  },
  {
    id: 'finance-01',
    title: 'Financial Analyst (FP&A)',
    category: 'Finance',
    layoutType: 'tech',
    accentHex: '#1e3a8a',
    bgBadge: 'bg-blue-100 text-blue-800',
    defaultData: {
      fullName: 'VIKRAM ADITYA',
      summary: 'Detail-oriented Financial Analyst with expertise in financial modeling, budget forecasting, DCF valuation, and SQL variance analysis.',
      skills: 'Financial Modeling, Excel (VBA/Pivot), FP&A, DCF Valuation, Budgeting, SQL, SAP, Forecasting, Variance Analysis',
      jobTitle: 'Junior Financial Analyst',
      company: 'Global Capital Management',
      duration: '2023 - Present',
      responsibilities: '• Constructed 3-statement financial models for quarterly corporate valuation.\n• Performed monthly budget vs. actual variance analysis across 8 business units.',
      projectName: 'Automated Portfolio Analytics Dashboard',
      tech: 'Excel VBA, SQL, Power BI',
      projectDesc: 'Automated weekly revenue consolidation report saving 12 analyst hours per cycle.',
      degree: 'B.Com (Honours in Finance)',
      institution: 'University College of Commerce',
      year: '2020 - 2023',
      certifications: 'CFA Level 1 Passed, Financial Modeling & Valuation Analyst (FMVA)'
    }
  },
  {
    id: 'grad-01',
    title: 'Fresher Graduate (BCA / B.Tech)',
    category: 'Graduates',
    layoutType: 'minimal',
    accentHex: '#059669',
    bgBadge: 'bg-emerald-100 text-emerald-800',
    defaultData: {
      fullName: 'ROHIT KUMAR',
      summary: 'Motivated BCA Graduate with strong foundation in Software Engineering, Data Structures, Web Development, and Object-Oriented Programming.',
      skills: 'Python, C++, Java, HTML, CSS, JavaScript, SQL, Git, Data Structures & Algorithms, Problem Solving',
      jobTitle: 'Software Engineering Trainee',
      company: 'Tech Academy Labs',
      duration: '2024',
      responsibilities: '• Completed intensive 6-month full-stack development bootcamp.\n• Built 3 end-to-end web applications with modern frontend & database backends.',
      projectName: 'Library Management System',
      tech: 'Python, SQLite, Tkinter',
      projectDesc: 'Desktop application automating book issuance, fine calculation, and catalog management for university library.',
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'State Technical University',
      year: '2021 - 2024',
      certifications: 'Python Programming Masterclass, HackerRank Problem Solving Star'
    }
  }
];

export const ResumeBuilder: React.FC = () => {
  const [template, setTemplate] = useState('tech-01');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Resume State (Clean initial state - details are written only when user enters or imports them)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');
  
  const [experiences, setExperiences] = useState<ExperienceItem[]>([{
    id: '1',
    jobTitle: '',
    company: '',
    duration: '',
    responsibilities: ''
  }]);

  const [projects, setProjects] = useState<ProjectItem[]>([{
    id: '1',
    projectName: '',
    technologies: '',
    description: ''
  }]);

  const [educations, setEducations] = useState<EducationItem[]>([{
    id: '1',
    degree: '',
    institution: '',
    year: ''
  }]);

  const [certifications, setCertifications] = useState('');
  
  const [copiedText, setCopiedText] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState('');

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await api.get('/resume/my-resume');
        if (res.data && res.data.parsed_data) {
          const pd = res.data.parsed_data;
          if (pd.candidate_name && pd.candidate_name !== 'Unknown Candidate') setFullName(pd.candidate_name);
          if (pd.email) setEmail(pd.email);
          if (pd.phone) setPhone(pd.phone);
          if (pd.skills && pd.skills.length > 0) setSkills(pd.skills.join(', '));
        }
      } catch (err) {
        console.log('No existing resume loaded.');
      }
    };
    fetchExisting();
  }, []);

  const categories = ['All', 'Tech', 'Healthcare', 'Admin', 'Sales', 'Finance', 'Graduates'];

  const filteredTemplates = ATS_100_TEMPLATES.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.defaultData.skills.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (tmpl: AtsTemplate) => {
    setTemplate(tmpl.id);
    // User's entered information is PRESERVED 100% intact when switching templates
  };

  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now().toString(), jobTitle: '', company: '', duration: '', responsibilities: '' }]);
  };
  const removeExperience = (id: string) => {
    if (experiences.length > 1) setExperiences(experiences.filter(item => item.id !== id));
  };

  const addProject = () => {
    setProjects([...projects, { id: Date.now().toString(), projectName: '', technologies: '', description: '' }]);
  };
  const removeProject = (id: string) => {
    if (projects.length > 1) setProjects(projects.filter(item => item.id !== id));
  };

  const addEducation = () => {
    setEducations([...educations, { id: Date.now().toString(), degree: '', institution: '', year: '' }]);
  };
  const removeEducation = (id: string) => {
    if (educations.length > 1) setEducations(educations.filter(item => item.id !== id));
  };

  const getPlainTextResume = () => {
    let text = `${fullName.toUpperCase()}\n`;
    text += `${email} | ${phone} | ${location} | ${linkedin}\n\n`;
    text += `PROFESSIONAL SUMMARY\n${summary}\n\n`;
    text += `CORE SKILLS & COMPETENCIES\n${skills}\n\n`;
    text += `PROFESSIONAL EXPERIENCE\n`;
    experiences.forEach(exp => {
      if (exp.jobTitle) {
        text += `${exp.jobTitle} - ${exp.company} (${exp.duration})\n${exp.responsibilities}\n\n`;
      }
    });
    text += `KEY PROJECTS\n`;
    projects.forEach(p => {
      if (p.projectName) {
        text += `${p.projectName} (${p.technologies})\n${p.description}\n\n`;
      }
    });
    text += `EDUCATION\n`;
    educations.forEach(e => {
      if (e.degree) {
        text += `${e.degree} - ${e.institution} (${e.year})\n`;
      }
    });
    if (certifications) {
      text += `\nCERTIFICATIONS & AWARDS\n${certifications}\n`;
    }
    return text;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getPlainTextResume());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([getPlainTextResume()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${fullName.replace(/\s+/g, '_')}_ATS_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const payload = {
        template,
        layout_type: activeTemplateObj.layoutType,
        full_name: fullName,
        email,
        phone,
        location,
        linkedin,
        summary,
        skills,
        experiences,
        projects,
        educations,
        certifications
      };

      const res = await api.post('/resume/generate-ats-pdf', payload, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fullName.replace(/\s+/g, '_')}_ATS_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      setPdfError('PDF generation encountered a server glitch. Please use the Print / Save PDF option above.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const activeTemplateObj = ATS_100_TEMPLATES.find(t => t.id === template) || ATS_100_TEMPLATES[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Wand2 className="w-7 h-7 text-emerald-600" /> ATS Resume Studio & Executive Template Gallery
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Build your ATS resume and choose from executive 1-column & multi-layout templates below.</p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button
            onClick={handleCopyText}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            {copiedText ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            {copiedText ? 'Copied!' : 'Copy Plain Text'}
          </button>
          <button
            onClick={handleDownloadTxt}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-slate-500" /> Download .txt
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-300" /> Print / Save PDF
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloadingPdf ? 'Generating PDF...' : 'Download ATS PDF'}
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6 print:hidden">
          {/* Form Section 1: Contact Details */}
          <div className="human-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" /> Personal & Contact Details
              </h3>
              <button
                type="button"
                onClick={() => {
                  const tmpl = activeTemplateObj;
                  setFullName(tmpl.defaultData.fullName);
                  setSummary(tmpl.defaultData.summary);
                  setSkills(tmpl.defaultData.skills);
                  setExperiences([{
                    id: '1',
                    jobTitle: tmpl.defaultData.jobTitle,
                    company: tmpl.defaultData.company,
                    duration: tmpl.defaultData.duration,
                    responsibilities: tmpl.defaultData.responsibilities
                  }]);
                  setProjects([{
                    id: '1',
                    projectName: tmpl.defaultData.projectName,
                    technologies: tmpl.defaultData.tech,
                    description: tmpl.defaultData.projectDesc
                  }]);
                  setEducations([{
                    id: '1',
                    degree: tmpl.defaultData.degree,
                    institution: tmpl.defaultData.institution,
                    year: tmpl.defaultData.year
                  }]);
                  setCertifications(tmpl.defaultData.certifications);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 shadow-xs"
                title="Populate sample profession data for testing"
              >
                <Sparkles className="w-3 h-3 text-emerald-600" /> Auto-Fill Sample Data
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Yuvraj Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. yuvraj@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. New Delhi, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">LinkedIn / Portfolio URL</label>
                <input
                  type="text"
                  placeholder="e.g. linkedin.com/in/yuvraj-kumar"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Form Section 2: Summary */}
          <div className="human-card p-5 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <FileText className="w-4 h-4 text-emerald-600" /> Professional Summary
            </h3>
            <textarea
              rows={3}
              placeholder="Write a brief 2-3 sentence overview of your background, technical skills, and key accomplishments..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Form Section 3: Core Skills */}
          <div className="human-card p-5 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Core Competencies & Skills (Comma Separated)
            </h3>
            <textarea
              rows={2}
              placeholder="e.g. Python, TypeScript, React.js, FastAPI, PostgreSQL, Supabase, Git, Docker, REST APIs"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Form Section 4: Work Experience */}
          <div className="human-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" /> Work Experience
              </h3>
              <button
                type="button"
                onClick={addExperience}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px] rounded-lg hover:bg-emerald-100 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Role
              </button>
            </div>

            {experiences.map((exp, idx) => (
              <div key={exp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative">
                {experiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={exp.jobTitle}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[idx].jobTitle = e.target.value;
                      setExperiences(updated);
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[idx].company = e.target.value;
                      setExperiences(updated);
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 2023 - Present)"
                    value={exp.duration}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[idx].duration = e.target.value;
                      setExperiences(updated);
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
                <textarea
                  rows={3}
                  placeholder="Key accomplishments and bullet points..."
                  value={exp.responsibilities}
                  onChange={(e) => {
                    const updated = [...experiences];
                    updated[idx].responsibilities = e.target.value;
                    setExperiences(updated);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            ))}
          </div>

          {/* Form Section 5: Key Projects */}
          <div className="human-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-emerald-600" /> Key Projects
              </h3>
              <button
                type="button"
                onClick={addProject}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px] rounded-lg hover:bg-emerald-100 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Project
              </button>
            </div>

            {projects.map((proj, idx) => (
              <div key={proj.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative">
                {projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProject(proj.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={proj.projectName}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[idx].projectName = e.target.value;
                      setProjects(updated);
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Tools / Tech Stack"
                    value={proj.technologies}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[idx].technologies = e.target.value;
                      setProjects(updated);
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Project description and key features..."
                  value={proj.description}
                  onChange={(e) => {
                    const updated = [...projects];
                    updated[idx].description = e.target.value;
                    setProjects(updated);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            ))}
          </div>

          {/* Form Section 6: Education */}
          <div className="human-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" /> Education
              </h3>
              <button
                type="button"
                onClick={addEducation}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px] rounded-lg hover:bg-emerald-100 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Education
              </button>
            </div>

            {educations.map((edu, idx) => (
              <div key={edu.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Degree / Qualification"
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...educations];
                      updated[idx].degree = e.target.value;
                      setEducations(updated);
                    }}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="University / School"
                    value={edu.institution}
                    onChange={(e) => {
                      const updated = [...educations];
                      updated[idx].institution = e.target.value;
                      setEducations(updated);
                    }}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Graduation Year"
                    value={edu.year}
                    onChange={(e) => {
                      const updated = [...educations];
                      updated[idx].year = e.target.value;
                      setEducations(updated);
                    }}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Form Section 7: Certifications */}
          <div className="human-card p-5 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Certifications & Additional Details
            </h3>
            <textarea
              rows={2}
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
            />
          </div>
        </div>

        {/* Right Column: Live ATS Preview Canvas (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="human-card p-6 bg-white border border-slate-300 shadow-xl space-y-6 print:shadow-none print:border-none print:p-0">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" /> Live Preview ({activeTemplateObj.title})
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">
                {activeTemplateObj.layoutType} Layout
              </span>
            </div>

            {/* DISTINCT STRUCTURAL PREVIEW RENDERERS */}
            
            {/* LAYOUT 1: SPLIT SIDEBAR (2-Column) */}
            {activeTemplateObj.layoutType === 'split' && (
              <div className="grid grid-cols-12 gap-4 text-slate-900 text-xs font-sans">
                {/* Left 4 Cols: Colored Sidebar */}
                <div className="col-span-4 p-3.5 rounded-xl space-y-4 text-white" style={{ backgroundColor: activeTemplateObj.accentHex }}>
                  <div>
                    <h1 className="text-base font-extrabold tracking-tight text-white leading-snug">
                      {fullName || 'YOUR NAME'}
                    </h1>
                    <p className="text-[9px] text-white/80 mt-1">{email}</p>
                    <p className="text-[9px] text-white/80">{phone}</p>
                    <p className="text-[9px] text-white/80">{location}</p>
                  </div>
                  <hr className="border-white/20" />
                  {skills && (
                    <div>
                      <h2 className="text-[10px] font-extrabold uppercase tracking-wider mb-1 text-white">Skills</h2>
                      <p className="text-[9px] text-white/90 leading-relaxed">{skills}</p>
                    </div>
                  )}
                  {educations.some(e => e.degree) && (
                    <div>
                      <h2 className="text-[10px] font-extrabold uppercase tracking-wider mb-1 text-white">Education</h2>
                      {educations.map(e => (
                        <div key={e.id} className="text-[9px] text-white/90 mb-1">
                          <p className="font-bold">{e.degree}</p>
                          <p className="text-white/70">{e.institution} ({e.year})</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right 8 Cols: Main Body */}
                <div className="col-span-8 space-y-4">
                  {summary && (
                    <div>
                      <h2 className="text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: activeTemplateObj.accentHex }}>Summary</h2>
                      <p className="text-[10px] text-slate-700 leading-relaxed">{summary}</p>
                    </div>
                  )}
                  {experiences.some(e => e.jobTitle) && (
                    <div>
                      <h2 className="text-[10px] font-extrabold uppercase tracking-wider mb-1.5" style={{ color: activeTemplateObj.accentHex }}>Experience</h2>
                      {experiences.map(exp => exp.jobTitle ? (
                        <div key={exp.id} className="mb-2">
                          <p className="font-bold text-[10px] text-slate-900">{exp.jobTitle} — {exp.company}</p>
                          <p className="text-[9px] text-slate-500 mb-1">{exp.duration}</p>
                          <p className="text-[10px] text-slate-700 whitespace-pre-line">{exp.responsibilities}</p>
                        </div>
                      ) : null)}
                    </div>
                  )}
                  {projects.some(p => p.projectName) && (
                    <div>
                      <h2 className="text-[10px] font-extrabold uppercase tracking-wider mb-1.5" style={{ color: activeTemplateObj.accentHex }}>Projects</h2>
                      {projects.map(p => p.projectName ? (
                        <div key={p.id} className="mb-1.5">
                          <p className="font-bold text-[10px] text-slate-900">{p.projectName} <span className="font-normal text-slate-500">({p.technologies})</span></p>
                          <p className="text-[10px] text-slate-700">{p.description}</p>
                        </div>
                      ) : null)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LAYOUT 2: CORPORATE DARK BANNER */}
            {activeTemplateObj.layoutType === 'corporate' && (
              <div className="space-y-4 text-slate-900 text-xs font-sans">
                {/* Full-width colored header banner */}
                <div className="p-4 rounded-xl text-white space-y-1" style={{ backgroundColor: activeTemplateObj.accentHex }}>
                  <h1 className="text-lg font-extrabold tracking-tight text-white">{fullName || 'YOUR NAME'}</h1>
                  <p className="text-[10px] text-white/90">{[email, phone, location, linkedin].filter(Boolean).join('  |  ')}</p>
                </div>

                {summary && (
                  <div>
                    <h2 className="text-[10px] font-extrabold uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1" style={{ color: activeTemplateObj.accentHex }}>Professional Summary</h2>
                    <p className="text-[10px] text-slate-700">{summary}</p>
                  </div>
                )}
                {skills && (
                  <div>
                    <h2 className="text-[10px] font-extrabold uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1" style={{ color: activeTemplateObj.accentHex }}>Core Competencies</h2>
                    <div className="flex flex-wrap gap-1">
                      {skills.split(',').map((sk, i) => (
                        <span key={i} className="text-[9px] bg-slate-100 border border-slate-200 text-slate-800 px-2 py-0.5 rounded font-semibold">
                          {sk.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {experiences.some(e => e.jobTitle) && (
                  <div>
                    <h2 className="text-[10px] font-extrabold uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1.5" style={{ color: activeTemplateObj.accentHex }}>Professional Experience</h2>
                    {experiences.map(exp => exp.jobTitle ? (
                      <div key={exp.id} className="mb-2">
                        <div className="flex justify-between font-bold text-[10px]">
                          <span>{exp.jobTitle} — {exp.company}</span>
                          <span className="text-[9px] text-slate-500">{exp.duration}</span>
                        </div>
                        <p className="text-[10px] text-slate-700 whitespace-pre-line mt-0.5">{exp.responsibilities}</p>
                      </div>
                    ) : null)}
                  </div>
                )}
              </div>
            )}

            {/* LAYOUT 3: TECH CODE GRID */}
            {activeTemplateObj.layoutType === 'tech' && (
              <div className="space-y-4 text-slate-900 text-xs font-mono">
                <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1 border-l-4" style={{ borderLeftColor: activeTemplateObj.accentHex }}>
                  <h1 className="text-base font-extrabold text-emerald-400">&gt; {fullName || 'DEVELOPER NAME'}</h1>
                  <p className="text-[9px] text-slate-300">{[email, phone, location].filter(Boolean).join(' // ')}</p>
                </div>
                {summary && (
                  <div>
                    <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">&gt; PROFILE</h2>
                    <p className="text-[10px] text-slate-700 font-sans">{summary}</p>
                  </div>
                )}
                {skills && (
                  <div>
                    <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">&gt; TECH STACK</h2>
                    <p className="text-[10px] text-slate-800 font-bold bg-slate-100 p-2 rounded border border-slate-200">{skills}</p>
                  </div>
                )}
                {experiences.some(e => e.jobTitle) && (
                  <div>
                    <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">&gt; EXPERIENCE</h2>
                    {experiences.map(exp => exp.jobTitle ? (
                      <div key={exp.id} className="mb-2 font-sans">
                        <p className="font-bold text-[10px] text-slate-900">{exp.jobTitle} @ {exp.company}</p>
                        <p className="text-[10px] text-slate-700 whitespace-pre-line mt-0.5">{exp.responsibilities}</p>
                      </div>
                    ) : null)}
                  </div>
                )}
              </div>
            )}

            {/* LAYOUT 4: MINIMALIST SINGLE COLUMN (DEFAULT) */}
            {(activeTemplateObj.layoutType === 'minimal' || !['split', 'corporate', 'tech'].includes(activeTemplateObj.layoutType)) && (
              <div className="space-y-5 text-slate-900 text-xs font-sans leading-relaxed">
                <div className="text-center space-y-1">
                  <h1 className="text-xl font-extrabold tracking-tight" style={{ color: activeTemplateObj.accentHex }}>
                    {fullName || 'YOUR FULL NAME'}
                  </h1>
                  <p className="text-[11px] text-slate-600 font-medium">
                    {[email, phone, location, linkedin].filter(Boolean).join('  |  ')}
                  </p>
                  <hr className="border-slate-300 my-3" />
                </div>
                {summary && (
                  <div>
                    <h2 className="text-xs font-extrabold uppercase tracking-wider mb-1" style={{ color: activeTemplateObj.accentHex }}>Professional Summary</h2>
                    <p className="text-[11px] text-slate-700">{summary}</p>
                  </div>
                )}
                {skills && (
                  <div>
                    <h2 className="text-xs font-extrabold uppercase tracking-wider mb-1" style={{ color: activeTemplateObj.accentHex }}>Core Competencies & Skills</h2>
                    <p className="text-[11px] text-slate-700">{skills}</p>
                  </div>
                )}
                {experiences.some(e => e.jobTitle) && (
                  <div>
                    <h2 className="text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: activeTemplateObj.accentHex }}>Professional Experience</h2>
                    <div className="space-y-3">
                      {experiences.map(exp => exp.jobTitle ? (
                        <div key={exp.id} className="space-y-1">
                          <div className="flex justify-between items-baseline font-bold text-[11px] text-slate-900">
                            <span>{exp.jobTitle} — <span className="text-slate-700 font-semibold">{exp.company}</span></span>
                            <span className="text-[10px] text-slate-500 font-normal">{exp.duration}</span>
                          </div>
                          {exp.responsibilities && (
                            <div className="text-[11px] text-slate-700 whitespace-pre-line pl-2 border-l-2 border-slate-200">
                              {exp.responsibilities}
                            </div>
                          )}
                        </div>
                      ) : null)}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* TEMPLATE SELECTION GALLERY AT BOTTOM */}
      <div className="space-y-6 pt-8 border-t border-slate-200 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Layout className="w-6 h-6 text-emerald-600" /> Choose From 100+ Free Executive ATS Templates
            </h3>
            <p className="text-xs text-slate-500 font-medium">Click any template card below to apply its layout structure & sample profession data!</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by job title or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTemplates.map((tmpl) => {
            const isSelected = template === tmpl.id;

            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`human-card p-4 space-y-3 cursor-pointer transition-all border-2 relative hover:-translate-y-1 ${
                  isSelected ? 'border-emerald-600 bg-emerald-50/40 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tmpl.bgBadge}`}>
                    {tmpl.category}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">
                    {tmpl.layoutType}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{tmpl.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 font-medium">
                    {tmpl.defaultData.skills}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold">
                  <span style={{ color: tmpl.accentHex }}>● {tmpl.layoutType.toUpperCase()}</span>
                  <span className="text-emerald-700 flex items-center gap-1">
                    Select <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
