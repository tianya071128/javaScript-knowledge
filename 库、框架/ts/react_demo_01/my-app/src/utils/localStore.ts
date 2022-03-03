export function getLocalStore(key: string) {
  const data = localStorage.getItem(key);

  if (data === null) return null;
  return JSON.parse(data);
}

export function setLocalStore(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data));
}
