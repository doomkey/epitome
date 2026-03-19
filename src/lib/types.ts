export interface Field {
	value: string;
	visible: boolean;
	placeholder: string;
}

export interface CoverState {
	subtitle: Field;
	title: Field;
	submittedTo: Field;
	designation: Field;
	dept: Field;
	dept_bottom: Field;
	varsity: Field;
	varsity_bottom: Field;
	submittedBy: Field;
	studentId: Field;
	regNo: Field;
	session: Field;
	date: Field;
}

export interface Section {
	title: string;
	value: string;
}

export type PersonalData = {
	fullName: string;
	title: string;
	email: string;
	phone: string;
	location: string;
	linkedin: string;
	github: string;
	website: string;
	summary: string;
};

export type EducationEntry = {
	id: number;
	degree: string;
	institution: string;
	start: string;
	end: string;
	location: string;
	gpa: string;
};

export type ExperienceEntry = {
	id: number;
	jobTitle: string;
	company: string;
	location: string;
	start: string;
	end: string;
	present: boolean;
	responsibilities: string;
};

export type ProjectEntry = {
	id: number;
	name: string;
	technologies: string;
	link: string;
	description: string;
};

export type CertificationEntry = {
	id: number;
	name: string;
	organization: string;
	url: string;
};

export type SkillCategory = {
	id: number;
	category: string;
	skills: string[];
};

export type SkillsData = {
	categories: SkillCategory[];
	merge: boolean;
};

export type ResumeData = {
	personal: PersonalData;
	education: EducationEntry[];
	experience: ExperienceEntry[];
	projects: ProjectEntry[];
	certifications: CertificationEntry[];
	skills: SkillsData;
};
