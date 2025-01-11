export function color(message: string, hex: string) {
    hex = hex.replace(/^#/, '');
    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);
    return `\x1b[38;2;${r};${g};${b}m${message}\x1b[0m`;
}