export const elipsis = (name, length = 10) => {
    if (!name) {
        return '';
    }
    if (name.length > length) {
        return name.substr(0, length) + '...';
    }
    return name;
}