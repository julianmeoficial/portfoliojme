/** i18n template helpers for the Certificates section. */

export function fillCounter(template: string, current: number, total: number): string {
    return template
        .replace('{current}', String(current))
        .replace('{total}', String(total));
}

export function fillTitle(template: string, title: string): string {
    return template.replace('{title}', title);
}

export function fillCourseCount(one: string, many: string, count: number): string {
    if (count === 1) return one;
    return many.replace('{count}', String(count));
}
