export type FieldType =
  | 'text' | 'email' | 'phone' | 'number' | 'textarea'
  | 'select' | 'multiselect' | 'checkbox' | 'date' | 'file' | 'url';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

export const SUMMER26_PROGRAM_COPY = {
  title: "GCL Summer '26 Program",
  dates: 'July 20 – August 20, 2026',
  intro: [
    "This summer, step into a role that goes beyond a typical internship. As a member of the GCL Summer '26 Team, you'll teach financial literacy to youth in communities that have never had access to it — breaking down the psychology of money, the systems behind scarcity, and the mindset shifts that create lasting change.",
    "This isn't about reciting budgeting tips. It's about empowering the next generation to understand why they make the financial decisions they do, and giving them the tools to rewrite that story.",
    "Over one month, you'll run workshops, build curriculum, and become part of a global network of changemakers spanning 14+ countries. You'll walk away having taught, mentored, and genuinely changed how young people see money — and grown just as much yourself in the process.",
    "If you're ready to teach, inspire, and leave a mark — apply below.",
  ],
};

export const SUMMER26_FORM_SCHEMA: FormSection[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    fields: [
      { id: 'fullName', label: 'Full Name', type: 'text', required: true },
      { id: 'email', label: 'Email Address', type: 'email', required: true },
      { id: 'phone', label: 'Phone Number', type: 'phone', required: true },
      { id: 'country', label: 'Country of Residence', type: 'select', required: true, options: [
        'United States', 'United Kingdom', 'Canada', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan',
        'Nigeria', 'Kenya', 'Ghana', 'India', 'Pakistan', 'Philippines', 'Indonesia', 'Brazil', 'Mexico', 'Other',
      ] },
      { id: 'age', label: 'Age', type: 'number', required: true },
      { id: 'education', label: 'Current Education Level', type: 'select', required: true, options: ['High School', 'Undergraduate', 'Graduate', 'Other'] },
      { id: 'teachingLanguage', label: 'Preferred Language for Teaching', type: 'text', required: true, placeholder: 'e.g. English, Russian, Uzbek' },
    ],
  },
  {
    id: 'motivation',
    title: 'Motivation',
    fields: [
      { id: 'whyJoin', label: 'Why do you want to join GCL as a financial literacy educator this summer?', type: 'textarea', required: true, helpText: '150–300 words' },
      { id: 'empowermentMeaning', label: 'What does "financial empowerment" mean to you?', type: 'textarea', required: true, helpText: '100–200 words' },
      { id: 'mindsetShift', label: "Describe a moment when you saw someone's mindset about money shift.", type: 'textarea', required: false },
    ],
  },
  {
    id: 'skills',
    title: 'Skills & Experience',
    fields: [
      { id: 'teachingExperience', label: 'Do you have any teaching, mentoring, or public speaking experience?', type: 'textarea', required: true },
      { id: 'financeBackground', label: 'Do you have any background in finance, economics, or psychology?', type: 'textarea', required: false },
      { id: 'relevantSkills', label: 'Relevant Skills', type: 'multiselect', required: false, options: [
        'Teaching', 'Curriculum Design', 'Public Speaking', 'Content Creation', 'Video/Photography',
        'Web Development', 'Translation', 'Community Organizing', 'Other',
      ] },
      { id: 'youthOrgExperience', label: 'Have you worked with youth or community organizations before? (If yes, briefly explain.)', type: 'textarea', required: false },
    ],
  },
  {
    id: 'availability',
    title: 'Availability & Commitment',
    fields: [
      { id: 'confirmAvailability', label: 'I confirm I am available July 20 – August 20, 2026.', type: 'checkbox', required: true },
      { id: 'hoursPerWeek', label: 'Estimated hours per week you can commit', type: 'select', required: true, options: ['10–15', '15–20', '20+'] },
      { id: 'travelSupport', label: 'Will you need travel support, or is this a remote/local commitment?', type: 'select', required: true, options: ['Remote', 'Local (no travel needed)', 'Need travel support'] },
      { id: 'unavailableDates', label: 'Any dates within the program window you are unavailable?', type: 'text', required: false },
    ],
  },
  {
    id: 'materials',
    title: 'Supporting Materials',
    fields: [
      { id: 'resume', label: 'Resume / CV Upload', type: 'file', required: false },
      { id: 'portfolioLinks', label: 'Portfolio / Relevant Work Links', type: 'text', required: false, placeholder: 'Videos, websites, writing samples — separate with commas' },
      { id: 'anythingElse', label: "Anything else you'd like us to know?", type: 'textarea', required: false },
    ],
  },
  {
    id: 'legal',
    title: 'Legal & Consent',
    fields: [
      { id: 'confirmAccurate', label: 'I confirm the information provided is accurate and complete.', type: 'checkbox', required: true },
      { id: 'agreeTerms', label: 'I have read and agree to the GCL Code of Conduct and Program Terms & Conditions.', type: 'checkbox', required: true, helpText: 'Read the Terms & Conditions' },
      { id: 'mediaConsent', label: 'I consent to GCL using my name, photo, and video from program activities for promotional purposes.', type: 'checkbox', required: true },
      { id: 'guardianConsent', label: 'Parent/Guardian consent (required if under 18)', type: 'checkbox', required: false },
      { id: 'guardianName', label: 'Parent/Guardian Name', type: 'text', required: false },
      { id: 'guardianEmail', label: 'Parent/Guardian Email', type: 'email', required: false },
      { id: 'signature', label: 'Electronic Signature (type your full legal name)', type: 'text', required: true },
    ],
  },
];
