<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\User;
use App\Models\Product;
use App\Models\ReviewVote;
use App\Models\ReviewReport;
use Illuminate\Support\Facades\DB;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        // Create users if none exist
        $users = User::all();
        if ($users->isEmpty()) {
            $users = User::factory(5)->create();
        }

        // Create products if none exist
        $products = Product::all();
        if ($products->isEmpty()) {
            $products = Product::factory(5)->create();
        }

        // Refresh collections after potential creation
        $users = User::all();
        $products = Product::all();

        // Create parent reviews
        foreach ($products as $product) {
            for ($i = 0; $i < rand(3, 8); $i++) {
                $isApproved = (bool)rand(0, 1);
                $user = $users->random();
                $approvedBy = $isApproved ? $users->where('id', '!=', $user->id)->first() : null;

                $review = Review::create([
                    'user_id' => $user->id,
                    'reviewable_type' => Product::class,
                    'reviewable_id' => $product->id,
                    'rating' => rand(1, 5),
                    'title' => fake()->sentence(),
                    'comment' => fake()->paragraphs(rand(1, 3), true),
                    'pros' => rand(0, 1) ? fake()->sentences(rand(1, 3), true) : null,
                    'cons' => rand(0, 1) ? fake()->sentences(rand(1, 3), true) : null,
                    'is_recommended' => (bool)rand(0, 1),
                    'is_verified_purchase' => (bool)rand(0, 1),
                    'is_approved' => $isApproved,
                    'approved_at' => $isApproved ? now()->subDays(rand(1, 30)) : null,
                    'approved_by' => $isApproved ? $approvedBy?->id : null,
                    'status' => $isApproved ? 'approved' : (rand(0, 1) ? 'pending' : 'rejected'),
                    'helpful_votes' => 0,
                    'unhelpful_votes' => 0,
                    'reported_count' => 0,
                    // 'metadata' => [
                    //     'browser' => fake()->userAgent(),
                    //     'ip' => fake()->ipv4(),
                    //     'platform' => ['Windows', 'MacOS', 'iOS', 'Android'][rand(0, 3)],
                    // ],
                    'created_at' => now()->subDays(rand(1, 60)),
                ]);

                // Add review images
                if (rand(0, 1)) {
                    $review->metadata = array_merge($review->metadata ?? [], [
                        'images' => collect(range(1, rand(1, 5)))->map(function () {
                            return [
                                'url' => fake()->imageUrl(800, 600),
                                'name' => 'review-image-' . fake()->word() . '.jpg',
                            ];
                        })->toArray(),
                    ]);
                    $review->save();
                }

                // Create votes (ensuring no duplicates)
                $voteCount = rand(0, min(20, $users->count())); // Limit votes to available users
                $votingUsers = $users->random($voteCount); // Get random unique users
                $helpfulVotes = 0;
                $unhelpfulVotes = 0;

                foreach ($votingUsers as $votingUser) {
                    $voteType = rand(0, 1) ? 'helpful' : 'unhelpful';
                    ReviewVote::create([
                        'review_id' => $review->id,
                        'user_id' => $votingUser->id,
                        'vote_type' => $voteType,
                        'created_at' => now()->subDays(rand(1, 30)),
                    ]);

                    if ($voteType === 'helpful') {
                        $helpfulVotes++;
                    } else {
                        $unhelpfulVotes++;
                    }
                }

                // Update vote counts
                $review->update([
                    'helpful_votes' => $helpfulVotes,
                    'unhelpful_votes' => $unhelpfulVotes,
                ]);

                // Create reports for some reviews
                if (rand(0, 4) === 0) { // 20% chance of having reports
                    $reportCount = rand(1, 3);
                    for ($k = 0; $k < $reportCount; $k++) {
                        $isResolved = (bool)rand(0, 1);
                        $resolvedBy = $isResolved ? $users->random() : null;

                        ReviewReport::create([
                            'review_id' => $review->id,
                            'user_id' => $users->random()->id,
                            'reason' => ['inappropriate', 'spam', 'offensive', 'irrelevant'][rand(0, 3)],
                            'details' => rand(0, 1) ? fake()->sentence() : null,
                            'status' => $isResolved ? 'resolved' : ['pending', 'investigating'][rand(0, 1)],
                            'resolved_at' => $isResolved ? now()->subDays(rand(1, 15)) : null,
                            'resolved_by' => $resolvedBy?->id,
                            'created_at' => now()->subDays(rand(16, 30)),
                        ]);
                    }

                    // Update reported count
                    $review->update([
                        'reported_count' => $reportCount,
                    ]);
                }

                // Create replies for some reviews
                if (rand(0, 2) === 0) { // 33% chance of having replies
                    $replyCount = rand(1, 3);
                    for ($l = 0; $l < $replyCount; $l++) {
                        $isApproved = (bool)rand(0, 1);
                        $replyUser = $users->random();
                        $replyApprovedBy = $isApproved ? $users->where('id', '!=', $replyUser->id)->random() : null;

                        Review::create([
                            'user_id' => $replyUser->id,
                            'reviewable_type' => Product::class,
                            'reviewable_id' => $product->id,
                            'parent_id' => $review->id,
                            'comment' => fake()->paragraph(),
                            'is_approved' => $isApproved,
                            'approved_at' => $isApproved ? now()->subDays(rand(1, 15)) : null,
                            'approved_by' => $isApproved ? $replyApprovedBy?->id : null,
                            'status' => $isApproved ? 'approved' : 'pending',
                            'created_at' => now()->subDays(rand(1, 15)),
                        ]);
                    }
                }
            }
        }
    }
} 