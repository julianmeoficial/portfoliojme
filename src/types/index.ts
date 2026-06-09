export interface Project {
    id: string;
    title: string;
    description: string;
    stack: string[];
    githubUrl: string;
    demoUrl?: string;
    featured: boolean;
}

export interface SkillCategory {
    category: string;
    skills: Skill[];
}

export interface Skill {
    name: string;
    icon: string;
}