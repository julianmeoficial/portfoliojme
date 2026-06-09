import Hero     from '@/components/sections/Hero/Hero';
import About    from '@/components/sections/About/About';
import Projects from '@/components/sections/Projects/Projects';
import Skills   from '@/components/sections/Skills/Skills';
import Contact  from '@/components/sections/Contact/Contact';
import Footer   from '@/components/common/Footer/Footer';

export default function Home() {
    return (
        <main>
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Contact />
            <Footer />
        </main>
    );
}