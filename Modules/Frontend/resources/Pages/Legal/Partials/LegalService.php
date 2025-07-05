<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use App\Services\BaseService;

final class LegalService extends BaseService
{
    /**
     * Get common legal page data with specified content type
     * 
     * @param string $type The type of legal content to retrieve
     * @return array
     */
    public function getLegalPageData(string $type = 'terms'): array
    {
        return [
            'hero' => $this->getHeroSection($type),
            'content' => $this->getLegalContent($type),
            'faq' => $this->getFaqSection($type),
            'related' => $this->getRelatedPolicies($type),
            'stats' => $this->getStats(),
            'contact' => $this->getContactSection()
        ];
    }

    /**
     * Get hero section data
     * 
     * @param string $type
     * @return array
     */
    private function getHeroSection(string $type): array
    {
        $heroData = [
            'terms' => [
                'title' => 'Terms of Service',
                'subtitle' => 'Updated for 2023',
                'description' => 'Our Terms of Service outline the rules and guidelines for using our food delivery platform. These terms constitute a legally binding agreement between you and Restu Food.',
                'image' => '/images/legal/terms-hero.jpg',
                'lastUpdated' => 'January 15, 2023',
                'effectiveDate' => 'February 1, 2023',
                'stats' => [
                    ['label' => 'Countries Served', 'value' => '25+'],
                    ['label' => 'Active Users', 'value' => '2M+'],
                    ['label' => 'Partner Restaurants', 'value' => '5K+'],
                    ['label' => 'Daily Orders', 'value' => '50K+']
                ]
            ],
            'privacy' => [
                'title' => 'Privacy Policy',
                'subtitle' => 'Your Privacy Matters',
                'description' => 'Our Privacy Policy explains how we collect, use, and protect your personal information when you use our services. We are committed to safeguarding your privacy.',
                'image' => '/images/legal/privacy-hero.jpg',
                'lastUpdated' => 'March 10, 2023',
                'effectiveDate' => 'April 1, 2023',
                'stats' => [
                    ['label' => 'Data Protection', 'value' => '100%'],
                    ['label' => 'Security Audits', 'value' => '12/yr'],
                    ['label' => 'Privacy Controls', 'value' => '20+'],
                    ['label' => 'Compliance', 'value' => 'GDPR']
                ]
            ],
            'refund' => [
                'title' => 'Refund Policy',
                'subtitle' => 'Customer Satisfaction',
                'description' => 'Our Refund Policy outlines when and how you can request refunds for orders. We aim to provide fair and transparent refund processes for all customers.',
                'image' => '/images/legal/refund-hero.jpg',
                'lastUpdated' => 'February 20, 2023',
                'effectiveDate' => 'March 1, 2023',
                'stats' => [
                    ['label' => 'Refund Rate', 'value' => '<2%'],
                    ['label' => 'Processing Time', 'value' => '24hrs'],
                    ['label' => 'Customer Rating', 'value' => '4.8/5'],
                    ['label' => 'Success Rate', 'value' => '99%']
                ]
            ],
            'cookie' => [
                'title' => 'Cookie Policy',
                'subtitle' => 'Website Experience',
                'description' => 'Our Cookie Policy explains how we use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content.',
                'image' => '/images/legal/cookie-hero.jpg',
                'lastUpdated' => 'April 5, 2023',
                'effectiveDate' => 'May 1, 2023',
                'stats' => [
                    ['label' => 'Cookie Types', 'value' => '4'],
                    ['label' => 'User Controls', 'value' => '100%'],
                    ['label' => 'Third Parties', 'value' => 'Limited'],
                    ['label' => 'Data Retention', 'value' => '90 days']
                ]
            ],
            'cancellation' => [
                'title' => 'Cancellation Policy',
                'subtitle' => 'Order Management',
                'description' => 'Our Cancellation Policy details the rules and procedures for cancelling orders. We strive to make cancellations fair for both customers and restaurants.',
                'image' => '/images/legal/cancellation-hero.jpg',
                'lastUpdated' => 'May 12, 2023',
                'effectiveDate' => 'June 1, 2023',
                'stats' => [
                    ['label' => 'Time Window', 'value' => '5 min'],
                    ['label' => 'Free Cancels', 'value' => '3/mo'],
                    ['label' => 'Process Time', 'value' => 'Instant'],
                    ['label' => 'Refund Rate', 'value' => '100%']
                ]
            ]
        ];

        return $heroData[$type] ?? $heroData['terms'];
    }

