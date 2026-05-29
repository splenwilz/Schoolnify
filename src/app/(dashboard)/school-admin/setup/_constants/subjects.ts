/**
 * Subject metadata for the Subjects Offered setup section.
 *
 * COMMON_SUBJECTS — master list of every subject the admin can pick.
 * SUBJECT_DEPT_MAP — auto-grouping lookup (subject → department value).
 * SUBJECT_PRESETS — curated bundles tagged by grade level structures they fit.
 *
 * Everything subject-related lives here so COMMON_SUBJECTS stays in sync with
 * SUBJECT_DEPT_MAP without cross-file edits.
 */

// ---------------------------------------------------------------------------
// Master subject list — covers major global curricula and regional variants:
// Cambridge IGCSE/A-Level, IB (PYP/MYP/DP), US K-12, UK GCSE, CBSE/ICSE (India),
// WAEC/NECO/NBC (West Africa), KCSE (Kenya), NSC (South Africa), MATRIC,
// CSEC (Caribbean), Australian ACARA, Canadian, Chinese Gaokao, Philippine K-12,
// Indonesian, GCC/MENA Islamic, French.
// ---------------------------------------------------------------------------

export const COMMON_SUBJECTS = [
  // ----- Mathematics -----
  "Mathematics", "Additional Mathematics", "Further Mathematics",
  "Algebra", "Geometry", "Trigonometry", "Calculus", "Pre-Calculus",
  "Statistics", "Discrete Mathematics", "Pure Mathematics", "Applied Mathematics",
  "International Mathematics", "Mechanics", "Decision Mathematics", "Further Pure Mathematics",
  "Numerical Analysis",

  // ----- Sciences -----
  "Science", "Combined Science", "General Science", "Integrated Science",
  "Biology", "Chemistry", "Physics", "Environmental Science", "Environmental Management",
  "Earth Science", "Astronomy", "Astrophysics", "Geology", "Meteorology", "Oceanography",
  "Marine Biology", "Zoology", "Botany", "Microbiology", "Biochemistry", "Biotechnology",
  "Forensic Science", "Agricultural Science", "Health Science", "Human Biology",
  "Life Sciences", "Physical Science", "Natural Sciences",

  // ----- Languages: English & Classical -----
  "English Language", "English Literature", "Literature in English",
  "First Language English", "Second Language English", "English as a Second Language (ESL)",
  "Reading", "Penmanship",
  "Latin", "Ancient Greek", "Classical Studies", "Linguistics",

  // ----- Languages: European -----
  "French", "Spanish", "German", "Italian", "Portuguese", "Russian",
  "Dutch", "Swedish", "Norwegian", "Danish", "Finnish",
  "Polish", "Czech", "Hungarian", "Romanian", "Modern Greek",
  "Welsh", "Irish (Gaeilge)", "Scottish Gaelic", "Catalan",

  // ----- Languages: Asian -----
  "Mandarin", "Cantonese", "Japanese", "Korean",
  "Bahasa Malaysia", "Bahasa Indonesia", "Filipino", "Tagalog",
  "Vietnamese", "Thai", "Khmer", "Lao", "Burmese",
  "Hindi", "Tamil", "Bengali", "Urdu", "Marathi", "Gujarati", "Punjabi", "Telugu", "Malayalam",
  "Kannada", "Odia", "Assamese", "Sanskrit", "Nepali", "Sinhala", "Dhivehi",

  // ----- Languages: Middle Eastern -----
  "Arabic", "Hebrew", "Turkish", "Persian (Farsi)", "Pashto", "Dari", "Kurdish",

  // ----- Languages: African -----
  "Swahili", "Kiswahili", "Yoruba", "Igbo", "Hausa",
  "Zulu", "Xhosa", "Afrikaans", "Amharic", "Tigrinya", "Oromo", "Somali",
  "Setswana", "Sesotho", "Shona", "Ndebele", "Luganda",
  "Akan", "Ewe", "Fante", "Twi", "Wolof",

  // ----- Languages: Indigenous & Sign -----
  "Indigenous Languages", "Inuktitut", "Maori", "Aboriginal Languages",
  "Sign Language", "Braille",

  // ----- Humanities & Social Sciences -----
  "History", "World History", "US History", "European History", "African History", "Asian History",
  "Ancient History", "Modern History", "Caribbean History", "Canadian History",
  "Australian History", "Chinese History", "Latin American History",
  "Geography", "Human Geography", "Physical Geography",
  "Social Studies", "Civic Education", "Citizenship", "Government", "Politics",
  "Economics", "Sociology", "Psychology", "Anthropology", "Philosophy", "Ethics",
  "Global Perspectives", "Theory of Knowledge",
  "Law", "Legal Studies", "Criminology",
  "Indigenous Studies", "Aboriginal Studies", "First Nations Studies",
  "Peace Studies", "Gender Studies", "Cultural Studies",
  "Ideology and Politics", "Moral and Law",

  // ----- Religious Education (all major faiths) -----
  "Religious Studies", "Religious Education", "Comparative Religion", "Theology",
  "Bible Studies", "Bible Knowledge", "Christian Religious Knowledge", "Christian Religious Studies",
  "Islamic Studies", "Islamic Religious Knowledge", "Islamic Education",
  "Quranic Studies", "Hadith", "Fiqh", "Tajweed", "Tawhid", "Seerah",
  "Hindu Studies", "Hindu Religious Education",
  "Buddhist Studies", "Buddhism",
  "Sikh Studies", "Jewish Studies", "Judaic Studies",
  "Traditional African Religion", "Moral Instruction", "Moral Science", "Value Education",
  "Pancasila", "Agama (Religion)",
  "Araling Panlipunan", "Edukasyon sa Pagpapakatao",

  // ----- Commercial / Business -----
  "Commerce", "Business Studies", "Accounting", "Financial Studies",
  "Economics (Commercial)", "Marketing", "Entrepreneurship", "Entrepreneurship Education",
  "Finance", "Personal Finance", "Financial Literacy", "Management", "Office Practice",
  "Introduction to Business", "Office Administration", "Project Management",
  "Human Resources", "Supply Chain Management",
  "Principles of Business", "Principles of Accounts",
  "Book Keeping", "Store Keeping", "Salesmanship",

  // ----- Arts & Design -----
  "Art", "Fine Art", "Visual Arts", "Art and Design", "Ceramics", "Sculpture",
  "Pottery", "Printmaking", "Batik", "Calligraphy", "Chinese Calligraphy",
  "Photography", "Graphic Design", "Illustration",
  "Music", "Choir", "Band", "Orchestra", "Music Theory", "Music Technology",
  "Drama", "Theatre", "Theatre Studies", "Performing Arts", "Dance", "Traditional Dance", "Folk Dance",
  "Film Studies", "Film Production", "Animation",
  "Media Studies", "Creative Writing",
  "Handicrafts", "Needlework", "Embroidery",

  // ----- Technology & Computing -----
  "Computer Science", "Computing", "ICT", "Information Technology",
  "Programming", "Software Development", "Web Development",
  "Python Programming", "Java Programming",
  "Data Science", "Artificial Intelligence", "Machine Learning",
  "Database Management", "Networking", "Cybersecurity",
  "Game Development", "UX Design", "3D Printing",
  "Robotics", "Engineering", "Electronics",
  "Design & Technology", "Product Design", "Technical Drawing", "CAD",
  "Food Technology", "Food Science", "Textiles", "Fashion Design",
  "Digital Media", "Digital Citizenship", "Media Literacy",
  "GSM Maintenance", "Data Processing", "Keyboarding", "Typewriting",

  // ----- Physical Education, Health & Safety -----
  "Physical Education", "Sports Science", "Sports Studies",
  "Health", "Health Education", "Nutrition", "Healthy Living",
  "Swimming", "First Aid", "Road Safety", "Safety Education",
  "MAPEH",

  // ----- Vocational / Practical / Trade -----
  "Home Economics", "Family & Consumer Science", "Home Management",
  "Prevocational Studies", "Work Education", "SUPW",
  "Woodwork", "Metalwork", "Carpentry",
  "Hospitality", "Tourism", "Culinary Arts", "Catering Craft Practice", "Hotel Management",
  "Cosmetology", "Fashion", "Tailoring", "Garment Making",
  "Auto Mechanics", "Automotive Technology",
  "Block-laying and Concreting", "Bricklaying",
  "Painting and Decorating",
  "Plumbing and Pipe-fitting", "Electrical Installation", "Welding",
  "Refrigeration and Air Conditioning",
  "Animal Husbandry", "Fishery", "Horticulture",
  "Leather Works",

  // ----- Early Years / Pre-primary (Nursery, Reception, KG, PYP) -----
  "Numeracy", "Number Work", "Early Math", "Pre-Math",
  "Literacy", "Phonics", "Pre-Reading", "Pre-Writing", "Handwriting", "Oral English",
  "Rhymes", "Storytelling", "Songs and Rhymes",
  "Colour and Shape", "Sensory Play", "Dramatic Play", "Block Play", "Construction Play",
  "Circle Time", "Show and Tell",
  "Practical Life", "Fine Motor Skills", "Gross Motor Skills",
  "Nature Studies", "Music and Movement",
  "Art and Craft", "Finger Painting", "General Knowledge",

  // ----- Nigerian / West African Primary & Secondary -----
  "Verbal Reasoning", "Quantitative Reasoning",
  "Basic Science", "Basic Technology",
  "Cultural and Creative Arts", "Creative Arts",
  "Health Habits", "Personal Hygiene", "Social Habits",
  "Environmental Studies", "Civic Studies",
  "Computer Studies", "Basic Computer",

  // ----- Kenyan / East African -----
  "Life Skills", "Life Orientation",
  "Mathematical Literacy",

  // ----- Indian Curriculum Specific -----
  "EVS (Environmental Studies)",

  // ----- Study / Life Skills / Guidance -----
  "Study Skills", "Critical Thinking", "Public Speaking", "Debate",
  "Research Methods", "Career Planning", "Guidance and Counselling",
  "Functional Skills", "Independent Living", "Communication Skills",

  // ----- IB MYP subject groups & misc regional aliases -----
  "Language Acquisition", "Sciences", "Individuals and Societies", "Arts",
  "Computer Applications Technology", "Technology and Livelihood Education",
];

