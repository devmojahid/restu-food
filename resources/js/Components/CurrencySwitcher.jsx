import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

export default function CurrencySwitcher({ currencies, currentCurrency }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCurrencySwitch = (currencyCode) => {
        setIsLoading(true);
        router.post(route('currency.switch'), {
            currency: currencyCode
        }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    if (!currencies?.length || !currentCurrency) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="outline" 
                    disabled={isLoading}
                    className="min-w-[80px] flex items-center justify-center gap-2"
                >
                    <span className="font-medium">{currentCurrency.symbol}</span>
                    <span>{currentCurrency.code}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                {currencies.map((currency) => (
                    <DropdownMenuItem
                        key={currency.code}
                        onClick={() => handleCurrencySwitch(currency.code)}
                        className={`
                            flex items-center justify-between
                            ${currency.code === currentCurrency.code ? 'bg-accent' : ''}
                        `}
                    >
                        <span>{currency.name}</span>
                        <span className="font-medium">{currency.symbol}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 