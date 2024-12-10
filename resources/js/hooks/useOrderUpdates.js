import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

export const useOrderUpdates = () => {
    const { auth } = usePage().props;

    useEffect(() => {
        // Listen for new orders (Restaurant & Admin)
        if (auth.user?.roles?.some(role => ['Admin', 'Restaurant'].includes(role.name))) {
            window.Echo.private('notifications')
                .listen('NewOrder', (e) => {
                    toast.info('New Order Received', {
                        description: `Order #${e.order.id} received from ${e.order.customer.name}`,
                        action: {
                            label: 'View',
                            onClick: () => window.location.href = `/app/orders/${e.order.id}`
                        }
                    });
                });
        }

        // Listen for order status updates (Customer)
        if (auth.user) {
            window.Echo.private(`user.${auth.user.id}`)
                .listen('OrderStatusUpdated', (e) => {
                    toast.info('Order Status Updated', {
                        description: `Order #${e.order.id} status changed to ${e.order.status}`,
                        action: {
                            label: 'View',
                            onClick: () => window.location.href = `/app/orders/${e.order.id}`
                        }
                    });
                });
        }

        // Listen for delivery assignments (Delivery Staff)
        if (auth.user?.roles?.some(role => role.name === 'Delivery Staff')) {
            window.Echo.private('delivery')
                .listen('OrderDeliveryAssigned', (e) => {
                    toast.info('New Delivery Assignment', {
                        description: `New delivery assigned for order #${e.order.id}`,
                        action: {
                            label: 'View',
                            onClick: () => window.location.href = `/app/delivery/orders/${e.order.id}`
                        }
                    });
                });
        }

        // Cleanup
        return () => {
            window.Echo.leave('notifications');
            if (auth.user) {
                window.Echo.leave(`user.${auth.user.id}`);
                window.Echo.leave('delivery');
            }
        };
    }, [auth.user]);
}; 