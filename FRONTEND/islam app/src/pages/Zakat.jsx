import React, { useState, useEffect } from 'react';
import { Calculator, Coins, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function Zakat() {
    const [prices, setPrices] = useState(null);
    const [loadingPrices, setLoadingPrices] = useState(true);
    const [loadingCalc, setLoadingCalc] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        currency: 'XOF',
        cash: '',
        gold_grams: '',
        silver_grams: '',
        stocks: '',
        business_goods: '',
        liabilities: ''
    });

    useEffect(() => {
        fetchPrices(form.currency);
    }, [form.currency]);

    const fetchPrices = async (currency) => {
        setLoadingPrices(true);
        try {
            const res = await fetch(`https://ummahapi.com/api/zakat/prices?currency=${currency}&apikey=${import.meta.env.VITE_UMMAH_API_KEY}`);
            if (res.ok) {
                const data = await res.json();
                setPrices(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingPrices(false);
        }
    };

    const handleCalculate = async (e) => {
        e.preventDefault();
        setLoadingCalc(true);
        setError('');
        
        try {
            const payload = {
                currency: form.currency,
                cash: parseFloat(form.cash) || 0,
                gold_grams: parseFloat(form.gold_grams) || 0,
                silver_grams: parseFloat(form.silver_grams) || 0,
                stocks: parseFloat(form.stocks) || 0,
                business_goods: parseFloat(form.business_goods) || 0,
                liabilities: parseFloat(form.liabilities) || 0
            };

            const res = await fetch(`https://ummahapi.com/api/zakat/calculate?apikey=${import.meta.env.VITE_UMMAH_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                setResult(data.data);
            } else {
                setError(data.message || 'Erreur lors du calcul');
            }
        } catch (err) {
            setError('Erreur de réseau');
        } finally {
            setLoadingCalc(false);
        }
    };

    return (
        <div className="pt-8 px-4 max-w-4xl mx-auto pb-24">
            <PageHeader 
                icon={<Calculator size={32} />} 
                title="Calculateur de Zakat" 
                subtitle="Calculez votre Zakat Al-Maal avec les cours de l'or et l'argent en temps réel." 
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {/* Panel des prix */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-theme-surface border border-theme-border rounded-2xl p-5 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent/5 rounded-full blur-2xl"></div>
                        <h3 className="text-theme-text-muted text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <TrendingUp size={16} className="text-theme-accent" /> Cours du Jour
                        </h3>
                        
                        {loadingPrices ? (
                            <div className="flex justify-center py-4"><RefreshCw className="animate-spin text-theme-accent" /></div>
                        ) : prices ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-theme-text-muted">Or (par gramme)</p>
                                    <p className="text-xl font-mono text-theme-text">{prices.gold_price_per_gram.toFixed(2)} {prices.currency}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-theme-text-muted">Argent (par gramme)</p>
                                    <p className="text-xl font-mono text-theme-text">{prices.silver_price_per_gram.toFixed(2)} {prices.currency}</p>
                                </div>
                                <div className="pt-4 border-t border-theme-border">
                                    <p className="text-xs text-theme-accent font-medium">Nissab Or (85g)</p>
                                    <p className="text-lg font-mono text-theme-accent/90">{prices.nisab_gold_value.toFixed(2)} {prices.currency}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-theme-text-muted font-medium">Nissab Argent (595g)</p>
                                    <p className="text-lg font-mono text-theme-text-muted/80">{prices.nisab_silver_value.toFixed(2)} {prices.currency}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-red-400">Impossible de charger les cours.</p>
                        )}
                    </div>
                </div>

                {/* Formulaire de calcul */}
                <div className="md:col-span-2">
                    <form onSubmit={handleCalculate} className="bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-2xl">
                        <div className="mb-6 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-theme-text">Vos Avoirs</h3>
                            <select 
                                value={form.currency}
                                onChange={(e) => setForm({...form, currency: e.target.value})}
                                className="bg-theme-surface-hover border border-theme-border text-theme-text rounded-lg px-3 py-1.5 outline-none focus:border-theme-accent"
                            >
                                <option value="XOF">FCFA (XOF)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="USD">USD ($)</option>
                                <option value="CAD">CAD ($)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-theme-text-muted mb-1">Liquidités & Épargne ({form.currency})</label>
                                <input 
                                    type="number" step="any" min="0" placeholder="Ex: 5000"
                                    value={form.cash} onChange={e => setForm({...form, cash: e.target.value})}
                                    className="w-full bg-theme-surface-hover border border-theme-border rounded-xl px-4 py-3 text-theme-text outline-none focus:border-theme-accent transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-theme-text-muted mb-1">Or possédé (en grammes)</label>
                                <input 
                                    type="number" step="any" min="0" placeholder="Ex: 100"
                                    value={form.gold_grams} onChange={e => setForm({...form, gold_grams: e.target.value})}
                                    className="w-full bg-theme-surface-hover border border-theme-border rounded-xl px-4 py-3 text-theme-text outline-none focus:border-theme-accent transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-theme-text-muted mb-1">Argent possédé (en grammes)</label>
                                <input 
                                    type="number" step="any" min="0" placeholder="Ex: 0"
                                    value={form.silver_grams} onChange={e => setForm({...form, silver_grams: e.target.value})}
                                    className="w-full bg-theme-surface-hover border border-theme-border rounded-xl px-4 py-3 text-theme-text outline-none focus:border-theme-accent transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-theme-text-muted mb-1">Actions & Placements ({form.currency})</label>
                                <input 
                                    type="number" step="any" min="0" placeholder="Ex: 1500"
                                    value={form.stocks} onChange={e => setForm({...form, stocks: e.target.value})}
                                    className="w-full bg-theme-surface-hover border border-theme-border rounded-xl px-4 py-3 text-theme-text outline-none focus:border-theme-accent transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-theme-text-muted mb-1">Marchandises Pro ({form.currency})</label>
                                <input 
                                    type="number" step="any" min="0" placeholder="Ex: 0"
                                    value={form.business_goods} onChange={e => setForm({...form, business_goods: e.target.value})}
                                    className="w-full bg-theme-surface-hover border border-theme-border rounded-xl px-4 py-3 text-theme-text outline-none focus:border-theme-accent transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-red-400 mb-1">Dettes à déduire ({form.currency})</label>
                                <input 
                                    type="number" step="any" min="0" placeholder="Ex: 500"
                                    value={form.liabilities} onChange={e => setForm({...form, liabilities: e.target.value})}
                                    className="w-full bg-theme-surface-hover border border-theme-border rounded-xl px-4 py-3 text-theme-text outline-none focus:border-red-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loadingCalc}
                            className="w-full mt-6 bg-theme-accent hover:brightness-110 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-theme-accent/20 flex items-center justify-center gap-2"
                        >
                            {loadingCalc ? <RefreshCw className="animate-spin" /> : <Coins />}
                            Calculer ma Zakat
                        </button>
                    </form>

                    {/* Result Card */}
                    {result && !loadingCalc && (
                        <div className={`mt-6 p-6 rounded-2xl border transition-colors ${result.above_nisab ? 'bg-theme-accent/10 border-theme-accent/30' : 'bg-theme-surface border-theme-border'} text-center animate-in fade-in slide-in-from-bottom-4`}>
                            {result.above_nisab ? (
                                <>
                                    <h4 className="text-theme-accent font-bold uppercase tracking-wider mb-2">Zakat Obligatoire</h4>
                                    <p className="text-theme-text-muted text-sm mb-4">Votre richesse nette dépasse le Nissab. Vous devez payer 2.5%.</p>
                                    <div className="text-4xl font-mono text-theme-text font-bold">
                                        {result.zakat_due_formatted} {form.currency}
                                    </div>
                                    <p className="text-xs text-theme-text-muted mt-4">Sur un total net de {result.breakdown.net_zakatable_wealth.toFixed(2)} {form.currency}</p>
                                </>
                            ) : (
                                <>
                                    <h4 className="text-theme-text font-bold uppercase tracking-wider mb-2">Zakat Non Obligatoire</h4>
                                    <p className="text-theme-text-muted text-sm">Votre richesse nette ({result.breakdown.net_zakatable_wealth.toFixed(2)} {form.currency}) n'atteint pas le Nissab ({result.nisab_value.toFixed(2)} {form.currency}).</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