// ---------------------------------------------------------------------------
// Department lookup — maps subject name → department value in SUBJECT_DEPARTMENTS
// ---------------------------------------------------------------------------

export const SUBJECT_DEPT_MAP: Record<string, string> = {
  // ----- Mathematics -----
  "Mathematics": "science", "Additional Mathematics": "science", "Further Mathematics": "science",
  "Algebra": "science", "Geometry": "science", "Trigonometry": "science",
  "Calculus": "science", "Pre-Calculus": "science",
  "Statistics": "science", "Discrete Mathematics": "science",
  "Pure Mathematics": "science", "Applied Mathematics": "science", "International Mathematics": "science",
  "Mechanics": "science", "Decision Mathematics": "science", "Further Pure Mathematics": "science",
  "Numerical Analysis": "science",

  // ----- Sciences -----
  "Science": "science", "Combined Science": "science", "General Science": "science", "Integrated Science": "science",
  "Biology": "science", "Chemistry": "science", "Physics": "science",
  "Environmental Science": "science", "Environmental Management": "science",
  "Earth Science": "science", "Astronomy": "science", "Astrophysics": "science",
  "Geology": "science", "Meteorology": "science", "Oceanography": "science",
  "Marine Biology": "science", "Zoology": "science", "Botany": "science",
  "Microbiology": "science", "Biochemistry": "science", "Biotechnology": "science",
  "Forensic Science": "science", "Agricultural Science": "science",
  "Health Science": "science", "Human Biology": "science",
  "Life Sciences": "science", "Physical Science": "science", "Natural Sciences": "science",

  // ----- Languages: English & Classical -----
  "English Language": "languages", "English Literature": "languages", "Literature in English": "languages",
  "First Language English": "languages", "Second Language English": "languages",
  "English as a Second Language (ESL)": "languages",
  "Reading": "languages", "Penmanship": "languages",
  "Latin": "languages", "Ancient Greek": "languages", "Classical Studies": "languages",
  "Linguistics": "languages",

  // ----- Languages: European -----
  "French": "languages", "Spanish": "languages", "German": "languages", "Italian": "languages",
  "Portuguese": "languages", "Russian": "languages",
  "Dutch": "languages", "Swedish": "languages", "Norwegian": "languages", "Danish": "languages", "Finnish": "languages",
  "Polish": "languages", "Czech": "languages", "Hungarian": "languages", "Romanian": "languages", "Modern Greek": "languages",
  "Welsh": "languages", "Irish (Gaeilge)": "languages", "Scottish Gaelic": "languages", "Catalan": "languages",

  // ----- Languages: Asian -----
  "Mandarin": "languages", "Cantonese": "languages", "Japanese": "languages", "Korean": "languages",
  "Bahasa Malaysia": "languages", "Bahasa Indonesia": "languages", "Filipino": "languages", "Tagalog": "languages",
  "Vietnamese": "languages", "Thai": "languages", "Khmer": "languages", "Lao": "languages", "Burmese": "languages",
  "Hindi": "languages", "Tamil": "languages", "Bengali": "languages", "Urdu": "languages",
  "Marathi": "languages", "Gujarati": "languages", "Punjabi": "languages",
  "Telugu": "languages", "Malayalam": "languages",
  "Kannada": "languages", "Odia": "languages", "Assamese": "languages",
  "Sanskrit": "languages", "Nepali": "languages", "Sinhala": "languages", "Dhivehi": "languages",

  // ----- Languages: Middle Eastern -----
  "Arabic": "languages", "Hebrew": "languages", "Turkish": "languages",
  "Persian (Farsi)": "languages", "Pashto": "languages", "Dari": "languages", "Kurdish": "languages",

  // ----- Languages: African -----
  "Swahili": "languages", "Kiswahili": "languages",
  "Yoruba": "languages", "Igbo": "languages", "Hausa": "languages",
  "Zulu": "languages", "Xhosa": "languages", "Afrikaans": "languages", "Amharic": "languages",
  "Tigrinya": "languages", "Oromo": "languages", "Somali": "languages",
  "Setswana": "languages", "Sesotho": "languages", "Shona": "languages", "Ndebele": "languages", "Luganda": "languages",
  "Akan": "languages", "Ewe": "languages", "Fante": "languages", "Twi": "languages", "Wolof": "languages",

  // ----- Languages: Indigenous & Sign -----
  "Indigenous Languages": "languages", "Inuktitut": "languages",
  "Maori": "languages", "Aboriginal Languages": "languages",
  "Sign Language": "languages", "Braille": "languages",

  // ----- Humanities & Social Sciences -----
  "History": "humanities", "World History": "humanities", "US History": "humanities",
  "European History": "humanities", "African History": "humanities", "Asian History": "humanities",
  "Ancient History": "humanities", "Modern History": "humanities",
  "Caribbean History": "humanities", "Canadian History": "humanities",
  "Australian History": "humanities", "Chinese History": "humanities", "Latin American History": "humanities",
  "Geography": "humanities", "Human Geography": "humanities", "Physical Geography": "humanities",
  "Social Studies": "humanities", "Civic Education": "humanities", "Citizenship": "humanities",
  "Government": "humanities", "Politics": "humanities",
  "Economics": "humanities",
  "Sociology": "humanities", "Psychology": "humanities", "Anthropology": "humanities",
  "Philosophy": "humanities", "Ethics": "humanities",
  "Global Perspectives": "humanities", "Theory of Knowledge": "humanities",
  "Law": "humanities", "Legal Studies": "humanities", "Criminology": "humanities",
  "Indigenous Studies": "humanities", "Aboriginal Studies": "humanities", "First Nations Studies": "humanities",
  "Peace Studies": "humanities", "Gender Studies": "humanities", "Cultural Studies": "humanities",
  "Ideology and Politics": "humanities", "Moral and Law": "humanities",

  // ----- Religious Education -----
  "Religious Studies": "humanities", "Religious Education": "humanities",
  "Comparative Religion": "humanities", "Theology": "humanities",
  "Bible Studies": "humanities", "Bible Knowledge": "humanities",
  "Christian Religious Knowledge": "humanities", "Christian Religious Studies": "humanities",
  "Islamic Studies": "humanities", "Islamic Religious Knowledge": "humanities", "Islamic Education": "humanities",
  "Quranic Studies": "humanities",
  "Hadith": "humanities", "Fiqh": "humanities", "Tajweed": "humanities", "Tawhid": "humanities", "Seerah": "humanities",
  "Hindu Studies": "humanities", "Hindu Religious Education": "humanities",
  "Buddhist Studies": "humanities", "Buddhism": "humanities",
  "Sikh Studies": "humanities", "Jewish Studies": "humanities", "Judaic Studies": "humanities",
  "Traditional African Religion": "humanities",
  "Moral Instruction": "humanities", "Moral Science": "humanities", "Value Education": "humanities",
  "Pancasila": "humanities", "Agama (Religion)": "humanities",
  "Araling Panlipunan": "humanities", "Edukasyon sa Pagpapakatao": "humanities",

  // ----- Commercial / Business -----
  "Commerce": "commercial", "Business Studies": "commercial", "Accounting": "commercial",
  "Financial Studies": "commercial", "Economics (Commercial)": "commercial",
  "Marketing": "commercial", "Entrepreneurship": "commercial", "Entrepreneurship Education": "commercial",
  "Finance": "commercial", "Personal Finance": "commercial", "Financial Literacy": "commercial",
  "Management": "commercial", "Office Practice": "commercial",
  "Introduction to Business": "commercial", "Office Administration": "commercial",
  "Project Management": "commercial", "Human Resources": "commercial", "Supply Chain Management": "commercial",
  "Principles of Business": "commercial", "Principles of Accounts": "commercial",
  "Book Keeping": "commercial", "Store Keeping": "commercial", "Salesmanship": "commercial",

  // ----- Arts & Design -----
  "Art": "arts", "Fine Art": "arts", "Visual Arts": "arts", "Art and Design": "arts",
  "Ceramics": "arts", "Sculpture": "arts",
  "Pottery": "arts", "Printmaking": "arts", "Batik": "arts",
  "Calligraphy": "arts", "Chinese Calligraphy": "arts",
  "Photography": "arts", "Graphic Design": "arts", "Illustration": "arts",
  "Music": "arts", "Choir": "arts", "Band": "arts", "Orchestra": "arts",
  "Music Theory": "arts", "Music Technology": "arts",
  "Drama": "arts", "Theatre": "arts", "Theatre Studies": "arts",
  "Performing Arts": "arts", "Dance": "arts", "Traditional Dance": "arts", "Folk Dance": "arts",
  "Film Studies": "arts", "Film Production": "arts", "Animation": "arts",
  "Media Studies": "arts", "Creative Writing": "arts",
  "Handicrafts": "arts", "Needlework": "arts", "Embroidery": "arts",

  // ----- Technology & Computing -----
  "Computer Science": "technology", "Computing": "technology", "ICT": "technology",
  "Information Technology": "technology",
  "Programming": "technology", "Software Development": "technology", "Web Development": "technology",
  "Python Programming": "technology", "Java Programming": "technology",
  "Data Science": "technology", "Artificial Intelligence": "technology", "Machine Learning": "technology",
  "Database Management": "technology", "Networking": "technology", "Cybersecurity": "technology",
  "Game Development": "technology", "UX Design": "technology", "3D Printing": "technology",
  "Robotics": "technology", "Engineering": "technology", "Electronics": "technology",
  "Design & Technology": "technology", "Product Design": "technology",
  "Technical Drawing": "technology", "CAD": "technology",
  "Food Technology": "technology", "Food Science": "technology",
  "Textiles": "technology", "Fashion Design": "technology",
  "Digital Media": "technology", "Digital Citizenship": "technology", "Media Literacy": "technology",
  "GSM Maintenance": "technology", "Data Processing": "technology",
  "Keyboarding": "technology", "Typewriting": "technology",

  // ----- PE, Health & Safety -----
  "Physical Education": "general", "Sports Science": "general", "Sports Studies": "general",
  "Health": "general", "Health Education": "general", "Nutrition": "general", "Healthy Living": "general",
  "Swimming": "general", "First Aid": "general", "Road Safety": "general", "Safety Education": "general",
  "MAPEH": "general",

  // ----- Vocational / Practical / Trade -----
  "Home Economics": "vocational", "Family & Consumer Science": "vocational",
  "Home Management": "vocational",
  "Prevocational Studies": "vocational", "Work Education": "vocational", "SUPW": "vocational",
  "Woodwork": "vocational", "Metalwork": "vocational", "Carpentry": "vocational",
  "Hospitality": "vocational", "Tourism": "vocational", "Culinary Arts": "vocational",
  "Catering Craft Practice": "vocational", "Hotel Management": "vocational",
  "Cosmetology": "vocational", "Fashion": "vocational",
  "Tailoring": "vocational", "Garment Making": "vocational",
  "Auto Mechanics": "vocational", "Automotive Technology": "vocational",
  "Block-laying and Concreting": "vocational", "Bricklaying": "vocational",
  "Painting and Decorating": "vocational",
  "Plumbing and Pipe-fitting": "vocational", "Electrical Installation": "vocational", "Welding": "vocational",
  "Refrigeration and Air Conditioning": "vocational",
  "Animal Husbandry": "vocational", "Fishery": "vocational", "Horticulture": "vocational",
  "Leather Works": "vocational",

  // ----- Early Years / Pre-primary -----
  "Numeracy": "science", "Number Work": "science", "Early Math": "science", "Pre-Math": "science",
  "Literacy": "languages", "Phonics": "languages",
  "Pre-Reading": "languages", "Pre-Writing": "languages",
  "Handwriting": "languages", "Oral English": "languages",
  "Rhymes": "arts", "Storytelling": "arts", "Songs and Rhymes": "arts",
  "Music and Movement": "arts",
  "Colour and Shape": "arts",
  "Sensory Play": "general", "Dramatic Play": "general", "Block Play": "general", "Construction Play": "general",
  "Circle Time": "general", "Show and Tell": "general",
  "Practical Life": "general",
  "Fine Motor Skills": "general", "Gross Motor Skills": "general",
  "Nature Studies": "science",
  "Art and Craft": "arts", "Finger Painting": "arts",
  "General Knowledge": "humanities",

  // ----- Nigerian / West African Primary -----
  "Verbal Reasoning": "languages", "Quantitative Reasoning": "science",
  "Basic Science": "science", "Basic Technology": "technology",
  "Cultural and Creative Arts": "arts", "Creative Arts": "arts",
  "Health Habits": "general", "Personal Hygiene": "general", "Social Habits": "general",
  "Environmental Studies": "science", "Civic Studies": "humanities",
  "Computer Studies": "technology", "Basic Computer": "technology",

  // ----- Other regional -----
  "Life Skills": "general", "Life Orientation": "general",
  "Mathematical Literacy": "science",
  "EVS (Environmental Studies)": "science",

  // ----- Study / Life Skills / Guidance -----
  "Study Skills": "general", "Critical Thinking": "general",
  "Public Speaking": "general", "Debate": "general",
  "Research Methods": "general", "Career Planning": "general", "Guidance and Counselling": "general",
  "Functional Skills": "general", "Independent Living": "general", "Communication Skills": "general",

  // ----- IB MYP subject groups & misc regional aliases -----
  "Language Acquisition": "languages", "Sciences": "science",
  "Individuals and Societies": "humanities", "Arts": "arts",
  "Computer Applications Technology": "technology",
  "Technology and Livelihood Education": "vocational",
};

