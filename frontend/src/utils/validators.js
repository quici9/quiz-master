export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password) {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
}

export function validateFile(file, maxSize = 10 * 1024 * 1024) {
  if (!file) return 'File is required';
  
  if (!file.name.endsWith('.docx')) {
    return 'Only .docx files are supported';
  }
  
  if (file.size > maxSize) {
    return `File size exceeds ${maxSize / 1024 / 1024}MB`;
  }
  
  return null;
}
