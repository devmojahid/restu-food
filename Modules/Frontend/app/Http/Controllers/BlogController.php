<?php

declare(strict_types=1);

namespace Modules\Frontend\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Frontend\Services\BlogService;  
use Inertia\Response;
use Inertia\Inertia;

final class BlogController extends Controller
{
    public function __construct(
        private readonly BlogService $blogService
    ) {}

    public function index(): Response
    {
        $data = $this->blogService->getBlogPageData();
        
        return Inertia::module('Frontend::Blog/Index', [
            'posts' => $data['posts'],
            'featured' => $data['featured'],
            'categories' => $data['categories'],
            'tags' => $data['tags'],
            'stats' => $data['stats'],
            'popularPosts' => $data['popularPosts'],
            'recentPosts' => $data['recentPosts']
        ]);
    }

    public function show(string $slug): Response
    {
        $data = $this->blogService->getBlogPostData($slug);
        
        return Inertia::module('Frontend::Blog/Show', [
            'post' => $data['post'],
            'relatedPosts' => $data['relatedPosts'],
            'nextPost' => $data['nextPost'],
            'previousPost' => $data['previousPost'],
            'comments' => $data['comments']
        ]);
    }
} 