export const VALIDATION_CONFIG = {
  // Confidence thresholds for different field types
  nameConfidenceThreshold: 0.8,
  emailConfidenceThreshold: 0.9,
  phoneConfidenceThreshold: 0.85,
  experienceConfidenceThreshold: 0.7,
  skillsConfidenceThreshold: 0.6,
  overallConfidenceThreshold: 0.7,

  // Experience validation rules
  experienceTolerance: 0.5, // ±0.5 years tolerance
  fresherExperienceThreshold: 0.1, // Consider 0-0.1 years as fresher

  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['application/pdf'],
  messages: {
    nameMismatch: 'Name in form does not match CV',
    emailMismatch: 'Email in form does not match CV',
    phoneMismatch: 'Phone number in form does not match CV',
    experienceMismatch: 'Years of experience in form does not match CV',
    skillsMismatch: 'Skills in form do not match CV',
    pdfProcessingError: 'Error processing PDF file',
    validationSuccess: 'CV validation completed successfully',
    validationFailed: 'CV validation failed - mismatches found'
  },

  // AI prompt configuration
  aiConfig: {
    temperature: 0.1, // Low temperature for consistent results
    maxTokens: 2000,
    model: 'gpt-4' as const
  },

  // Field mapping for semantic matching
  fieldMappings: {
    name: ['name', 'full name', 'fullname', 'candidate name'],
    email: ['email', 'e-mail', 'email address'],
    phone: ['phone', 'phone number', 'mobile', 'contact number', 'telephone'],
    experience: ['experience', 'years of experience', 'work experience', 'professional experience'],
    skills: ['skills', 'technical skills', 'programming languages', 'technologies']
  }
} as const;

export const EXPERIENCE_VARIATIONS = [
  'fresher',
  'fresh graduate',
  'new graduate',
  'entry level',
  'junior',
  '0 years',
  '0.0 years',
  'no experience'
];

export const SKILL_VARIATIONS: Record<string, string[]> = {
  'react': ['reactjs', 'react.js', 'react js', 'reactjs'],
  'javascript': ['js', 'ecmascript', 'es6'],
  'typescript': ['ts', 'typescript'],
  'node.js': ['nodejs', 'node', 'node.js'],
  'python': ['py', 'python3', 'python 3'],
  'java': ['java 8', 'java 11', 'java 17'],
  'sql': ['mysql', 'postgresql', 'postgres', 'database'],
  'aws': ['amazon web services', 'amazon aws'],
  'docker': ['containerization', 'containers'],
  'kubernetes': ['k8s', 'kube', 'container orchestration']
};

export const VALIDATION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const;

export type ValidationStatus = typeof VALIDATION_STATUS[keyof typeof VALIDATION_STATUS]; 