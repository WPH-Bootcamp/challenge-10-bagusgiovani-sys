/**
 * Comment Service - All Comment-related API calls
 * Based on Swagger API: https://be-blg-production.up.railway.app/api
 */

import api from '@/lib/api';
import { Comment, CreateCommentDto } from '@/types';

// ============================================
// 1. GET COMMENTS FOR A POST
// ============================================
/**
 * GET /comments/{postId}
 * Get all comments for a specific post
 * Used for: Comments section, Comments modal
 * 
 * @param postId - ID of the post
 * @returns Array of comments
 */
export const getComments = async (postId: number | string): Promise<Comment[]> => {
  const response = await api.get(`/comments/${postId}`);
  return response.data;
};

// ============================================
// 2. ADD COMMENT (Requires Auth)
// ============================================
/**
 * POST /comments/{postId}
 * Add a new comment to a post
 * Requires: JWT token
 * Used for: Comment form in post detail page
 * 
 * @param postId - ID of the post to comment on
 * @param data - Comment content
 * @returns Created comment with author info
 */
export const addComment = async (
  postId: number | string,
  data: CreateCommentDto
): Promise<Comment> => {
  const response = await api.post(`/comments/${postId}`, data);
  return response.data;
};

// ============================================
// 3. DELETE COMMENT (Requires Auth)
// ============================================
/**
 * DELETE /comments/{commentId}
 * Delete a comment
 * Requires: JWT token
 * Allowed for: 
 *   - Comment author (own comment)
 *   - Post owner (any comment on their post)
 * 
 * Used for: Delete button in comment item
 * 
 * @param commentId - ID of the comment to delete
 * @returns Success response
 */
export const deleteComment = async (
  commentId: number | string
): Promise<{ success: boolean }> => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================
export default {
  getComments,
  addComment,
  deleteComment,
};