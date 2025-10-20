export function nanoid(size = 12) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < size; i++) id += chars[(Math.random() * chars.length) | 0];
  return id;
}