/**
 * Generate AU salary data for common job roles across states.
 * Based on publicly available ABS & Seek data ranges.
 */

import * as fs from 'fs';
import * as path from 'path';

interface SalaryData {
  slug: string;
  title: string;
  category: string;
  description: string;
  averageSalary: number;
  medianSalary: number;
  entryLevel: number;
  midLevel: number;
  seniorLevel: number;
  byState: Record<string, number>;
  growth: string;
  demand: string;
  relatedRoles: string[];
}

const states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

const stateMultipliers: Record<string, number> = {
  NSW: 1.05, VIC: 1.02, QLD: 0.95, WA: 1.08,
  SA: 0.92, TAS: 0.88, ACT: 1.10, NT: 1.03
};

const categories: Record<string, { roles: Array<{ title: string; base: number; growth: string; demand: string; desc: string; related: string[] }> }> = {
  'Technology': {
    roles: [
      { title: 'Software Engineer', base: 110000, growth: '+12%', demand: 'Very High', desc: 'Design, develop, and maintain software applications and systems.', related: ['Full Stack Developer', 'Backend Developer', 'Frontend Developer'] },
      { title: 'Data Scientist', base: 120000, growth: '+15%', demand: 'Very High', desc: 'Analyze complex datasets to drive business decisions using statistical models and ML.', related: ['Data Analyst', 'Machine Learning Engineer', 'Data Engineer'] },
      { title: 'DevOps Engineer', base: 130000, growth: '+14%', demand: 'High', desc: 'Bridge development and operations with CI/CD pipelines and infrastructure automation.', related: ['Site Reliability Engineer', 'Cloud Engineer', 'Platform Engineer'] },
      { title: 'Frontend Developer', base: 95000, growth: '+10%', demand: 'High', desc: 'Build user-facing web applications using modern JavaScript frameworks.', related: ['Software Engineer', 'UX Designer', 'Full Stack Developer'] },
      { title: 'Backend Developer', base: 105000, growth: '+11%', demand: 'High', desc: 'Develop server-side logic, APIs, and database systems.', related: ['Software Engineer', 'Full Stack Developer', 'DevOps Engineer'] },
      { title: 'Full Stack Developer', base: 108000, growth: '+12%', demand: 'Very High', desc: 'Work across the entire web stack from frontend to backend.', related: ['Software Engineer', 'Frontend Developer', 'Backend Developer'] },
      { title: 'Cloud Engineer', base: 135000, growth: '+18%', demand: 'Very High', desc: 'Design and manage cloud infrastructure on AWS, Azure, or GCP.', related: ['DevOps Engineer', 'Solutions Architect', 'Platform Engineer'] },
      { title: 'Cybersecurity Analyst', base: 115000, growth: '+20%', demand: 'Very High', desc: 'Protect systems and networks from cyber threats and vulnerabilities.', related: ['Security Engineer', 'Penetration Tester', 'SOC Analyst'] },
      { title: 'Machine Learning Engineer', base: 140000, growth: '+22%', demand: 'Very High', desc: 'Build and deploy ML models at scale for production systems.', related: ['Data Scientist', 'AI Engineer', 'Data Engineer'] },
      { title: 'Data Engineer', base: 125000, growth: '+16%', demand: 'High', desc: 'Build data pipelines and infrastructure for analytics and ML teams.', related: ['Data Scientist', 'Backend Developer', 'Cloud Engineer'] },
      { title: 'IT Support Specialist', base: 65000, growth: '+5%', demand: 'Medium', desc: 'Provide technical support and troubleshoot hardware/software issues.', related: ['System Administrator', 'Help Desk Technician', 'Network Technician'] },
      { title: 'System Administrator', base: 90000, growth: '+6%', demand: 'Medium', desc: 'Maintain and configure servers, networks, and IT infrastructure.', related: ['DevOps Engineer', 'IT Support Specialist', 'Network Engineer'] },
      { title: 'Solutions Architect', base: 155000, growth: '+13%', demand: 'High', desc: 'Design end-to-end technical solutions aligned with business requirements.', related: ['Cloud Engineer', 'Enterprise Architect', 'Technical Lead'] },
      { title: 'QA Engineer', base: 95000, growth: '+8%', demand: 'Medium', desc: 'Ensure software quality through testing strategies and automation.', related: ['Software Engineer', 'SDET', 'Test Analyst'] },
      { title: 'Product Manager', base: 140000, growth: '+10%', demand: 'High', desc: 'Drive product strategy, roadmap, and cross-functional delivery.', related: ['Business Analyst', 'Project Manager', 'UX Designer'] },
    ]
  },
  'Healthcare': {
    roles: [
      { title: 'Registered Nurse', base: 75000, growth: '+8%', demand: 'Very High', desc: 'Provide patient care in hospitals, clinics, and community settings.', related: ['Enrolled Nurse', 'Nurse Practitioner', 'Midwife'] },
      { title: 'General Practitioner', base: 200000, growth: '+5%', demand: 'High', desc: 'Diagnose and treat a wide range of health conditions in primary care.', related: ['Specialist Doctor', 'Nurse Practitioner', 'Pharmacist'] },
      { title: 'Pharmacist', base: 85000, growth: '+4%', demand: 'Medium', desc: 'Dispense medications and provide pharmaceutical care advice.', related: ['General Practitioner', 'Pharmacy Technician', 'Clinical Pharmacologist'] },
      { title: 'Physiotherapist', base: 80000, growth: '+7%', demand: 'High', desc: 'Treat physical conditions through exercise, manual therapy, and education.', related: ['Occupational Therapist', 'Exercise Physiologist', 'Sports Scientist'] },
      { title: 'Dentist', base: 150000, growth: '+6%', demand: 'Medium', desc: 'Diagnose and treat dental conditions and perform oral surgery.', related: ['Dental Hygienist', 'Orthodontist', 'Oral Surgeon'] },
      { title: 'Psychologist', base: 95000, growth: '+9%', demand: 'High', desc: 'Assess and treat mental health conditions through therapy and counseling.', related: ['Counsellor', 'Psychiatrist', 'Social Worker'] },
      { title: 'Paramedic', base: 78000, growth: '+7%', demand: 'High', desc: 'Provide emergency medical care and transport patients.', related: ['Registered Nurse', 'Emergency Medicine Doctor', 'Flight Paramedic'] },
      { title: 'Medical Laboratory Scientist', base: 82000, growth: '+5%', demand: 'Medium', desc: 'Perform diagnostic tests on blood, tissue, and body fluids.', related: ['Pathologist', 'Biomedical Scientist', 'Research Scientist'] },
    ]
  },
  'Finance': {
    roles: [
      { title: 'Accountant', base: 80000, growth: '+4%', demand: 'Medium', desc: 'Prepare financial statements, tax returns, and business advisory.', related: ['Financial Analyst', 'Bookkeeper', 'Tax Accountant'] },
      { title: 'Financial Analyst', base: 95000, growth: '+6%', demand: 'Medium', desc: 'Analyze financial data and build models to support investment decisions.', related: ['Accountant', 'Investment Analyst', 'Risk Analyst'] },
      { title: 'Financial Planner', base: 90000, growth: '+8%', demand: 'High', desc: 'Provide personal financial advice on investments, insurance, and retirement.', related: ['Wealth Manager', 'Accountant', 'Financial Analyst'] },
      { title: 'Actuary', base: 130000, growth: '+10%', demand: 'High', desc: 'Use mathematics and statistics to assess risk for insurance and finance.', related: ['Risk Analyst', 'Data Scientist', 'Financial Analyst'] },
      { title: 'Investment Banker', base: 150000, growth: '+5%', demand: 'Medium', desc: 'Advise on mergers, acquisitions, and capital raising.', related: ['Financial Analyst', 'Corporate Finance Manager', 'Equity Analyst'] },
      { title: 'Risk Analyst', base: 100000, growth: '+9%', demand: 'High', desc: 'Identify and assess business and financial risks.', related: ['Actuary', 'Compliance Officer', 'Financial Analyst'] },
    ]
  },
  'Engineering': {
    roles: [
      { title: 'Civil Engineer', base: 95000, growth: '+6%', demand: 'High', desc: 'Design and oversee construction of infrastructure projects.', related: ['Structural Engineer', 'Project Engineer', 'Urban Planner'] },
      { title: 'Mechanical Engineer', base: 95000, growth: '+5%', demand: 'Medium', desc: 'Design and develop mechanical systems and manufacturing processes.', related: ['Electrical Engineer', 'Civil Engineer', 'Industrial Engineer'] },
      { title: 'Electrical Engineer', base: 100000, growth: '+7%', demand: 'High', desc: 'Design electrical systems for power, communications, and electronics.', related: ['Mechanical Engineer', 'Electronics Engineer', 'Power Systems Engineer'] },
      { title: 'Mining Engineer', base: 140000, growth: '+8%', demand: 'High', desc: 'Plan and manage mining operations and mineral extraction.', related: ['Geologist', 'Civil Engineer', 'Environmental Engineer'] },
      { title: 'Environmental Engineer', base: 95000, growth: '+9%', demand: 'High', desc: 'Develop solutions to environmental problems including waste and pollution.', related: ['Civil Engineer', 'Environmental Scientist', 'Sustainability Consultant'] },
    ]
  },
  'Education': {
    roles: [
      { title: 'Primary School Teacher', base: 78000, growth: '+4%', demand: 'High', desc: 'Teach children from Kindergarten to Year 6 across all subjects.', related: ['Secondary School Teacher', 'Special Education Teacher', 'Early Childhood Educator'] },
      { title: 'Secondary School Teacher', base: 82000, growth: '+4%', demand: 'High', desc: 'Teach specialist subjects to students in Years 7-12.', related: ['Primary School Teacher', 'University Lecturer', 'Tutor'] },
      { title: 'University Lecturer', base: 110000, growth: '+3%', demand: 'Medium', desc: 'Teach and conduct research at university level.', related: ['Professor', 'Research Fellow', 'Secondary School Teacher'] },
      { title: 'Early Childhood Educator', base: 58000, growth: '+6%', demand: 'High', desc: 'Care for and educate children aged 0-5 in childcare settings.', related: ['Primary School Teacher', 'Childcare Centre Director', 'Nanny'] },
    ]
  },
  'Trades & Construction': {
    roles: [
      { title: 'Electrician', base: 85000, growth: '+7%', demand: 'Very High', desc: 'Install, maintain, and repair electrical wiring and systems.', related: ['Plumber', 'HVAC Technician', 'Electrical Engineer'] },
      { title: 'Plumber', base: 82000, growth: '+6%', demand: 'Very High', desc: 'Install and maintain water, gas, and drainage systems.', related: ['Electrician', 'Gasfitter', 'Civil Engineer'] },
      { title: 'Carpenter', base: 75000, growth: '+5%', demand: 'High', desc: 'Build and repair structures and fittings made from wood and other materials.', related: ['Builder', 'Cabinet Maker', 'Joiner'] },
      { title: 'Builder', base: 95000, growth: '+5%', demand: 'High', desc: 'Manage and oversee residential and commercial building projects.', related: ['Carpenter', 'Project Manager', 'Civil Engineer'] },
      { title: 'Diesel Mechanic', base: 85000, growth: '+6%', demand: 'High', desc: 'Maintain and repair diesel engines in trucks, buses, and heavy equipment.', related: ['Motor Mechanic', 'Heavy Vehicle Technician', 'Mining Mechanic'] },
    ]
  },
  'Legal': {
    roles: [
      { title: 'Solicitor', base: 95000, growth: '+4%', demand: 'Medium', desc: 'Provide legal advice and represent clients in legal matters.', related: ['Barrister', 'Paralegal', 'Legal Counsel'] },
      { title: 'Barrister', base: 160000, growth: '+3%', demand: 'Low', desc: 'Represent clients in court and provide specialist legal opinions.', related: ['Solicitor', 'Judge', 'Legal Counsel'] },
      { title: 'Paralegal', base: 65000, growth: '+5%', demand: 'Medium', desc: 'Support lawyers with legal research, document preparation, and case management.', related: ['Solicitor', 'Legal Secretary', 'Compliance Officer'] },
    ]
  },
  'Marketing & Creative': {
    roles: [
      { title: 'Marketing Manager', base: 110000, growth: '+7%', demand: 'High', desc: 'Develop and execute marketing strategies across channels.', related: ['Digital Marketing Specialist', 'Brand Manager', 'Product Manager'] },
      { title: 'Digital Marketing Specialist', base: 75000, growth: '+10%', demand: 'High', desc: 'Manage SEO, SEM, social media, and email marketing campaigns.', related: ['Marketing Manager', 'Content Writer', 'SEO Specialist'] },
      { title: 'UX Designer', base: 105000, growth: '+12%', demand: 'High', desc: 'Design user experiences for digital products through research and prototyping.', related: ['UI Designer', 'Product Manager', 'Frontend Developer'] },
      { title: 'Graphic Designer', base: 70000, growth: '+3%', demand: 'Medium', desc: 'Create visual content for print and digital media.', related: ['UX Designer', 'Art Director', 'Web Designer'] },
      { title: 'Content Writer', base: 65000, growth: '+5%', demand: 'Medium', desc: 'Create written content for websites, blogs, and marketing materials.', related: ['Copywriter', 'Digital Marketing Specialist', 'Journalist'] },
    ]
  },
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function vary(base: number, pct: number): number {
  return Math.round(base * (1 + (Math.random() * 2 - 1) * pct));
}

const allRoles: SalaryData[] = [];

for (const [catName, cat] of Object.entries(categories)) {
  for (const role of cat.roles) {
    const byState: Record<string, number> = {};
    for (const st of states) {
      byState[st] = Math.round(role.base * stateMultipliers[st] / 1000) * 1000;
    }
    allRoles.push({
      slug: slugify(role.title),
      title: role.title,
      category: catName,
      description: role.desc,
      averageSalary: role.base,
      medianSalary: Math.round(role.base * 0.97 / 1000) * 1000,
      entryLevel: Math.round(role.base * 0.65 / 1000) * 1000,
      midLevel: role.base,
      seniorLevel: Math.round(role.base * 1.4 / 1000) * 1000,
      byState,
      growth: role.growth,
      demand: role.demand,
      relatedRoles: role.related,
    });
  }
}

const outDir = path.join(__dirname, '..', 'src', 'data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'salaries.json'), JSON.stringify(allRoles, null, 2));

const catList = [...new Set(allRoles.map(r => r.category))];
fs.writeFileSync(path.join(outDir, 'categories.json'), JSON.stringify(catList, null, 2));

console.log(`Generated ${allRoles.length} roles across ${catList.length} categories`);
