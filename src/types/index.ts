/**
 * TypeScript Types & Interfaces
 */

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  headline?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface AuthUser extends User {
  token?: string;
}

export interface PublicProfile {
  id: number;
  name: string;
  username: string;
  headline?: string;
  avatarUrl?: string;
  posts?: PaginatedResponse<Post>;
}

// ============================================
// POST TYPES
// ============================================

export interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  imagePublicId?: string;
  author: User;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  comments: number;
}

export interface CreatePostDto {
  title: string;
  content: string;
  tags: string[];
  image?: File;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  tags?: string[];
  image?: File;
  removeImage?: boolean;
}

// ============================================
// COMMENT TYPES
// ============================================

export interface Comment {
  id: number;
  content: string;
  author: User;
  post?: {
    id: number;
  };
  createdAt: string;
}

export interface CreateCommentDto {
  content: string;
}

// ============================================
// AUTH TYPES
// ============================================

export interface RegisterDto {
  name: string;
  username?: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  username: string;
}

// ============================================
// PROFILE TYPES
// ============================================

export interface UpdateProfileDto {
  name?: string;
  headline?: string;
  avatar?: File;
  bio?:string
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

// ============================================
// PAGINATION TYPES
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
  path: string;
  details?: any;
}

// ============================================
// SEARCH TYPES
// ============================================

export interface SearchParams extends PaginationParams {
  query: string;
}

// ============================================
// LIKE TYPES
// ============================================

export interface LikeUser {
  id: number;
  name: string;
  headline?: string;
  avatarUrl?: string;
}

// ============================================
// FORM TYPES (for React Hook Form or state)
// ============================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string; // Client-side only
}

export interface PostFormData {
  title: string;
  content: string;
  tags: string;
  image?: FileList | null;
}

export interface ProfileFormData {
  name: string;
  headline: string;
  avatar?: FileList | null;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CommentFormData {
  content: string;
}

// ============================================
// UI STATE TYPES
// ============================================

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PostsState extends LoadingState {
  posts: Post[];
  total: number;
  page: number;
  lastPage: number;
}

export interface CommentsState extends LoadingState {
  comments: Comment[];
}

export interface ProfileState extends LoadingState {
  profile: User | null;
}

// ============================================
// NAVBAR STATE TYPES
// ============================================

export interface NavbarState {
  isLoggedIn: boolean;
  user: User | null;
  showSearch: boolean;
}

// ============================================
// MODAL TYPES
// ============================================

export interface ModalState {
  isOpen: boolean;
  data?: any;
}

export interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  comments: Comment[];
}

// ============================================
// TAB TYPES
// ============================================

export type ProfileTab = 'posts' | 'password';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

// ============================================
// UTILITY TYPES
// ============================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// For posts by username response (includes user info)
export interface PostsByUsernameResponse extends PaginatedResponse<Post> {
  user: {
    id: number;
    name: string;
    username: string;
    headline?: string;
    avatarUrl?: string;
  };
}

// ============================================
// EXPORT ALL
// ============================================

export type {
  // Re-export for convenience
  User as UserType,
  Post as PostType,
  Comment as CommentType,
};