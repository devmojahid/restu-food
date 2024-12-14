import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Briefcase,
    MapPin,
    Clock,
    Users,
    Search,
    Building2,
    GraduationCap,
    Laptop,
    Coffee,
    Heart,
    DollarSign,
    Plane,
    Sparkles,
    ArrowRight,
    ChevronRight,
    Filter,
    Calendar,
    BadgeCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

const JobCard = ({ job, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const benefitIcons = {
        salary: DollarSign,
        health: Heart,
        vacation: Plane,
        education: GraduationCap,
        remote: Laptop,
        wellness: Coffee
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className={cn(
                    "group relative",
                    "bg-white dark:bg-gray-800",
                    "rounded-2xl overflow-hidden",
                    "border border-gray-100 dark:border-gray-700",
                    "shadow-lg hover:shadow-xl",
                    "transition-all duration-300",
                    "p-6"
                )}
            >
                {/* Department Badge */}
                <div className="flex items-center justify-between mb-4">
                    <Badge 
                        variant="secondary" 
                        className="bg-primary/10 text-primary"
                    >
                        {job.department}
                    </Badge>
                    {job.isUrgent && (
                        <Badge variant="secondary" className="bg-red-500 text-white">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Urgent
                        </Badge>
                    )}
                </div>

                {/* Job Title & Location */}
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {job.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {job.type}
                        </div>
                    </div>
                </div>

                {/* Key Requirements */}
                <div className="space-y-2 mb-6">
                    {job.keyRequirements?.slice(0, 3).map((req, idx) => (
                        <div 
                            key={idx}
                            className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                            <BadgeCheck className="w-4 h-4 text-primary mt-0.5" />
                            <span>{req}</span>
                        </div>
                    ))}
                </div>

                {/* Benefits Preview */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                    {Object.entries(job.benefits || {}).slice(0, 3).map(([key, value]) => {
                        const Icon = benefitIcons[key] || Coffee;
                        return (
                            <div 
                                key={key}
                                className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30 
                                       text-center"
                            >
                                <Icon className="w-4 h-4 mx-auto mb-1 text-primary" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {value}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowDetails(true)}
                    >
                        View Details
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                        variant="default"
                        className="flex-1"
                        onClick={() => window.location.href = `/careers/apply/${job.id}`}
                    >
                        Apply Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-primary scale-105 opacity-0 
                             group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
            </motion.div>

            {/* Job Details Modal */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{job.title}</DialogTitle>
                        <DialogDescription>
                            {job.department} • {job.location} • {job.type}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Job Description */}
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Job Description</h4>
                            <p className="text-gray-600 dark:text-gray-400">
                                {job.description}
                            </p>
                        </div>

                        {/* Requirements */}
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Requirements</h4>
                            <ul className="space-y-2">
                                {job.requirements?.map((req, idx) => (
                                    <li 
                                        key={idx}
                                        className="flex items-start space-x-2 text-gray-600 dark:text-gray-400"
                                    >
                                        <BadgeCheck className="w-4 h-4 text-primary mt-1" />
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Benefits */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Benefits</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(job.benefits || {}).map(([key, value]) => {
                                    const Icon = benefitIcons[key] || Coffee;
                                    return (
                                        <div 
                                            key={key}
                                            className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 
                                                   border border-gray-100 dark:border-gray-700"
                                        >
                                            <Icon className="w-6 h-6 text-primary mb-2" />
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {value}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                                {key}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Application Process */}
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Application Process</h4>
                            <div className="space-y-4">
                                {job.applicationProcess?.map((step, idx) => (
                                    <div 
                                        key={idx}
                                        className="flex items-start space-x-3"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary 
                                                      flex items-center justify-center flex-shrink-0 mt-1">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-900 dark:text-white">
                                                {step.title}
                                            </h5>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowDetails(false)}
                            >
                                Close
                            </Button>
                            <Button
                                onClick={() => window.location.href = `/careers/apply/${job.id}`}
                            >
                                Apply for this Position
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

const JobSearch = ({ onSearch, onFilterChange }) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search positions..."
                    className="pl-10"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
            <Select onValueChange={onFilterChange} defaultValue="all">
                <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

const Careers = ({ data }) => {
    const [filteredJobs, setFilteredJobs] = useState(data.openings);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');

    // Handle search and filtering
    useEffect(() => {
        let filtered = data.openings;
        
        if (searchQuery) {
            filtered = filtered.filter(job => 
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.department.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterDepartment !== 'all') {
            filtered = filtered.filter(job => 
                job.department.toLowerCase() === filterDepartment.toLowerCase()
            );
        }

        setFilteredJobs(filtered);
    }, [searchQuery, filterDepartment, data.openings]);

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 
                             rounded-full blur-3xl opacity-50 dark:opacity-30" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 
                             rounded-full blur-3xl opacity-50 dark:opacity-30" />
            </div>

            <div className="container mx-auto px-4 relative">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full 
                                bg-primary/10 dark:bg-primary/20 text-primary mb-6"
                    >
                        <Briefcase className="w-8 h-8" />
                    </motion.div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {data.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {data.description}
                    </p>
                </motion.div>

                {/* Benefits Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {[
                        {
                            icon: DollarSign,
                            title: 'Competitive Salary',
                            description: 'Industry-leading compensation packages'
                        },
                        {
                            icon: Heart,
                            title: 'Health Benefits',
                            description: 'Comprehensive medical, dental & vision'
                        },
                        {
                            icon: Plane,
                            title: 'Flexible PTO',
                            description: 'Take time off when you need it'
                        },
                        {
                            icon: GraduationCap,
                            title: 'Learning Budget',
                            description: 'Annual budget for skill development'
                        }
                    ].map((benefit, index) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative p-6 rounded-2xl",
                                "bg-white dark:bg-gray-800",
                                "border border-gray-100 dark:border-gray-700",
                                "group hover:shadow-lg",
                                "transition-all duration-300"
                            )}
                        >
                            <div className={cn(
                                "inline-flex items-center justify-center",
                                "w-12 h-12 rounded-xl mb-4",
                                "bg-primary/10 text-primary",
                                "group-hover:scale-110",
                                "transition-transform duration-300"
                            )}>
                                <benefit.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {benefit.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Search and Filters */}
                <JobSearch
                    onSearch={setSearchQuery}
                    onFilterChange={setFilterDepartment}
                />

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredJobs.map((job, index) => (
                        <JobCard 
                            key={job.id || `job-${index}`}
                            job={job} 
                            index={index}
                        />
                    ))}
                </div>

                {/* No Results Message */}
                {filteredJobs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No Positions Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Try adjusting your search or filter criteria
                        </p>
                    </motion.div>
                )}

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Don't see a position that matches your skills?
                    </p>
                    <Button
                        size="lg"
                        className="rounded-full"
                        onClick={() => window.location.href = '/careers/contact'}
                    >
                        Contact Our Recruiting Team
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default Careers; 