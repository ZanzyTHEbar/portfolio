import { Brain, Globe, Lock, Code2, Terminal } from 'lucide-solid'
import type { Experience, Project, Skill } from './types'

export const Experiences: Experience[] = [
    {
        title: 'Lead AI Architect',
        company: 'TechVision Solutions',
        period: '2023 - Present',
        description:
            'Leading the development of enterprise AI solutions, focusing on scalable machine learning systems and innovative data architectures.',
        achievements: [
            'Architected a distributed ML pipeline processing 1M+ events/day',
            'Led a team of 12 engineers across 3 continents',
            'Reduced inference costs by 60% through optimization',
        ],
    },
    {
        title: 'Senior Systems Engineer',
        company: 'CloudScale Systems',
        period: '2020 - 2023',
        description:
            'Designed and implemented cloud-native solutions for Fortune 500 clients, specializing in scalable microservices architectures.',
        achievements: [
            'Migrated legacy systems to cloud-native architecture',
            'Implemented zero-downtime deployment strategy',
            'Reduced operational costs by 45%',
        ],
    },
    {
        title: 'DevOps Consultant',
        company: 'InnovateNow Tech',
        period: '2018 - 2020',
        description:
            'Provided strategic DevOps consultation to startups and enterprises, focusing on automation and continuous delivery.',
        achievements: [
            'Reduced deployment time from days to minutes',
            'Implemented security-first CI/CD pipelines',
            'Achieved 99.99% uptime for critical systems',
        ],
    },
]

export const Projects: Project[] = [
    {
        title: 'AI-Driven Analytics Platform',
        description:
            'Enterprise-scale analytics platform leveraging machine learning for real-time insights and predictive modeling.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
        tags: ['Python', 'TensorFlow', 'AWS', 'React'],
        icon: <Brain class="h-6 w-6" />,
        link: '#',
    },
    {
        title: 'Cloud Infrastructure Automation',
        description:
            'Automated cloud infrastructure deployment system with self-healing capabilities and intelligent scaling.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
        tags: ['Terraform', 'Kubernetes', 'Go', 'AWS'],
        icon: <Globe class="h-6 w-6" />,
        link: '#',
    },
    {
        title: 'Secure IoT Platform',
        description:
            'End-to-end IoT platform with military-grade encryption and real-time monitoring capabilities.',
        image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a',
        tags: ['C++', 'Python', 'MQTT', 'Blockchain'],
        icon: <Lock class="h-6 w-6" />,
        link: '#',
    },
]

export const Skills: Skill[] = [
    {
        icon: <Brain class="h-12 w-12 text-[#FFD700]" />,
        title: 'AI & Machine Learning',
        skills: ['Deep Learning', 'NLP', 'Computer Vision', 'MLOps', 'TensorFlow'],
    },
    {
        icon: <Terminal class="h-12 w-12 text-[#FFD700]" />,
        title: 'Cloud & DevOps',
        skills: [
            'AWS Architecture',
            'Kubernetes',
            'CI/CD',
            'Infrastructure as Code',
            'Microservices',
        ],
    },
    {
        icon: <Code2 class="h-12 w-12 text-[#FFD700]" />,
        title: 'System Design',
        skills: [
            'Distributed Systems',
            'API Design',
            'Scalable Architecture',
            'Security',
            'Performance',
        ],
    },
]
