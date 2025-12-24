// Blog Page JavaScript - Separate from main landing page
import { marked } from 'marked';
import { createClient } from '@supabase/supabase-js';
import './style.css';
import './rhubarb-walker.js';

// Supabase Configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

let allPosts = [];
let postStats = {};
let commentCounts = {};

document.addEventListener('DOMContentLoaded', function() {
    initBlogPage();
});

async function initBlogPage() {
    // Load manifest and stats in parallel
    try {
        const [postsResponse, statsData, commentsData] = await Promise.all([
            fetch('/blog/posts.json'),
            loadAllPostStats(),
            loadAllCommentCounts()
        ]);
        
        allPosts = await postsResponse.json();
        postStats = statsData;
        commentCounts = commentsData;
        
        renderBlogGrid(allPosts);
    } catch (error) {
        console.error('Error loading blog manifest:', error);
        document.getElementById('blog-grid').innerHTML = '<div class="error">Failed to load blog posts.</div>';
    }

    // Search functionality
    const searchInput = document.getElementById('blog-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredPosts = allPosts.filter(post =>
                post.title.toLowerCase().includes(searchTerm) ||
                post.excerpt.toLowerCase().includes(searchTerm)
            );
            renderBlogGrid(filteredPosts);
        });
    }

    // Back button
    const backButton = document.getElementById('back-to-blog');
    if (backButton) {
        backButton.addEventListener('click', () => {
            document.getElementById('post-detail').style.display = 'none';
            document.getElementById('blog-grid').style.display = 'block';
            document.querySelector('.blog-controls').style.display = 'flex';
            // Reset URL
            window.history.replaceState(null, null, 'blog.html');
        });
    }

    // Comment form submission
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('comment-name').value;
            const content = document.getElementById('comment-content').value;
            const slug = document.getElementById('post-detail').dataset.slug;

            if (supabase) {
                const { error } = await supabase
                    .from('blog_comments')
                    .insert({ post_slug: slug, author_name: name, content: content });

                if (error) {
                    console.error('Error posting comment:', error);
                    alert('Failed to post comment.');
                } else {
                    document.getElementById('comment-content').value = '';
                    loadComments(slug);
                }
            } else {
                alert('Supabase not configured. Commenting is disabled.');
            }
        });
    }

    // Like button
    const likeButton = document.getElementById('like-button');
    if (likeButton) {
        likeButton.addEventListener('click', async () => {
            const slug = document.getElementById('post-detail').dataset.slug;
            if (supabase) {
                const { data: stats } = await supabase
                    .from('blog_stats')
                    .select('likes_count')
                    .eq('slug', slug)
                    .single();

                const newLikes = (stats?.likes_count || 0) + 1;

                await supabase
                    .from('blog_stats')
                    .upsert({ slug, likes_count: newLikes }, { onConflict: 'slug' });

                document.getElementById('like-count').textContent = newLikes;
            }
        });
    }

    // Check for post slug in URL
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('post');
    if (postSlug) {
        loadPost(postSlug);
    }
}

// Fetch all post stats from Supabase
async function loadAllPostStats() {
    if (!supabase) return {};
    
    try {
        const { data } = await supabase
            .from('blog_stats')
            .select('slug, likes_count, view_count');
        
        const stats = {};
        if (data) {
            data.forEach(row => {
                stats[row.slug] = row;
            });
        }
        return stats;
    } catch (error) {
        console.error('Error loading post stats:', error);
        return {};
    }
}

// Fetch all comment counts from Supabase
async function loadAllCommentCounts() {
    if (!supabase) return {};
    
    try {
        const { data } = await supabase
            .from('blog_comments')
            .select('post_slug');
        
        const counts = {};
        if (data) {
            data.forEach(row => {
                counts[row.post_slug] = (counts[row.post_slug] || 0) + 1;
            });
        }
        return counts;
    } catch (error) {
        console.error('Error loading comment counts:', error);
        return {};
    }
}

