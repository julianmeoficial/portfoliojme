import type { Metadata, Viewport } from 'next';
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

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
};

const fontStylesheet =
    'https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&f[]=satoshi@300,400,500,700&display=swap';

const themeScript = `(function(){function lh(){try{var tz=Intl.DateTimeFormat().resolvedOptions().timeZone;var v=new Intl.DateTimeFormat('en-US',{hour:'numeric',hour12:false,timeZone:tz}).format(new Date());var p=parseInt(v,10);if(!isFinite(p))return new Date().getHours();return p===24?0:p;}catch(_){return new Date().getHours();}}function rt(h){return h>=7&&h<19?'light':'dark';}try{var m=localStorage.getItem('portfolio-theme-mode');var s=localStorage.getItem('portfolio-theme');var h=lh();var t;if(m==='manual'&&(s==='light'||s==='dark')){t=s;}else{t=rt(h);}document.documentElement.setAttribute('data-theme',t);var l=localStorage.getItem('portfolio-lang');if(l==='es'||l==='en')document.documentElement.lang=l;}catch(e){document.documentElement.setAttribute('data-theme',rt(new Date().getHours()));}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" data-theme="dark" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://api.fontshare.com" />
                <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
                <link rel="stylesheet" href={fontStylesheet} />
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
