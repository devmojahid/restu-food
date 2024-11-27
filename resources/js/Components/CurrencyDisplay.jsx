import { usePage } from '@inertiajs/react';

export default function CurrencyDisplay({ amount, className = '' }) {
    const { currentCurrency } = usePage().props;
    
    const formatAmount = () => {
        const numberFormat = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: currentCurrency.decimal_places,
            maximumFractionDigits: currentCurrency.decimal_places,
            useGrouping: true,
        });

        const formattedNumber = numberFormat.format(amount * currentCurrency.exchange_rate)
            .replace('.', currentCurrency.decimal_separator)
            .replace(/,/g, currentCurrency.thousand_separator);

        const space = currentCurrency.space_between ? ' ' : '';
        
        return currentCurrency.symbol_position === 'before'
            ? `${currentCurrency.symbol}${space}${formattedNumber}`
            : `${formattedNumber}${space}${currentCurrency.symbol}`;
    };

    return (
        <span className={className}>
            {formatAmount()}
        </span>
    );
} 