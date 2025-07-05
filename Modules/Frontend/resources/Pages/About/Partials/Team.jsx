import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Linkedin, 
    Twitter, 
    Mail, 
    Phone,
    ChevronRight,
    Users,
    Plus,
    X,
    Globe,
    MapPin,
    Calendar,
    Award,
    BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Badge } from "@/Components/ui/badge";

const TeamMemberCard = ({ member }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className={cn(
                    "group relative",
                    "bg-white dark:bg-gray-800",
                    "rounded-2xl overflow-hidden",
                    "shadow-lg hover:shadow-xl",
                    "transition-all duration-300"
                )}
            >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Hover Content */}
                    <motion.div
                        initial={false}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                        className="absolute inset-0 flex flex-col justify-end p-6 text-white"
                    >
                        {/* Social Links */}
                        <div className="flex space-x-3 mb-4">
                            {member.social?.linkedin && (
                                <motion.a
                                    href={member.social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary transition-colors"
                                >
                                    <Linkedin className="w-4 h-4" />
                                </motion.a>
                            )}
                            {member.social?.twitter && (
                                <motion.a
                                    href={member.social.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary transition-colors"
                                >
                                    <Twitter className="w-4 h-4" />
                                </motion.a>
                            )}
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(true)}
                            className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                        >
                            View Profile
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {member.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {member.role}
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="px-6 pb-6 grid grid-cols-2 gap-4 text-center">
                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.experience}+
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Years Exp.
                        </div>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.projects}+
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Projects
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Detailed Profile Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Team Member Profile</DialogTitle>
                        <DialogDescription>
                            Detailed information about {member.name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Image Section */}
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Content Section */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {member.name}
                                </h3>
                                <p className="text-primary font-medium">{member.role}</p>
                            </div>

                            <div className="space-y-4">
                                {/* Bio */}
                                <p className="text-gray-600 dark:text-gray-400">
                                    {member.bio}
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Joined {member.joined}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                        <div className="flex items-center space-x-2">
                                            <Award className="w-4 h-4 text-primary" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {member.experience}+ Years Exp.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Expertise
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {member.skills?.map((skill) => (
                                            <Badge key={skill} variant="secondary">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="space-y-2">
                                    {member.email && (
                                        <a
                                            href={`mailto:${member.email}`}
                                            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
                                        >
                                            <Mail className="w-4 h-4" />
                                            <span>{member.email}</span>
                                        </a>
                                    )}
                                    {member.phone && (
                                        <a
                                            href={`tel:${member.phone}`}
                                            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
                                        >
                                            <Phone className="w-4 h-4" />
                                            <span>{member.phone}</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

const Team = ({ data }) => {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {data.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {data.description}
                    </p>
                </motion.div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {data.members.map((member, index) => (
                        <TeamMemberCard 
                            key={member.name} 
                            member={member}
                        />
                    ))}
                </div>

                {/* Join the Team CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center"
                >
                    <Button
                        size="lg"
                        className="rounded-full"
                        onClick={() => window.location.href = '/careers'}
                    >
                        <Users className="w-5 h-5 mr-2" />
                        Join Our Team
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default Team; 