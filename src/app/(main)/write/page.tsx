// app/(main)/write/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePost } from '@/features/posts/hooks/usePost';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { 
  getPostTitleError, 
  getPostContentError, 
  getTagsError,
  getImageFileError 
} from '@/utils/validation';

export default function WritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const isEditMode = !!postId;

  const { user, isLoading: authLoading } = useAuth();
  const { post, createPost, updatePost, getPost, isLoading, error } = usePost();

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    content?: string;
    tags?: string;
    image?: string;
  }>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch post data if in edit mode
  useEffect(() => {
    if (isEditMode && postId && user) {
      getPost(postId);
    }
  }, [isEditMode, postId, user]);

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditMode && post) {
      setTitle(post.title);
      setContent(post.content);
      setTags(post.tags || []);
      if (post.imageUrl) {
        setImagePreview(post.imageUrl);
      }
    }
  }, [isEditMode, post]);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image
    const imageError = getImageFileError(file);
    if (imageError) {
      setFormErrors(prev => ({ ...prev, image: imageError }));
      return;
    }

    setFormErrors(prev => ({ ...prev, image: undefined }));
    setImageFile(file);
    setRemoveImage(false);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  // Handle add tag
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      
      const newTag = tagInput.trim();
      
      // Check if tag already exists
      if (tags.includes(newTag)) {
        setTagInput('');
        return;
      }

      // Check max tags
      if (tags.length >= 5) {
        setFormErrors(prev => ({ ...prev, tags: 'Maximum 5 tags allowed' }));
        return;
      }

      setTags([...tags, newTag]);
      setTagInput('');
      setFormErrors(prev => ({ ...prev, tags: undefined }));
    }
  };

  // Handle remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    setFormErrors(prev => ({ ...prev, tags: undefined }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: typeof formErrors = {};

    const titleError = getPostTitleError(title);
    if (titleError) errors.title = titleError;

    const contentError = getPostContentError(content);
    if (contentError) errors.content = contentError;

    const tagsError = getTagsError(tags);
    if (tagsError) errors.tags = tagsError;

    // Image is required for new posts
    if (!isEditMode && !imageFile) {
      errors.image = 'Cover image is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      if (isEditMode && postId) {
        // Update existing post
        const updatedPost = await updatePost(postId, {
          title,
          content,
          tags,
          image: imageFile || undefined,
          removeImage: removeImage && !imageFile,
        });
        
        // Redirect to updated post
        router.push(`/posts/${updatedPost.id}`);
      } else {
        // Create new post - the hook already redirects to the new post detail page
        await createPost({
          title,
          content,
          tags,
          image: imageFile!,
        });
      }
    } catch (err: any) {
      console.error('Failed to save post:', err);
      // Error will be displayed via ErrorMessage component
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated, don't render (will redirect)
  if (!user) {
    return null;
  }

  // Loading state while fetching post for edit
  if (isEditMode && isLoading && !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Post' : 'Write Post'}
            </h1>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-2">
            <Image
              src={user.avatarUrl || '/assets/images/default-avatar.png'}
              alt={user.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
            <span className="hidden sm:block text-sm font-medium text-gray-900">
              {user.name}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setFormErrors(prev => ({ ...prev, title: undefined }));
              }}
              placeholder="Enter your post title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            {formErrors.title && (
              <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-900 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setFormErrors(prev => ({ ...prev, content: undefined }));
              }}
              placeholder="Write your content here..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none"
            />
            {formErrors.content && (
              <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Cover Image
            </label>
            
            {imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white">
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Cover preview"
                    width={800}
                    height={400}
                    className="w-full h-auto max-h-96 object-cover rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                      <path d="M10 3.333v13.334M3.333 10h13.334" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Change Image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                      <path d="M2.5 5h15M8.333 8.333v5M11.667 8.333v5M3.333 5l.834 11.667c0 .916.75 1.666 1.666 1.666h8.334c.916 0 1.666-.75 1.666-1.666L16.667 5M6.667 5V3.333c0-.916.75-1.666 1.666-1.666h3.334c.916 0 1.666.75 1.666 1.666V5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Remove
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  PNG or JPG (max. 5MB)
                </p>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-500 transition-colors bg-white">
                <div className="flex flex-col items-center justify-center text-center">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4 text-gray-400">
                    <path d="M24 14v20M14 24h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Click to upload cover image
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG or JPG (max. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
            {formErrors.image && (
              <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-900 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-900"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-900"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                      <path d="M12 4L4 12M4 4l8 8" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter (max 5 tags)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            {formErrors.tags && (
              <p className="mt-1 text-sm text-red-600">{formErrors.tags}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Press Enter to add a tag. You can add up to 5 tags.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || isLoading}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting && <LoadingSpinner />}
              {submitting ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Post' : 'Publish Post')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}