import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import AppReadyGate from '@/components/common/AppReadyGate';
import LanguagePrompt from '@/components/common/LanguagePrompt';
import Navbar from '@/components/common/Navbar';
import './globals.css';

export const metadata: Metadata = {
    title: 'Julián Martínez Espitia — Frontend & Full-Stack Developer',
    description:
        'Portfolio of Julián Martínez Espitia, Junior Software Developer specializing in React, TypeScript, Spring Boot, PostgreSQL, UI systems, and GSAP animations.',
    keywords: [
        'Julián Martínez Espitia',
        'Julian Martinez Espitia',
        'Frontend Developer',
        'Full-Stack Developer',
        'React',
        'TypeScript',
        'Spring Boot',
        'PostgreSQL',
        'GSAP',
        'Portfolio',
    ],
    authors: [{ name: 'Julián Martínez Espitia' }],
    creator: 'Julián Martínez Espitia',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://julianmeoficial.vercel.app',
        title: 'Julián Martínez Espitia — Frontend & Full-Stack Developer',
        description:
            'Junior Software Developer building clean interfaces, modular full-stack systems, and polished digital experiences.',
        siteName: 'Julián Martínez Espitia Portfolio',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Julián Martínez Espitia — Frontend & Full-Stack Developer',
        description:
            'Junior Software Developer building clean interfaces, modular full-stack systems, and polished digital experiences.',
    },
    robots: {
        index: true,
        follow: true,
    },
};

const themeScript = `(function(){try{var m=localStorage.getItem('portfolio-theme-mode');var s=localStorage.getItem('portfolio-theme');var h=new Date().getHours();var t;if(m==='manual'&&(s==='light'||s==='dark')){t=s;}else{t=(h>=7&&h<19)?'light':'dark';}document.documentElement.setAttribute('data-theme',t);var l=localStorage.getItem('portfolio-lang');if(l==='es'||l==='en')document.documentElement.lang=l;}catch(e){var h2=new Date().getHours();document.documentElement.setAttribute('data-theme',(h2>=7&&h2<19)?'light':'dark');}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" data-theme="dark" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body suppressHydrationWarning>
                <LanguageProvider>
                    <AppReadyGate>
                        <LanguagePrompt />
                        <Navbar />
                        {children}
                    </AppReadyGate>
                </LanguageProvider>
            </body>
        </html>
    );
}
