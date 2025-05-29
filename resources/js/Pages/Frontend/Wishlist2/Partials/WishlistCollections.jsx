import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FolderHeart,
    FolderPlus,
    FolderX,
    Heart,
    ChevronDown,
    ChevronRight,
    MoreHorizontal,
    Edit,
    Trash,
    Search,
    X,
    Save,
    PlusCircle
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible';
import { router } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';

const WishlistCollections = ({
    collections = [],
    activeCollection,
    setActiveCollection
}) => {
    const { toast } = useToast();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [newCollectionDialogOpen, setNewCollectionDialogOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [collectionToDelete, setCollectionToDelete] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Handle collection selection
    const handleSelectCollection = (collectionId) => {
        if (activeCollection === collectionId) {
            setActiveCollection(null);
        } else {
            setActiveCollection(collectionId);
        }
    };

    // Handle create new collection
    const handleCreateCollection = () => {
        if (!newCollectionName.trim()) {
            toast({
                title: "Error",
                description: "Please enter a collection name",
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);

        // Simulate API call to create collection
        router.post('/wishlist2/manage-collection', {
            action: 'create',
            name: newCollectionName
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Collection created",
                    description: `"${newCollectionName}" has been created`,
                });
                setNewCollectionName('');
                setNewCollectionDialogOpen(false);
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Could not create collection. Please try again.",
                    variant: "destructive",
                });
            },
            onFinish: () => {
                setIsProcessing(false);
            }
        });
    };

    // Handle edit collection name
    const handleUpdateCollection = (collectionId, newName) => {
        if (!newName.trim()) {
            toast({
                title: "Error",
                description: "Please enter a collection name",
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);

        // Simulate API call to update collection
        router.post('/wishlist2/manage-collection', {
            action: 'update',
            collection_id: collectionId,
            name: newName
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Collection updated",
                    description: `Collection has been renamed to "${newName}"`,
                });
                setEditingCollection(null);
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Could not update collection. Please try again.",
                    variant: "destructive",
                });
            },
            onFinish: () => {
                setIsProcessing(false);
            }
        });
    };

    // Handle delete collection
    const handleDeleteCollection = (collectionId) => {
        setIsProcessing(true);

        // Simulate API call to delete collection
        router.post('/wishlist2/manage-collection', {
            action: 'delete',
            collection_id: collectionId
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Collection deleted",
                    description: "Collection has been deleted",
                });
                setConfirmDeleteOpen(false);

                // If the deleted collection was active, reset the active collection
                if (activeCollection === collectionId) {
                    setActiveCollection(null);
                }
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Could not delete collection. Please try again.",
                    variant: "destructive",
                });
            },
            onFinish: () => {
                setIsProcessing(false);
                setCollectionToDelete(null);
            }
        });
    };

    return (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
            {/* Header */}
            <Collapsible
                open={!isCollapsed}
                onOpenChange={setIsCollapsed}
                className="space-y-4"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Collections</h3>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                            onClick={() => setNewCollectionDialogOpen(true)}
                        >
                            <FolderPlus className="h-4 w-4" />
                        </Button>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                {isCollapsed ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronUp className="h-4 w-4" />
                                )}
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                </div>

                <CollapsibleContent className="space-y-2">
                    {/* All Items (default) */}
                    <div
                        className={cn(
                            "flex items-center justify-between rounded-md px-3 py-2 cursor-pointer transition-colors",
                            activeCollection === null
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-primary/5"
                        )}
                        onClick={() => setActiveCollection(null)}
                    >
                        <div className="flex items-center">
                            <Heart className="mr-2 h-4 w-4" />
                            <span>All Items</span>
                        </div>
                        <div className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                            {collections.reduce((total, collection) => total + collection.item_count, 0)}
                        </div>
                    </div>

                    {/* Collection List */}
                    {collections.length > 0 ? (
                        collections.map((collection) => (
                            <div key={collection.id} className="relative">
                                {editingCollection === collection.id ? (
                                    <div className="flex items-center space-x-2 rounded-md border px-2 py-1 bg-background">
                                        <Input
                                            value={collection.name}
                                            onChange={(e) => {
                                                const updatedCollections = collections.map(c =>
                                                    c.id === collection.id
                                                        ? { ...c, name: e.target.value }
                                                        : c
                                                );
                                                // We don't need to update the state here as it will be updated by the parent
                                            }}
                                            className="h-8 text-sm"
                                            placeholder="Collection name"
                                            autoFocus
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full hover:bg-green-100 text-green-600"
                                            onClick={() => handleUpdateCollection(collection.id, collection.name)}
                                            disabled={isProcessing}
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full hover:bg-red-100 text-red-600"
                                            onClick={() => setEditingCollection(null)}
                                            disabled={isProcessing}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div
                                        className={cn(
                                            "flex items-center justify-between rounded-md px-3 py-2 cursor-pointer transition-colors group",
                                            activeCollection === collection.id
                                                ? "bg-primary/10 text-primary"
                                                : "hover:bg-primary/5"
                                        )}
                                        onClick={() => handleSelectCollection(collection.id)}
                                    >
                                        <div className="flex items-center overflow-hidden">
                                            <FolderHeart className="mr-2 h-4 w-4 flex-shrink-0" />
                                            <span className="truncate">{collection.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <div className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                                                {collection.item_count}
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[160px]">
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingCollection(collection.id);
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Rename
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCollectionToDelete(collection.id);
                                                            setConfirmDeleteOpen(true);
                                                        }}
                                                    >
                                                        <Trash className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="py-2 text-center text-sm text-gray-500">
                            <p>No collections yet</p>
                            <Button
                                variant="link"
                                size="sm"
                                className="mt-1 text-primary"
                                onClick={() => setNewCollectionDialogOpen(true)}
                            >
                                <PlusCircle className="mr-1 h-3 w-3" />
                                Create one now
                            </Button>
                        </div>
                    )}
                </CollapsibleContent>
            </Collapsible>

            {/* New Collection Dialog */}
            <Dialog open={newCollectionDialogOpen} onOpenChange={setNewCollectionDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Collection</DialogTitle>
                        <DialogDescription>
                            Create a new collection to organize your saved items.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                            placeholder="Collection name (e.g., Favorites, Try Later)"
                            className="w-full"
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setNewCollectionDialogOpen(false)}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateCollection}
                            disabled={isProcessing || !newCollectionName.trim()}
                        >
                            {isProcessing ? 'Creating...' : 'Create Collection'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Collection</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this collection?
                            Items will remain in your wishlist.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDeleteOpen(false)}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleDeleteCollection(collectionToDelete)}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Deleting...' : 'Delete Collection'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// ChevronUp Icon Component
const ChevronUp = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="18 15 12 9 6 15" />
    </svg>
);

export default WishlistCollections; 