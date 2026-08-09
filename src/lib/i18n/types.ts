export type Language = 'es' | 'en';

export interface Translations {
    common: {
        close: string;
        image_error: string;
        loading: string;
        loading_page: string;
        language_toggle: string;
        switch_to_en: string;
        switch_to_es: string;
        language_prompt_title: string;
        language_prompt_body: string;
        language_prompt_accept: string;
        language_prompt_dismiss: string;
    };
    nav: {
        home: string;
        about: string;
        projects: string;
        skills: string;
        certificates: string;
        contact: string;
        cta_talk: string;
        theme_light: string;
        theme_dark: string;
        menu_open: string;
        menu_close: string;
        mobile_nav: string;
        go_top: string;
        main_navigation: string;
    };
    hero: {
        badge: string;
        title_line1: string;
        title_line2: string;
        title_line3: string;
        bio: string;
        education: string;
        cta_projects: string;
    };
    about: {
        label: string;
        title: string;
        section_background: string;
        section_focus: string;
        paragraph1: string;
        paragraph2: string;
        cta_github: string;
        cta_cv: string;
    };
    projects: {
        label: string;
        heading: string;
        btn_github: string;
        btn_demo: string;
        btn_preview: string;
        modal_label: string;
        gallery_prev: string;
        gallery_next: string;
        gallery_slide_label: string;
        lightbox_close: string;
        lightbox_expand: string;
        lightbox_label: string;
        gallery_choose_slide: string;
        screenshot_alt: string;
    };
    skills: {
        label: string;
        heading_line1: string;
        heading_line2: string;
        categories: {
            languages: string;
            frontend: string;
            backend: string;
            tools: string;
        };
    };
    certificates: {
        label: string;
        heading: string;
        empty: string;
        empty_hint: string;
        verify: string;
        open_pdf: string;
        prev: string;
        next: string;
        counter: string;
        issuer_label: string;
        preview_label: string;
        filter_aria: string;
        filter_all: string;
        courses_one: string;
        courses_many: string;
        expand: string;
        close_preview: string;
        lightbox_label: string;
        select_certificate: string;
        categories: {
            coursera: string;
            aws: string;
            google: string;
            meta: string;
            other: string;
        };
    };
    contact: {
        label: string;
        heading_line1: string;
        heading_line2: string;
        subtitle: string;
        btn_email: string;
        info_title: string;
        info_email_label: string;
        info_location_label: string;
        info_location_value: string;
        info_availability_label: string;
        info_availability_value: string;
        info_languages_label: string;
        info_languages_value: string;
    };
    footer: {
        built_with: string;
        rights: string;
        social_links: string;
    };
}
