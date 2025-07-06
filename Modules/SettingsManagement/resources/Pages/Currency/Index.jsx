import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import SettingsLayout from "../Index";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import { Save, Plus, Trash2, RefreshCw, Pencil, Globe, Check, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/Components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";
import StatsCard from "@/Components/Admin/StatsCard";

const CurrencySettings = ({ currencies, stats, can }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCurrency, setEditingCurrency] = useState(null);
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: "",
        name: "",
        symbol: "",
        exchange_rate: "1.00",
        decimal_places: "2",
        decimal_separator: ".",
        thousand_separator: ",",
        symbol_position: "before",
        space_between: false,
        is_default: false,
        is_enabled: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingCurrency) {
            put(route('app.settings.currencies.update', editingCurrency.id), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setEditingCurrency(null);
                    reset();
                },
            });
        } else {
            post(route('app.settings.currencies.store'), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (currency) => {
        setEditingCurrency(currency);
        setData({
            code: currency.code,
            name: currency.name,
            symbol: currency.symbol,
            exchange_rate: currency.exchange_rate.toString(),
            decimal_places: currency.decimal_places.toString(),
            decimal_separator: currency.decimal_separator,
            thousand_separator: currency.thousand_separator,
            symbol_position: currency.symbol_position,
            space_between: currency.space_between,
            is_default: currency.is_default,
            is_enabled: currency.is_enabled
        });
        setIsDialogOpen(true);
    };

    const handleUpdateRates = () => {
        post(route("app.settings.currencies.update-rates"), {
            preserveScroll: true
        });
    };

    const handleDelete = (currencyId) => {
        if (confirm('Are you sure you want to delete this currency?')) {
            router.delete(route("app.settings.currencies.destroy", currencyId));
        }
    };

    return (
        <SettingsLayout>
            <Head title="Currency Settings" />

            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <StatsCard
                        title="Total Currencies"
                        value={stats.total}
                        icon={Globe}
                    />
                    <StatsCard
                        title="Active Currencies"
                        value={stats.active}
                        icon={Check}
                        className="bg-green-50"
                    />
                    <StatsCard
                        title="Inactive Currencies"
                        value={stats.inactive}
                        icon={XCircle}
                        className="bg-red-50"
                    />
                </div>

                {/* Main Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Currency Management</CardTitle>
                            <CardDescription>
                                Manage your application's currencies and exchange rates
                            </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                            {/* {can.edit && ( */}
                                <Button 
                                    variant="outline" 
                                    onClick={handleUpdateRates}
                                    disabled={processing}
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Update Rates
                                </Button>
                            {/* )} */}
                            {/* {can.create && ( */}
                                <Button onClick={() => setIsDialogOpen(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Currency
                                </Button>
                            {/* )} */}
                        </div>
                    </CardHeader>

                    {/* Card Content */}
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Symbol</TableHead>
                                    <TableHead>Exchange Rate</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currencies.data.map((currency) => (
                                    <TableRow key={currency.id}>
                                        <TableCell className="font-medium">{currency.code}</TableCell>
                                        <TableCell>{currency.name}</TableCell>
                                        <TableCell>{currency.symbol}</TableCell>
                                        <TableCell>{currency.exchange_rate}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Badge variant={currency.is_enabled ? "success" : "secondary"}>
                                                    {currency.is_enabled ? "Active" : "Inactive"}
                                                </Badge>
                                                {currency.is_default && (
                                                    <Badge variant="outline">Default</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                {/* {can.edit && ( */}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(currency)}
                                                    >
                                                        Edit
                                                    </Button>
                                                {/* )} */}
                                                {/* {can.delete && !currency.is_default && ( */}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(currency.id)}
                                                        className="text-red-500"
                                                    >
                                                        Delete
                                                    </Button>
                                                {/* )} */}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Currency Form Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>
                                {editingCurrency ? 'Edit Currency' : 'Add New Currency'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingCurrency 
                                    ? 'Edit the currency details below.' 
                                    : 'Add a new currency to your application.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Currency Code */}
                                <div className="col-span-1">
                                    <Label htmlFor="code">Currency Code</Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={e => setData('code', e.target.value.toUpperCase())}
                                        placeholder="USD"
                                        maxLength={3}
                                        disabled={editingCurrency}
                                    />
                                    {errors.code && (
                                        <span className="text-sm text-red-500">{errors.code}</span>
                                    )}
                                </div>

                                {/* Currency Name */}
                                <div className="col-span-1">
                                    <Label htmlFor="name">Currency Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="US Dollar"
                                    />
                                    {errors.name && (
                                        <span className="text-sm text-red-500">{errors.name}</span>
                                    )}
                                </div>

                                {/* Symbol */}
                                <div className="col-span-1">
                                    <Label htmlFor="symbol">Symbol</Label>
                                    <Input
                                        id="symbol"
                                        value={data.symbol}
                                        onChange={e => setData('symbol', e.target.value)}
                                        placeholder="$"
                                    />
                                    {errors.symbol && (
                                        <span className="text-sm text-red-500">{errors.symbol}</span>
                                    )}
                                </div>

                                {/* Exchange Rate */}
                                <div className="col-span-1">
                                    <Label htmlFor="exchange_rate">Exchange Rate</Label>
                                    <Input
                                        id="exchange_rate"
                                        type="number"
                                        step="0.000001"
                                        value={data.exchange_rate}
                                        onChange={e => setData('exchange_rate', e.target.value)}
                                        placeholder="1.00"
                                    />
                                    {errors.exchange_rate && (
                                        <span className="text-sm text-red-500">{errors.exchange_rate}</span>
                                    )}
                                </div>

                                {/* Decimal Places */}
                                <div className="col-span-1">
                                    <Label htmlFor="decimal_places">Decimal Places</Label>
                                    <Input
                                        id="decimal_places"
                                        type="number"
                                        min="0"
                                        max="4"
                                        value={data.decimal_places}
                                        onChange={e => setData('decimal_places', e.target.value)}
                                    />
                                    {errors.decimal_places && (
                                        <span className="text-sm text-red-500">{errors.decimal_places}</span>
                                    )}
                                </div>

                                {/* Symbol Position */}
                                <div className="col-span-1">
                                    <Label htmlFor="symbol_position">Symbol Position</Label>
                                    <Select 
                                        value={data.symbol_position} 
                                        onValueChange={value => setData('symbol_position', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select position" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="before">Before</SelectItem>
                                            <SelectItem value="after">After</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.symbol_position && (
                                        <span className="text-sm text-red-500">{errors.symbol_position}</span>
                                    )}
                                </div>
                            </div>

                            {/* Switches */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_enabled">Enable Currency</Label>
                                    <Switch
                                        id="is_enabled"
                                        checked={data.is_enabled}
                                        onCheckedChange={checked => setData('is_enabled', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_default">Set as Default</Label>
                                    <Switch
                                        id="is_default"
                                        checked={data.is_default}
                                        onCheckedChange={checked => setData('is_default', checked)}
                                        disabled={editingCurrency?.is_default}
                                    />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {editingCurrency ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </SettingsLayout>
    );
};

export default CurrencySettings; 