    /**
     * Get legal content for the specified type
     * 
     * @param string $type
     * @return array
     */
    private function getLegalContent(string $type): array
    {
        // Simplified content structure for demo purposes
        $commonDownloads = [
            ['format' => 'PDF', 'url' => '#', 'icon' => 'FileText'],
            ['format' => 'DOCX', 'url' => '#', 'icon' => 'File'],
            ['format' => 'TXT', 'url' => '#', 'icon' => 'FileText']
        ];

        $contents = [
            'terms' => [
                'type' => 'terms',
                'downloadOptions' => $commonDownloads,
                'sections' => [
                    [
                        'title' => 'Acceptance of Terms',
                        'icon' => 'CheckCircle',
                        'content' => 'By accessing or using Restu Food services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.'
                    ],
                    [
                        'title' => 'User Accounts',
                        'icon' => 'User',
                        'content' => 'When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password and for all activities that occur under your account.'
                    ],
                    [
                        'title' => 'Order Placement',
                        'icon' => 'ShoppingBag',
                        'content' => 'Orders placed through our platform constitute a legal offer to purchase products from our partner restaurants. Prices and availability are subject to change without notice.'
                    ],
                    [
                        'title' => 'Delivery Terms',
                        'icon' => 'Truck',
                        'content' => 'Delivery times are estimates and may vary based on restaurant preparation time, traffic conditions, weather, and other factors. We strive to deliver all orders within the estimated timeframe but cannot guarantee exact delivery times.'
                    ],
                    [
                        'title' => 'Intellectual Property',
                        'icon' => 'Copyright',
                        'content' => 'The Restu Food service and its original content, features, and functionality are owned by Restu Food Inc. and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.'
                    ],
                    [
                        'title' => 'Limitation of Liability',
                        'icon' => 'Shield',
                        'content' => 'Restu Food shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.'
                    ]
                ]
            ],
            // Other content types with similar structure...
            'privacy' => [
                'type' => 'privacy',
                'downloadOptions' => $commonDownloads,
                'sections' => [
                    [
                        'title' => 'Information We Collect',
                        'icon' => 'Database',
                        'content' => 'We collect personal information that you provide directly to us, such as your name, address, email address, phone number, payment information, and any other information you choose to provide.'
                    ],
                    [
                        'title' => 'How We Use Your Information',
                        'icon' => 'Activity',
                        'content' => 'We use the information we collect to provide, maintain, and improve our services, process transactions, send communications, and for other purposes with your consent.'
                    ],
                    [
                        'title' => 'Information Sharing',
                        'icon' => 'Share2',
                        'content' => 'We may share your personal information with our partner restaurants, delivery personnel, service providers, and other third parties as necessary to provide our services.'
                    ],
                    [
                        'title' => 'Data Security',
                        'icon' => 'Lock',
                        'content' => 'We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet is 100% secure.'
                    ],
                    [
                        'title' => 'Your Rights',
                        'icon' => 'UserCheck',
                        'content' => 'You have the right to access, correct, update, or request deletion of your personal information. You can exercise these rights by contacting us directly.'
                    ]
                ]
            ],
            'refund' => [
                'type' => 'refund',
                'downloadOptions' => $commonDownloads,
                'sections' => [
                    [
                        'title' => 'Refund Eligibility',
                        'icon' => 'CheckSquare',
                        'content' => 'Refunds may be issued for orders that are incorrect, incomplete, damaged, or of poor quality. Refund requests must be submitted within 24 hours of receiving the order.'
                    ],
                    [
                        'title' => 'Refund Process',
                        'icon' => 'RefreshCw',
                        'content' => 'To request a refund, use the "Help" section in the app or website. Include your order number, the reason for the refund, and any supporting evidence (e.g., photos of the issue).'
                    ],
                    [
                        'title' => 'Refund Methods',
                        'icon' => 'CreditCard',
                        'content' => 'Refunds will be processed using the original payment method. The time it takes for the refund to appear in your account depends on your payment provider (typically 3-7 business days).'
                    ],
                    [
                        'title' => 'Non-Refundable Items',
                        'icon' => 'XCircle',
                        'content' => 'Special order items, customized meals, and delivery fees for orders that have been delivered may not be eligible for refunds.'
                    ]
                ]
            ],
            'cookie' => [
                'type' => 'cookie',
                'downloadOptions' => $commonDownloads,
                'sections' => [
                    [
                        'title' => 'What Are Cookies',
                        'icon' => 'Cookie',
                        'content' => 'Cookies are small text files stored on your device that help websites remember user preferences and behavior. They enable us to provide certain features and improve your user experience.'
                    ],
                    [
                        'title' => 'Types of Cookies We Use',
                        'icon' => 'List',
                        'content' => 'We use essential cookies (necessary for site functionality), functional cookies (remember preferences), analytical cookies (understand usage patterns), and advertising cookies (display relevant ads).'
                    ],
                    [
                        'title' => 'Cookie Management',
                        'icon' => 'Settings',
                        'content' => 'You can manage cookie preferences through your browser settings. Most browsers allow you to block or delete cookies. Note that blocking certain cookies may impact site functionality.'
                    ],
                    [
                        'title' => 'Third-Party Cookies',
                        'icon' => 'ExternalLink',
                        'content' => 'Our website may use third-party services that set their own cookies. We do not control these cookies. Please refer to the respective privacy policies of these third parties.'
                    ]
                ]
            ],
            'cancellation' => [
                'type' => 'cancellation',
                'downloadOptions' => $commonDownloads,
                'sections' => [
                    [
                        'title' => 'Cancellation Window',
                        'icon' => 'Clock',
                        'content' => 'You may cancel an order free of charge within 5 minutes of placing it. After 5 minutes, cancellation is subject to the order status and may incur fees.'
                    ],
                    [
                        'title' => 'Cancellation Process',
                        'icon' => 'XOctagon',
                        'content' => 'To cancel an order, go to "My Orders" in the app, select the order you wish to cancel, and click the "Cancel Order" button. You will receive a confirmation notification.'
                    ],
                    [
                        'title' => 'Cancellation Fees',
                        'icon' => 'DollarSign',
                        'content' => 'If the restaurant has started preparing your food, a partial cancellation fee may apply. If the order is already out for delivery, the full amount will be charged.'
                    ],
                    [
                        'title' => 'Repeated Cancellations',
                        'icon' => 'AlertTriangle',
                        'content' => 'Frequent cancellations may result in account restrictions. Users are allowed 3 free cancellations per month; additional cancellations may incur service fees.'
                    ]
                ]
            ]
        ];

        return $contents[$type] ?? $contents['terms'];
    }