function renderBlogGrid(posts) {
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;

    if (posts.length === 0) {
        blogGrid.innerHTML = '<div class="no-results">No posts found matching your search.</div>';
        return;
    }

    blogGrid.innerHTML = posts.map(post => {
        // Get stats for this post, default to 1 like and 0 comments if none
        const stats = postStats[post.slug] || {};
        const likes = stats.likes_count || 1;
        const comments = commentCounts[post.slug] || 0;
        
        return `
            <article class="blog-card" data-slug="${post.slug}">
                <div class="blog-card-thumbnail-wrapper">
                    <img src="${post.thumbnail || '/generalRhubarb.png'}" alt="${post.title}" class="blog-card-thumbnail" loading="lazy">
                    <div class="blog-card-overlay"></div>
                </div>
                <div class="blog-card-content">
                    <span class="blog-card-date">📅 ${formatDate(post.date)}</span>
                    <h3 class="blog-card-title">${post.title}</h3>
                    <p class="blog-card-excerpt">${post.excerpt}</p>
                    <div class="blog-card-footer">
                        <div class="blog-card-stats">
                            <span class="stat-item stat-likes">❤️ ${likes}</span>
                            <span class="stat-item stat-comments">💬 ${comments}</span>
                        </div>
                        <button class="btn btn-outline read-more" data-slug="${post.slug}">
                            Read More →
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    // Add click listeners to cards
    blogGrid.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', () => {
            loadPost(button.dataset.slug);
        });
    });
    
    // Add click listener to entire card (optional - for better UX)
    blogGrid.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking the button directly
            if (!e.target.classList.contains('read-more')) {
                loadPost(card.dataset.slug);
            }
        });
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

async function loadPost(slug) {
    const blogGrid = document.getElementById('blog-grid');
    const postDetail = document.getElementById('post-detail');
    const postContent = document.getElementById('post-content');
    const blogControls = document.querySelector('.blog-controls');

    if (!blogGrid || !postDetail || !postContent) return;

    const post = allPosts.find(p => p.slug === slug);
    if (!post) return;

    try {
        const response = await fetch(post.file);
        let markdown = await response.text();

        // Simple frontmatter removal
        markdown = markdown.replace(/^---[\s\S]*?---/, '');

        postContent.innerHTML = marked.parse(markdown);
        postDetail.dataset.slug = slug;

        blogGrid.style.display = 'none';
        blogControls.style.display = 'none';
        postDetail.style.display = 'block';

        // Update URL
        window.history.replaceState(null, null, `blog.html?post=${slug}`);

        // Scroll to top of post
        postDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Supabase interactions
        if (supabase) {
            trackView(slug);
            loadStats(slug);
            loadComments(slug);
            trackReferrer(slug);
        }
    } catch (error) {
        console.error('Error loading post:', error);
    }
}

async function trackView(slug) {
    const { data: stats } = await supabase
        .from('blog_stats')
        .select('view_count')
        .eq('slug', slug)
        .single();

    const newViews = (stats?.view_count || 0) + 1;

    await supabase
        .from('blog_stats')
        .upsert({ slug, view_count: newViews }, { onConflict: 'slug' });

    document.getElementById('view-count').textContent = newViews;
}

async function loadStats(slug) {
    const { data: stats } = await supabase
        .from('blog_stats')
        .select('likes_count, view_count')
        .eq('slug', slug)
        .single();

    if (stats) {
        document.getElementById('like-count').textContent = stats.likes_count || 0;
        document.getElementById('view-count').textContent = stats.view_count || 0;
    }
}

async function loadComments(slug) {
    const { data: comments } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_slug', slug)
        .order('created_at', { ascending: true });

    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;

    if (comments && comments.length > 0) {
        commentsList.innerHTML = comments.map(c => `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${c.author_name}</span>
                    <span class="comment-date">${new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <div class="comment-body">${c.content}</div>
            </div>
        `).join('');
    } else {
        commentsList.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
    }
}

function trackReferrer(slug) {
    const referrer = document.referrer;
    if (referrer && !referrer.includes(window.location.hostname)) {
        supabase.from('blog_referrers').insert({ post_slug: slug, referrer_url: referrer });
    }
}

console.log('Sage Blog Page initialized successfully! 🌱');
