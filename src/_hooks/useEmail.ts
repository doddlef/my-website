export function prepareEmail({ subject } : { subject?:string}) {
    window.location.href = `mailto:${getEmail()}${subject ? `?subject=${subject }` : ''}`;
}

export function getEmail():string {
    return import.meta.env.VITE_APP_EMAIL_ADDRESS;
}