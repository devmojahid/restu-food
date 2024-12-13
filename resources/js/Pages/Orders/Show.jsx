// Add this where you show order details
{order.delivery && (
    <Link
        href={route('delivery.track', order.id)}
        className="inline-flex items-center space-x-2 text-primary hover:text-primary/80"
    >
        <MapPin className="w-4 h-4" />
        <span>Track Delivery</span>
    </Link>
)} 