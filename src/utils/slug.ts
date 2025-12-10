export const slugify = (text: string): string => {
    return text.toString().replace(/\s+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

export const deslugify = (text: string): string => {
    return text.toString().replace(/-/g, ' ');
};


export const capitalize = (text: string): string => {
    const deslugified = deslugify(text);
    return deslugified.charAt(0).toUpperCase() + deslugified.slice(1);
}

export const addhypenlowercase = (text: string): string => {
    return text.replace(/\s+/g, '-').toLowerCase();
};


export const removehypenlowercase = (text: string): string => {
    return text.toString().replace(/-/g, ' ');
};