    /**
     * Get FAQ data for the specified legal document type
     * 
     * @param string $type
     * @return array
     */
    private function getFaqSection(string $type): array
    {
        $faqs = [
            'terms' => [
                'title' => 'Terms of Service FAQ',
                'description' => 'Common questions about our Terms of Service',
                'categories' => [
                    [
                        'name' => 'General',
                        'questions' => [
                            [
                                'question' => 'How often do you update the Terms of Service?',
                                'answer' => 'We review and update our Terms of Service periodically to ensure they comply with applicable laws and reflect our current practices. We will notify users of any significant changes.'
                            ],
                            [
                                'question' => 'What happens if I violate the Terms of Service?',
                                'answer' => 'Violations of our Terms of Service may result in warnings, temporary suspension, or permanent termination of your account, depending on the severity and frequency of the violations.'
                            ],
                            [
                                'question' => 'Can I use Restu Food for business orders?',
                                'answer' => 'Yes, we offer business accounts for corporate orders. However, business use is subject to additional terms and conditions outlined in our Business Terms of Service.'
                            ]
                        ]
                    ],
                    [
                        'name' => 'Account Management',
                        'questions' => [
                            [
                                'question' => 'Can I have multiple accounts?',
                                'answer' => 'Each user should maintain only one account. Multiple accounts per user may be flagged and subject to termination.'
                            ],
                            [
                                'question' => 'How do I delete my account?',
                                'answer' => 'You can delete your account by going to Account Settings and selecting "Delete Account". Note that deletion is permanent and cannot be undone.'
                            ]
                        ]
                    ]
                ]
            ],
            // Add similar structures for other policy types...
            'privacy' => [
                'title' => 'Privacy Policy FAQ',
                'description' => 'Common questions about our Privacy Policy',
                'categories' => [
                    [
                        'name' => 'Data Collection',
                        'questions' => [
                            [
                                'question' => 'What personal data do you collect?',
                                'answer' => 'We collect information such as your name, email address, phone number, delivery address, payment information, order history, and app usage data.'
                            ],
                            [
                                'question' => 'Do you sell my data to third parties?',
                                'answer' => 'No, we do not sell your personal data to third parties. We may share your information with restaurants and delivery partners as necessary to fulfill your orders.'
                            ]
                        ]
                    ],
                    [
                        'name' => 'Data Rights',
                        'questions' => [
                            [
                                'question' => 'How can I access my data?',
                                'answer' => 'You can request a copy of your personal data by contacting our Privacy Team or through the Privacy Settings in your account.'
                            ],
                            [
                                'question' => 'How do I opt out of marketing communications?',
                                'answer' => 'You can opt out of marketing communications by updating your communication preferences in your account settings or by clicking the "unsubscribe" link in our emails.'
                            ]
                        ]
                    ]
                ]
            ],
            'refund' => [
                'title' => 'Refund Policy FAQ',
                'description' => 'Common questions about our Refund Policy',
                'categories' => [
                    [
                        'name' => 'Refund Process',
                        'questions' => [
                            [
                                'question' => 'How long do refunds take to process?',
                                'answer' => 'We process refund requests within 24 hours. Once approved, funds will appear in your account within 3-7 business days, depending on your payment provider.'
                            ],
                            [
                                'question' => 'Can I get a partial refund?',
                                'answer' => 'Yes, partial refunds are possible if only part of your order was incorrect or unsatisfactory. Please specify which items were problematic when requesting your refund.'
                            ]
                        ]
                    ],
                    [
                        'name' => 'Eligibility',
                        'questions' => [
                            [
                                'question' => 'What if my food arrived cold?',
                                'answer' => 'If your food arrived significantly colder than it should be, you can request a refund or redelivery. Please provide details and submit your request within 1 hour of delivery.'
                            ],
                            [
                                'question' => 'Can I get a refund for delivery delays?',
                                'answer' => 'If your delivery is significantly delayed (over 30 minutes past the estimated time), you may be eligible for delivery fee refund or compensation in the form of credit.'
                            ]
                        ]
                    ]
                ]
            ],
            'cookie' => [
                'title' => 'Cookie Policy FAQ',
                'description' => 'Common questions about our Cookie Policy',
                'categories' => [
                    [
                        'name' => 'Cookie Basics',
                        'questions' => [
                            [
                                'question' => 'Can I use the site without accepting cookies?',
                                'answer' => 'Essential cookies are required for the site to function properly. However, you can disable non-essential cookies and still use most features of our site.'
                            ],
                            [
                                'question' => 'How do I delete cookies?',
                                'answer' => 'You can delete cookies through your browser settings. Each browser has different procedures for managing cookies. Please check your browser\'s help section for specific instructions.'
                            ]
                        ]
                    ],
                    [
                        'name' => 'Cookie Types',
                        'questions' => [
                            [
                                'question' => 'What are tracking cookies?',
                                'answer' => 'Tracking cookies collect information about your browsing behavior to help us understand how users interact with our site and to deliver personalized content and advertisements.'
                            ],
                            [
                                'question' => 'Are cookies safe?',
                                'answer' => 'Cookies themselves are harmless text files and cannot contain viruses or malware. However, they can be used to track your online activity, which is why we provide options to manage cookie preferences.'
                            ]
                        ]
                    ]
                ]
            ],
            'cancellation' => [
                'title' => 'Cancellation Policy FAQ',
                'description' => 'Common questions about our Cancellation Policy',
                'categories' => [
                    [
                        'name' => 'Cancellation Timing',
                        'questions' => [
                            [
                                'question' => 'What happens if I cancel after food preparation has started?',
                                'answer' => 'If the restaurant has already started preparing your food, you may be charged a partial fee to compensate the restaurant for their time and ingredients.'
                            ],
                            [
                                'question' => 'Can I cancel an order that\'s already being delivered?',
                                'answer' => 'Once an order is out for delivery, it cannot be cancelled. You can refuse the delivery, but you will still be charged the full amount for the order and delivery.'
                            ]
                        ]
                    ],
                    [
                        'name' => 'Cancellation Limits',
                        'questions' => [
                            [
                                'question' => 'Is there a limit to how many orders I can cancel?',
                                'answer' => 'Yes, users are allowed 3 free cancellations per month. Additional cancellations may result in service fees or account restrictions.'
                            ],
                            [
                                'question' => 'What if I need to cancel for an emergency?',
                                'answer' => 'For emergency situations, please contact our customer support team directly. We evaluate such cases individually and may waive cancellation fees at our discretion.'
                            ]
                        ]
                    ]
                ]
            ]
        ];

        return $faqs[$type] ?? $faqs['terms'];
    }

