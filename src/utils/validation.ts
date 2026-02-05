/**
 * Form Validation Utilities
 */

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get email error message
 */
export function getEmailError(email: string): string | null {
  if (!email) return 'Email is required';
  if (!validateEmail(email)) return 'Please enter a valid email address';
  return null;
}

/**
 * Validate password
 * Rules: Min 8 characters
 */
export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Get password error message
 */
export function getPasswordError(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters!';
  return null;
}

/**
 * Validate password strength
 * Returns: 'weak', 'medium', 'strong'
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 8) return 'weak';
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const strength = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;
  
  if (strength <= 2) return 'weak';
  if (strength === 3) return 'medium';
  return 'strong';
}

/**
 * Validate passwords match
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

/**
 * Get confirm password error
 */
export function getConfirmPasswordError(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) return 'Please confirm your password';
  if (!passwordsMatch(password, confirmPassword)) return 'Passwords do not match';
  return null;
}

/**
 * Validate name
 * Rules: Not empty, min 2 characters, max 255 characters
 */
export function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 255;
}

/**
 * Get name error message
 */
export function getNameError(name: string): string | null {
  if (!name || !name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (name.trim().length > 255) return 'Name must be less than 255 characters';
  return null;
}

/**
 * Validate username
 * Rules: 3-30 characters, alphanumeric and underscore only
 */
export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
}

/**
 * Get username error message
 */
export function getUsernameError(username: string): string | null {
  if (!username) return null; // Username is optional
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 30) return 'Username must be less than 30 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  return null;
}

/**
 * Validate post title
 * Rules: Not empty, min 3 characters, max 200 characters
 */
export function validatePostTitle(title: string): boolean {
  return title.trim().length >= 3 && title.trim().length <= 200;
}

/**
 * Get post title error
 */
export function getPostTitleError(title: string): string | null {
  if (!title || !title.trim()) return 'Title is required';
  if (title.trim().length < 3) return 'Title must be at least 3 characters';
  if (title.trim().length > 200) return 'Title must be less than 200 characters';
  return null;
}

/**
 * Validate post content
 * Rules: Not empty, min 10 characters
 */
export function validatePostContent(content: string): boolean {
  return content.trim().length >= 10;
}

/**
 * Get post content error
 */
export function getPostContentError(content: string): string | null {
  if (!content || !content.trim()) return 'Content is required';
  if (content.trim().length < 10) return 'Content must be at least 10 characters';
  return null;
}

/**
 * Validate comment
 * Rules: Not empty, min 1 character, max 2000 characters
 */
export function validateComment(comment: string): boolean {
  return comment.trim().length >= 1 && comment.trim().length <= 2000;
}

/**
 * Get comment error
 */
export function getCommentError(comment: string): string | null {
  if (!comment || !comment.trim()) return 'Comment cannot be empty';
  if (comment.trim().length > 2000) return 'Comment must be less than 2000 characters';
  return null;
}

/**
 * Validate image file
 * Rules: Must be JPEG or PNG, max 5MB
 */
export function validateImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
}

/**
 * Get image file error
 */
export function getImageFileError(file: File): string | null {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    return 'Image must be JPEG or PNG format';
  }
  
  if (file.size > maxSize) {
    return 'Image must be less than 5MB';
  }
  
  return null;
}

/**
 * Validate tags
 * Rules: At least 1 tag, max 5 tags
 */
export function validateTags(tags: string[]): boolean {
  return tags.length >= 1 && tags.length <= 5;
}

/**
 * Get tags error
 */
export function getTagsError(tags: string[]): string | null {
  if (tags.length === 0) return 'At least one tag is required';
  if (tags.length > 5) return 'Maximum 5 tags allowed';
  return null;
}