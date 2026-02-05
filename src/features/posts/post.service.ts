/**
 * Post Service - All Post-related API calls
 * Based on Swagger API: https://be-blg-production.up.railway.app/api
 */

import api from "@/lib/api";
import {
  Post,
  PaginatedResponse,
  PaginationParams,
  SearchParams,
  CreatePostDto,
  UpdatePostDto,
  LikeUser,
  Comment,
  PostsByUsernameResponse,
} from "@/types";

// ============================================
// 1. GET RECOMMENDED POSTS (Homepage)
// ============================================
/**
 * GET /posts/recommended
 * Get recommended posts with pagination
 * Used for: Homepage feed
 */
export const getRecommendedPosts = async (
  params?: PaginationParams,
): Promise<PaginatedResponse<Post>> => {
  const response = await api.get("/posts/recommended", {
    params: {
      limit: params?.limit || 10,
      page: params?.page || 1,
    },
  });
  return response.data;
};

// ============================================
// 2. GET MOST LIKED POSTS
// ============================================
/**
 * GET /posts/most-liked
 * Get most liked posts with pagination
 * Used for: Trending/Popular section
 */
export const getMostLikedPosts = async (
  params?: PaginationParams,
): Promise<PaginatedResponse<Post>> => {
  const response = await api.get("/posts/most-liked", {
    params: {
      limit: params?.limit || 10,
      page: params?.page || 1,
    },
  });
  return response.data;
};

// ============================================
// 3. GET MY POSTS (Requires Auth)
// ============================================
/**
 * GET /posts/my-posts
 * Get current user's posts
 * Used for: My Profile page
 * Requires: JWT token
 */
export const getMyPosts = async (
  params?: PaginationParams,
): Promise<PaginatedResponse<Post>> => {
  const response = await api.get("/posts/my-posts", {
    params: {
      limit: params?.limit || 10,
      page: params?.page || 1,
    },
  });
  return response.data;
};

// ============================================
// 4. SEARCH POSTS
// ============================================
/**
 * GET /posts/search
 * Search posts by query string
 * Used for: Search functionality in navbar
 */
export const searchPosts = async (
  searchParams: SearchParams,
): Promise<PaginatedResponse<Post>> => {
  const response = await api.get("/posts/search", {
    params: {
      query: searchParams.query,
      limit: searchParams.limit || 10,
      page: searchParams.page || 1,
    },
  });
  return response.data;
};

// ============================================
// 5. GET POST BY ID
// ============================================
/**
 * GET /posts/{id}
 * Get single post by ID
 * Used for: Post detail page
 */
export const getPostById = async (id: number | string): Promise<Post> => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

// ============================================
// 6. CREATE POST (Requires Auth)
// ============================================
/**
 * POST /posts
 * Create new post with image upload
 * Content-Type: multipart/form-data
 * Requires: JWT token
 * Used for: Write post page
 */
export const createPost = async (data: CreatePostDto): Promise<Post> => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("content", data.content);

  // Tags can be sent as JSON array string or individual items
  formData.append("tags", JSON.stringify(data.tags));

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ============================================
// 7. UPDATE POST (Requires Auth)
// ============================================
/**
 * PATCH /posts/{id}
 * Update existing post
 * Content-Type: multipart/form-data
 * Requires: JWT token (must be post author)
 * Used for: Edit post page
 */
export const updatePost = async (
  id: number | string,
  data: UpdatePostDto,
): Promise<Post> => {
  const formData = new FormData();

  if (data.title) formData.append("title", data.title);
  if (data.content) formData.append("content", data.content);
  if (data.tags) formData.append("tags", JSON.stringify(data.tags));
  if (data.image) formData.append("image", data.image);
  if (data.removeImage) formData.append("removeImage", "true");

  const response = await api.patch(`/posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ============================================
// 8. DELETE POST (Requires Auth)
// ============================================
/**
 * DELETE /posts/{id}
 * Delete a post
 * Requires: JWT token (must be post author)
 * Used for: Delete button in post detail/profile
 */
export const deletePost = async (
  id: number | string,
): Promise<{ success: boolean }> => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

// ============================================
// 9. LIKE/UNLIKE POST (Requires Auth)
// ============================================
/**
 * POST /posts/{id}/like
 * Toggle like on a post (like if not liked, unlike if already liked)
 * Requires: JWT token
 * Used for: Like button
 */
export const likePost = async (id: number | string): Promise<Post> => {
  const response = await api.post(`/posts/${id}/like`);
  return response.data;
};

// ============================================
// 10. GET POST LIKES
// ============================================
/**
 * GET /posts/{id}/likes
 * Get list of users who liked the post
 * Used for: Statistics modal - Likes tab
 */
export const getPostLikes = async (
  id: number | string,
): Promise<LikeUser[]> => {
  const response = await api.get(`/posts/${id}/likes`);
  return response.data;
};

// ============================================
// 11. GET POST COMMENTS
// ============================================
/**
 * GET /posts/{id}/comments
 * Get all comments for a post
 * Used for: Statistics modal - Comments tab / Comments modal
 */
export const getPostComments = async (
  id: number | string,
): Promise<Comment[]> => {
  const response = await api.get(`/posts/${id}/comments`);
  return response.data;
};

// ============================================
// 12. GET POSTS BY USERNAME
// ============================================
/**
 * GET /posts/by-username/{username}
 * Get posts by author username with pagination
 * Response includes user info (without email)
 * Used for: Other user's profile page
 */
export const getPostsByUsername = async (
  username: string,
  params?: PaginationParams,
): Promise<PostsByUsernameResponse> => {
  const response = await api.get(`/posts/by-username/${username}`, {
    params: {
      limit: params?.limit || 10,
      page: params?.page || 1,
    },
  });
  return response.data;
};

// ============================================
// 13. GET POSTS BY USER ID
// ============================================
/**
 * GET /posts/by-user/{userId}
 * Get posts by user ID with pagination
 * Response includes user info
 * Used for: Alternative to username-based lookup
 */
export const getPostsByUserId = async (
  userId: number,
  params?: PaginationParams,
): Promise<PostsByUsernameResponse> => {
  const response = await api.get(`/posts/by-user/${userId}`, {
    params: {
      limit: params?.limit || 10,
      page: params?.page || 1,
    },
  });
  return response.data;
};

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================
export default {
  getRecommendedPosts,
  getMostLikedPosts,
  getMyPosts,
  searchPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPostLikes,
  getPostComments,
  getPostsByUsername,
  getPostsByUserId,
};