    /**
     * Get related policies data
     * 
     * @param string $currentType
     * @return array
     */
    private function getRelatedPolicies(string $currentType): array
    {
        $policies = [
            'terms' => [
                'title' => 'Related Policies',
                'description' => 'Other important policies you should read',
                'policies' => [
                    [
                        'name' => 'Privacy Policy',
                        'icon' => 'Shield',
                        'description' => 'How we protect and use your data',
                        'link' => route('frontend.legal.privacy')
                    ],
                    [
                        'name' => 'Refund Policy',
                        'icon' => 'RefreshCw',
                        'description' => 'Our rules for refunds and returns',
                        'link' => route('frontend.legal.refund')
                    ],
                    [
                        'name' => 'Cookie Policy',
                        'icon' => 'Cookie',
                        'description' => 'How we use cookies on our site',
                        'link' => route('frontend.legal.cookie')
                    ],
                    [
                        'name' => 'Cancellation Policy',
                        'icon' => 'XCircle',
                        'description' => 'Rules for cancelling orders',
                        'link' => route('frontend.legal.cancellation')
                    ]
                ]
            ],
            'privacy' => [
                'title' => 'Related Policies',
                'description' => 'Other important policies you should read',
                'policies' => [
                    [
                        'name' => 'Terms of Service',
                        'icon' => 'FileText',
                        'description' => 'Rules for using our platform',
                        'link' => route('frontend.legal.terms')
                    ],
                    [
                        'name' => 'Cookie Policy',
                        'icon' => 'Cookie',
                        'description' => 'How we use cookies on our site',
                        'link' => route('frontend.legal.cookie')
                    ],
                    [
                        'name' => 'Refund Policy',
                        'icon' => 'RefreshCw',
                        'description' => 'Our rules for refunds and returns',
                        'link' => route('frontend.legal.refund')
                    ],
                    [
                        'name' => 'Cancellation Policy',
                        'icon' => 'XCircle',
                        'description' => 'Rules for cancelling orders',
                        'link' => route('frontend.legal.cancellation')
                    ]
                ]
            ]
        ];

        // Generate related policies for other types
        $allTypes = ['terms', 'privacy', 'refund', 'cookie', 'cancellation'];
        $typeNames = [
            'terms' => 'Terms of Service',
            'privacy' => 'Privacy Policy',
            'refund' => 'Refund Policy',
            'cookie' => 'Cookie Policy',
            'cancellation' => 'Cancellation Policy'
        ];
        $typeIcons = [
            'terms' => 'FileText',
            'privacy' => 'Shield',
            'refund' => 'RefreshCw',
            'cookie' => 'Cookie',
            'cancellation' => 'XCircle'
        ];
        $typeDescriptions = [
            'terms' => 'Rules for using our platform',
            'privacy' => 'How we protect and use your data',
            'refund' => 'Our rules for refunds and returns',
            'cookie' => 'How we use cookies on our site',
            'cancellation' => 'Rules for cancelling orders'
        ];

        // Auto-generate related policies for types not explicitly defined
        if (!isset($policies[$currentType])) {
            $relatedPolicies = [];
            foreach ($allTypes as $type) {
                if ($type !== $currentType) {
                    $relatedPolicies[] = [
                        'name' => $typeNames[$type],
                        'icon' => $typeIcons[$type],
                        'description' => $typeDescriptions[$type],
                        'link' => route("frontend.legal.{$type}")
                    ];
                }
            }

            $policies[$currentType] = [
                'title' => 'Related Policies',
                'description' => 'Other important policies you should read',
                'policies' => $relatedPolicies
            ];
        }

        return $policies[$currentType];
    }

