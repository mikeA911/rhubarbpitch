import { marked } from 'marked';
import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
// Replace these with your actual Supabase URL and Anon Key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

let allPosts = [];

export async function initBlog() {
    const blogGrid = document.getElementById('blog-grid');
    const blogSearch = document.getElementById('blog-search');
    const backToBlog = document.getElementById('back-to-blog');
    const postDetail = document.getElementById('post-detail');
    const commentForm = document.getElementById('comment-form');

    // Load manifest
    try {
        const response = await fetch('/blog/posts.json');
        allPosts = await response.json();
        renderBlogGrid(allPosts);
    } catch (error) {
        console.error('Error loading blog manifest:', error);
        blogGrid.innerHTML = '<div class="error">Failed to load blog posts.</div>';
    }

    // Search functionality
    blogSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredPosts = allPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) || 
            post.excerpt.toLowerCase().includes(searchTerm)
        );
        renderBlogGrid(filteredPosts);
    });

    // Back button
    backToBlog.addEventListener('click', () => {
        postDetail.style.display = 'none';
        blogGrid.style.display = 'grid';
        document.querySelector('.blog-controls').style.display = 'flex';
    });

    // Comment form submission
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('comment-name').value;
        const content = document.getElementById('comment-content').value;
        const slug = postDetail.dataset.slug;

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

    // Like button
    document.getElementById('like-button').addEventListener('click', async () => {
        const slug = postDetail.dataset.slug;
        if (supabase) {
            // In a real app, you'd use a RPC or a more robust way to increment
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

function renderBlogGrid(posts) {
    const blogGrid = document.getElementById('blog-grid');
    if (posts.length === 0) {
        blogGrid.innerHTML = '<div class="no-results">No posts found matching your search.</div>';
        return;
    }

    blogGrid.innerHTML = posts.map(post => `
        <div class="blog-card" data-slug="${post.slug}">
            <div class="blog-card-content">
                <div class="blog-card-date">${post.date}</div>
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <button class="btn btn-outline read-more" data-slug="${post.slug}">Read More</button>
            </div>
        </div>
    `).join('');

    // Add click listeners to cards
    blogGrid.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', () => {
            loadPost(button.dataset.slug);
        });
    });
}

async function loadPost(slug) {
    const blogGrid = document.getElementById('blog-grid');
    const postDetail = document.getElementById('post-detail');
    const postContent = document.getElementById('post-content');
    const blogControls = document.querySelector('.blog-controls');

    const post = allPosts.find(p => p.slug === slug);
    if (!post) return;

    try {
        const response = await fetch(post.file);
        let markdown = await response.text();
        
        // Simple frontmatter removal (everything between first two ---)
        markdown = markdown.replace(/^---[\s\S]*?---/, '');
        
        postContent.innerHTML = marked.parse(markdown);
        postDetail.dataset.slug = slug;
        
        blogGrid.style.display = 'none';
        blogControls.style.display = 'none';
        postDetail.style.display = 'block';
        
        window.scrollTo(0, 0);

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
