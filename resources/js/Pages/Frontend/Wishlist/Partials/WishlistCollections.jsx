import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    Calendar,
    Leaf,
    Gift,
    Clock,
    Plus,
    Pencil,
    Trash2,
    Check,
    X,
    FolderPlus,
    Folder
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/Components/ui/use-toast';

const WishlistCollections = ({
    collections = [],
    activeCollection,
    setActiveCollection
}) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [editingCollection, setEditingCollection] = useState(null);
    const { toast } = useToast();

    // Get the appropriate icon for a collection
    const getCollectionIcon = (iconName) => {
        const icons = {
            'heart': Heart,
            'calendar': Calendar,
            'leaf': Leaf,
            'gift': Gift,
            'clock': Clock,
            'folder': Folder
        };

        const IconComponent = icons[iconName] || Folder;
        return IconComponent;
    };

    // Get the appropriate color class for a collection
    const getColorClass = (color) => {
        const colorClasses = {
            'red': 'text-red-500',
            'blue': 'text-blue-500',
            'green': 'text-green-500',
            'purple': 'text-purple-500',
            'orange': 'text-orange-500',
            'pink': 'text-pink-500'
        };

        return colorClasses[color] || 'text-primary';
    };

    // Handle creating a new collection
    const handleCreateCollection = () => {
        if (!newCollectionName.trim()) {
            toast({
                title: "Error",
                description: "Collection name cannot be empty",
                variant: "destructive"
            });
            return;
        }

        // In a real app, you'd make an API call to create a collection
        toast({
            title: "Success",
            description: "Collection created successfully"
        });

        setNewCollectionName('');
        setIsCreating(false);
    };

    // Handle editing a collection
    const handleEditCollection = () => {
        if (!editingCollection.name.trim()) {
            toast({
                title: "Error",
                description: "Collection name cannot be empty",
                variant: "destructive"
            });
            return;
        }

        // In a real app, you'd make an API call to update a collection
        toast({
            title: "Success",
            description: "Collection updated successfully"
        });

        setEditingCollection(null);
        setIsEditing(false);
    };

    // Handle deleting a collection
    const handleDeleteCollection = (collection) => {
        // In a real app, you'd make an API call to delete a collection
        toast({
            title: "Success",
            description: "Collection deleted successfully"
        });

        if (activeCollection?.id === collection.id) {
            setActiveCollection(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Your Collections
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={() => {
                        setIsCreating(true);
                        setIsEditing(false);
                        setEditingCollection(null);
                    }}
                >
                    <FolderPlus className="w-4 h-4 mr-2" />
                    New
                </Button>
            </div>

            {/* New Collection Form */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <div className="mb-2">
                                <Input
                                    placeholder="Collection name"
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    className="mb-2"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    size="sm"
                                    onClick={handleCreateCollection}
                                    className="w-full"
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Create
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setNewCollectionName('');
                                    }}
                                    className="w-full"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Collections List */}
            <div className="space-y-2">
                {/* All Collections Option */}
                <button
                    className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg",
                        "transition-colors duration-200",
                        "hover:bg-gray-100 dark:hover:bg-gray-800",
                        activeCollection === null
                            ? "bg-primary/10 text-primary"
                            : "text-gray-700 dark:text-gray-300"
                    )}
                    onClick={() => setActiveCollection(null)}
                >
                    <div className="flex items-center">
                        <Heart className="w-5 h-5 mr-3" />
                        <span className="font-medium">All Items</span>
                    </div>
                    <span className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                        {collections.reduce((acc, col) => acc + (col.count || 0), 0)}
                    </span>
                </button>

                {/* Collection Items */}
                <AnimatePresence initial={false}>
                    {collections.map((collection) => {
                        const IconComponent = getCollectionIcon(collection.icon);
                        const isEditing = editingCollection?.id === collection.id;

                        return (
                            <motion.div
                                key={collection.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                {isEditing ? (
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div className="mb-2">
                                            <Input
                                                placeholder="Collection name"
                                                value={editingCollection.name}
                                                onChange={(e) => setEditingCollection({
                                                    ...editingCollection,
                                                    name: e.target.value
                                                })}
                                                className="mb-2"
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                size="sm"
                                                onClick={handleEditCollection}
                                                className="w-full"
                                            >
                                                <Check className="w-4 h-4 mr-2" />
                                                Save
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setEditingCollection(null);
                                                }}
                                                className="w-full"
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={cn(
                                            "w-full flex items-center justify-between p-3 rounded-lg",
                                            "transition-colors duration-200",
                                            "hover:bg-gray-100 dark:hover:bg-gray-800",
                                            activeCollection?.id === collection.id
                                                ? "bg-primary/10 text-primary"
                                                : "text-gray-700 dark:text-gray-300"
                                        )}
                                    >
                                        <div
                                            className="flex items-center flex-grow cursor-pointer"
                                            onClick={() => setActiveCollection(collection)}
                                        >
                                            <IconComponent className={cn(
                                                "w-5 h-5 mr-3",
                                                getColorClass(collection.color)
                                            )} />
                                            <span className="font-medium">{collection.name}</span>
                                        </div>

                                        <div className="flex items-center space-x-1">
                                            <span className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full mr-2">
                                                {collection.count || 0}
                                            </span>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                                onClick={() => {
                                                    setEditingCollection(collection);
                                                    setIsEditing(true);
                                                    setIsCreating(false);
                                                }}
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 rounded-full hover:bg-red-100 hover:text-red-500 
                                                       dark:hover:bg-red-900/30 dark:hover:text-red-400"
                                                onClick={() => handleDeleteCollection(collection)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {collections.length === 0 && !isCreating && (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No collections created yet</p>
                        <Button
                            variant="link"
                            size="sm"
                            className="mt-1"
                            onClick={() => setIsCreating(true)}
                        >
                            Create your first collection
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistCollections; 