    /**
     * Get stats for the legal pages
     * 
     * @return array
     */
    private function getStats(): array
    {
        return [
            'title' => 'Our Commitment',
            'stats' => [
                [
                    'label' => 'Data Protection',
                    'value' => '100%',
                    'icon' => 'Shield',
                    'description' => 'Full compliance with data protection laws'
                ],
                [
                    'label' => 'User Privacy',
                    'value' => 'Guaranteed',
                    'icon' => 'Lock',
                    'description' => 'We never sell your personal data'
                ],
                [
                    'label' => 'Transparency',
                    'value' => 'Full',
                    'icon' => 'Eye',
                    'description' => 'Clear policies with no hidden terms'
                ],
                [
                    'label' => 'Support Response',
                    'value' => '<24hrs',
                    'icon' => 'Clock',
                    'description' => 'Quick resolution to your concerns'
                ]
            ]
        ];
    }

    /**
     * Get contact information section
     * 
     * @return array
     */
    private function getContactSection(): array
    {
        return [
            'title' => 'Legal Inquiries',
            'description' => 'If you have any questions about our policies, please contact us.',
            'methods' => [
                [
                    'title' => 'Email',
                    'icon' => 'Mail',
                    'value' => 'legal@restufood.com',
                    'description' => 'For general legal questions',
                    'link' => 'mailto:legal@restufood.com',
                    'action' => 'Send Email'
                ],
                [
                    'title' => 'Privacy Concerns',
                    'icon' => 'ShieldAlert',
                    'value' => 'privacy@restufood.com',
                    'description' => 'For data protection and privacy issues',
                    'link' => 'mailto:privacy@restufood.com',
                    'action' => 'Contact Privacy Team'
                ],
                [
                    'title' => 'Support Center',
                    'icon' => 'HelpCircle',
                    'value' => 'Help & FAQ Center',
                    'description' => 'Find answers to common questions',
                    'link' => route('frontend.support'),
                    'action' => 'Visit Support'
                ]
            ]
        ];
    }
} 