// ---------------------------------------------------------------------------
// Subject presets — curated bundles the admin can apply with one click
// ---------------------------------------------------------------------------

export interface SubjectPreset {
  id: string;
  label: string;
  description: string;
  /** Matches structure.id values in GRADE_LEVEL_STRUCTURES for recommendation sorting */
  relevantFor: string[];
  subjects: string[];
}

export const SUBJECT_PRESETS: SubjectPreset[] = [
  // ----- Early Years / Nursery -----
  {
    id: "early_years_generic",
    label: "Early Years / Nursery",
    description: "Pre-primary foundational skills (Reception, KG, Nursery, PP)",
    relevantFor: ["ng_6334", "uk_year", "gh_jhs_shs", "ke_844", "us_k12", "za_grade", "fr_cycle", "ib"],
    subjects: [
      "Numeracy", "Literacy", "Phonics", "Pre-Reading", "Pre-Writing", "Handwriting",
      "Oral English", "Rhymes", "Storytelling", "Music and Movement",
      "Colour and Shape", "Sensory Play", "Practical Life",
      "Fine Motor Skills", "Gross Motor Skills", "Nature Studies",
    ],
  },
  {
    id: "ng_nursery",
    label: "Nigerian Nursery",
    description: "Common Nigerian nursery school curriculum",
    relevantFor: ["ng_6334"],
    subjects: [
      "Number Work", "Phonics", "Oral English", "Handwriting",
      "Rhymes", "Storytelling", "Songs and Rhymes",
      "Colour and Shape", "Creative Arts",
      "Health Habits", "Personal Hygiene",
      "Christian Religious Knowledge", "Islamic Religious Knowledge",
      "Physical Education", "Music and Movement",
      "Basic Computer",
    ],
  },
  {
    id: "ng_primary",
    label: "Nigerian Primary",
    description: "UBE primary school curriculum (Primary 1–6)",
    relevantFor: ["ng_6334"],
    subjects: [
      "Mathematics", "English Language", "Verbal Reasoning", "Quantitative Reasoning",
      "Basic Science", "Basic Technology", "Social Studies", "Civic Education",
      "Cultural and Creative Arts", "Christian Religious Knowledge", "Islamic Religious Knowledge",
      "Physical Education", "Health Habits", "Computer Studies",
      "Yoruba", "Igbo", "Hausa", "French",
      "Agricultural Science", "Home Economics",
    ],
  },
  {
    id: "primary_core",
    label: "Primary Core",
    description: "Foundational subjects for primary schools",
    relevantFor: ["us_k12", "uk_year", "gh_jhs_shs", "ke_844", "za_grade", "fr_cycle", "ib"],
    subjects: ["Mathematics", "English Language", "Science", "Social Studies", "Geography", "History", "Art", "Music", "Physical Education", "Health", "Religious Education", "French"],
  },
  {
    id: "us_high",
    label: "US High School",
    description: "Standard US high school curriculum",
    relevantFor: ["us_k12"],
    subjects: ["Algebra", "Geometry", "English Language", "English Literature", "Biology", "Chemistry", "Physics", "US History", "World History", "Geography", "Economics", "Computer Science", "Spanish", "Art", "Music", "Drama", "Physical Education", "Health", "Psychology", "Environmental Science", "Statistics"],
  },
  {
    id: "uk_gcse",
    label: "UK Secondary (GCSE)",
    description: "English GCSE core and optional subjects",
    relevantFor: ["uk_year"],
    subjects: ["Mathematics", "English Language", "English Literature", "Biology", "Chemistry", "Physics", "Geography", "History", "French", "Spanish", "Religious Education", "Art", "Music", "Drama", "Design & Technology", "Computer Science", "Physical Education", "Citizenship", "Business Studies", "Food Technology", "Media Studies"],
  },
  {
    id: "ng_science",
    label: "West Africa (Science)",
    description: "WAEC/NECO Science track",
    relevantFor: ["ng_6334", "gh_jhs_shs"],
    subjects: ["Mathematics", "English Language", "Biology", "Chemistry", "Physics", "Further Mathematics", "Computer Science", "Geography", "Civic Education", "Agricultural Science", "Literature in English", "Economics"],
  },
  {
    id: "ng_arts",
    label: "West Africa (Arts)",
    description: "WAEC/NECO Arts track",
    relevantFor: ["ng_6334", "gh_jhs_shs"],
    subjects: ["Mathematics", "English Language", "Literature in English", "Government", "History", "Economics", "Civic Education", "Religious Studies", "French", "Fine Art", "Music", "Geography"],
  },
  {
    id: "ng_commercial",
    label: "West Africa (Commercial)",
    description: "WAEC/NECO Commercial track",
    relevantFor: ["ng_6334", "gh_jhs_shs"],
    subjects: ["Mathematics", "English Language", "Economics", "Commerce", "Accounting", "Business Studies", "Government", "Civic Education", "Computer Science", "Geography", "Literature in English"],
  },
  {
    id: "ke_kcse",
    label: "Kenya KCSE",
    description: "Kenyan secondary school core subjects",
    relevantFor: ["ke_844"],
    subjects: ["Mathematics", "English Language", "Kiswahili", "Biology", "Chemistry", "Physics", "Geography", "History", "Business Studies", "Agricultural Science", "Computer Science", "Religious Education"],
  },
  {
    id: "za_nsc",
    label: "South Africa (NSC / FET)",
    description: "Further Education and Training Phase subjects",
    relevantFor: ["za_grade"],
    subjects: ["Mathematics", "Mathematical Literacy", "English Language", "Afrikaans", "Zulu", "Life Orientation", "Life Sciences", "Physical Science", "Geography", "History", "Economics", "Accounting", "Business Studies", "Computer Applications Technology"],
  },
  {
    id: "ib_myp",
    label: "IB Middle Years (MYP)",
    description: "IB Middle Years Programme subject groups",
    relevantFor: ["ib"],
    subjects: ["Mathematics", "English Language", "Language Acquisition", "Sciences", "Individuals and Societies", "Arts", "Design & Technology", "Physical Education"],
  },
  {
    id: "ib_dp",
    label: "IB Diploma (DP)",
    description: "IB Diploma Programme core + 6 subject groups",
    relevantFor: ["ib"],
    subjects: ["Mathematics", "English Language", "English Literature", "French", "Spanish", "Biology", "Chemistry", "Physics", "History", "Economics", "Psychology", "Geography", "Theory of Knowledge", "Visual Arts", "Computer Science"],
  },
  {
    id: "cambridge_igcse",
    label: "Cambridge IGCSE Core",
    description: "Common IGCSE core subjects",
    relevantFor: ["uk_year", "ib"],
    subjects: ["Mathematics", "English Language", "English Literature", "Biology", "Chemistry", "Physics", "Combined Science", "Geography", "History", "French", "Spanish", "Computer Science", "Business Studies", "Economics", "Art and Design", "Music", "Physical Education", "Global Perspectives"],
  },
  {
    id: "cbse_secondary",
    label: "CBSE / ICSE Secondary (India)",
    description: "Indian board secondary curriculum",
    relevantFor: [],
    subjects: ["Mathematics", "English Language", "Hindi", "Science", "Social Studies", "Computer Science", "Physical Education", "Sanskrit", "Environmental Science"],
  },
  {
    id: "fr_lycee",
    label: "French Lycée",
    description: "French secondary school common subjects",
    relevantFor: ["fr_cycle"],
    subjects: ["Mathematics", "French", "English Language", "Philosophy", "History", "Geography", "Physics", "Chemistry", "Biology", "Economics", "Latin", "Ancient Greek", "Physical Education"],
  },
  {
    id: "ph_k12",
    label: "Philippines K-12",
    description: "DepEd K to 12 core subjects (Grade 1-10)",
    relevantFor: [],
    subjects: [
      "Mathematics", "English Language", "Filipino", "Science", "Social Studies",
      "Araling Panlipunan", "Edukasyon sa Pagpapakatao", "MAPEH",
      "Physical Education", "Health", "Art", "Music",
      "Computer Science", "Technology and Livelihood Education",
    ],
  },
  {
    id: "id_kurikulum",
    label: "Indonesian (Kurikulum)",
    description: "Sekolah Dasar / SMP core subjects",
    relevantFor: [],
    subjects: [
      "Mathematics", "Bahasa Indonesia", "English Language",
      "Pancasila", "Agama (Religion)",
      "Science", "Social Studies", "Physical Education",
      "Art", "Computer Science",
    ],
  },
  {
    id: "cn_senior",
    label: "Chinese Senior Secondary",
    description: "Gaokao-aligned high school curriculum",
    relevantFor: [],
    subjects: [
      "Mandarin", "Mathematics", "English Language",
      "Physics", "Chemistry", "Biology",
      "History", "Geography", "Ideology and Politics",
      "Chinese History", "Physical Education",
      "Chinese Calligraphy", "Music", "Art",
    ],
  },
  {
    id: "au_senior",
    label: "Australian Senior Secondary",
    description: "Year 11-12 ACARA subjects",
    relevantFor: [],
    subjects: [
      "English Language", "English Literature", "Mathematics",
      "Biology", "Chemistry", "Physics",
      "Ancient History", "Modern History", "Geography",
      "Economics", "Business Studies", "Legal Studies",
      "Religious Studies", "Aboriginal Studies",
      "Physical Education", "Health", "Visual Arts", "Music", "Drama",
      "Computer Science", "Design & Technology",
    ],
  },
  {
    id: "ca_secondary",
    label: "Canadian Secondary",
    description: "Common Canadian high school subjects",
    relevantFor: [],
    subjects: [
      "English Language", "Mathematics", "French",
      "Biology", "Chemistry", "Physics", "Science",
      "Canadian History", "Geography", "Social Studies",
      "Indigenous Studies", "First Nations Studies",
      "Physical Education", "Health", "Art", "Music", "Drama",
      "Computer Science", "Business Studies", "Career Planning",
    ],
  },
  {
    id: "cb_csec",
    label: "Caribbean CSEC",
    description: "CXC Caribbean Secondary Education Certificate",
    relevantFor: [],
    subjects: [
      "English Language", "English Literature", "Mathematics",
      "Biology", "Chemistry", "Physics", "Integrated Science",
      "Caribbean History", "Geography", "Social Studies",
      "Principles of Business", "Principles of Accounts", "Economics",
      "Agricultural Science", "Physical Education",
      "Religious Education", "Visual Arts", "Music",
      "Information Technology",
    ],
  },
  {
    id: "gcc_islamic",
    label: "GCC / MENA Islamic School",
    description: "Saudi / UAE / Qatar Islamic school curriculum",
    relevantFor: [],
    subjects: [
      "Arabic", "English Language", "Mathematics",
      "Science", "Biology", "Chemistry", "Physics",
      "Quranic Studies", "Hadith", "Fiqh", "Tajweed", "Tawhid", "Seerah",
      "Islamic Education", "Islamic Studies",
      "History", "Geography", "Social Studies",
      "Physical Education", "Computer Science", "Art",
    ],
  },
  {
    id: "ng_trades",
    label: "Nigerian Trade Subjects (NBC)",
    description: "NBC vocational/trade subjects for SSS students",
    relevantFor: ["ng_6334"],
    subjects: [
      "Auto Mechanics", "Block-laying and Concreting", "Painting and Decorating",
      "Plumbing and Pipe-fitting", "Electrical Installation", "Welding",
      "Refrigeration and Air Conditioning",
      "Catering Craft Practice", "Garment Making", "Cosmetology",
      "Book Keeping", "Data Processing", "Store Keeping",
      "GSM Maintenance", "Leather Works", "Tourism",
      "Animal Husbandry", "Fishery",
    ],
  },
  {
    id: "montessori_early",
    label: "Montessori Early Years",
    description: "Montessori-aligned pre-primary activities",
    relevantFor: ["ng_6334", "uk_year", "gh_jhs_shs", "ke_844", "us_k12", "za_grade", "fr_cycle", "ib"],
    subjects: [
      "Practical Life", "Sensory Play", "Fine Motor Skills", "Gross Motor Skills",
      "Numeracy", "Literacy", "Phonics", "Handwriting",
      "Nature Studies", "Cultural Studies",
      "Art and Craft", "Music and Movement",
      "Circle Time", "Show and Tell", "Storytelling",
    ],
  },
  {
    id: "india_primary",
    label: "Indian Primary (CBSE)",
    description: "CBSE/ICSE primary school curriculum",
    relevantFor: [],
    subjects: [
      "Mathematics", "English Language", "Hindi",
      "EVS (Environmental Studies)", "General Knowledge",
      "Computer Science", "Art", "Music",
      "Physical Education", "Value Education", "Work Education", "SUPW",
      "Sanskrit",
    ],
  },
];
