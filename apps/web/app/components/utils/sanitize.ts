// utils/sanitize.ts
export const sanitizeMessage = (message: string) => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(message));
    return div.innerHTML;
  };
  