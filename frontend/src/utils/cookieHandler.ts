
function getCookie(name: string): string | null {
    const cookies = document.cookie
      .split('; ')
      .map(cookie => cookie.split('='))
      .reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {});
  
    return cookies[name] ?? null;
}

export { getCookie };