"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function DevWebhooksPage() {
  const [provider, setProvider] = useState<'bKash' | 'Nagad' | 'Stripe'>('bKash');
  const [orderId, setOrderId] = useState('');
  const [transactionId, setTransactionId] = useState(`TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'success' | 'failed'>('success');
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Webhook logic...

  const simulateWebhook = async () => {
    setIsLoading(true);
    setResponse(null);
    try {
      // In local dev, we target the emulator. In staging/prod, this page shouldn't exist.
      // We can use a relative path if we proxy it or just use an environment variable.
      const baseUrl = process.env.NEXT_PUBLIC_FUNCTIONS_URL || 'http://localhost:5001/grit-project/us-central1/handlePaymentWebhook';
      
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          orderId,
          transactionId,
          amount,
          status,
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-slate text-white pt-32 pb-24 font-editorial">
      <div className="container mx-auto px-4 max-w-2xl border border-white/10 p-8 bg-bottle-green">
        <h1 className="font-structural text-4xl uppercase tracking-tighter mb-8 border-b border-white/10 pb-4">
          Webhook Simulator <span className="text-wattle text-sm tracking-widest">[DEBUG ONLY]</span>
        </h1>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-2">
                <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Provider</label>
                <select 
                  value={provider} 
                  onChange={(e) => setProvider(e.target.value as any)}
                  className="bg-black border border-white/20 p-2 focus:outline-none focus:border-wattle"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Stripe">Stripe</option>
                </select>
             </div>
             <div className="flex flex-col gap-2">
                <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="bg-black border border-white/20 p-2 focus:outline-none focus:border-wattle"
                >
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>
             </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Order ID</label>
            <input 
              type="text" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g., ORD-A1B2C3"
              className="bg-black border border-white/20 p-2 focus:outline-none focus:border-wattle"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Transaction ID</label>
            <input 
              type="text" 
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="bg-black border border-white/20 p-2 focus:outline-none focus:border-wattle"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-structural text-xs uppercase tracking-widest text-gray-500">Amount</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 25.00"
              className="bg-black border border-white/20 p-2 focus:outline-none focus:border-wattle"
            />
          </div>

          <Button 
            variant="accent" 
            className="w-full"
            onClick={simulateWebhook}
            disabled={isLoading}
          >
            {isLoading ? "Transmitting..." : "Simulate Webhook"}
          </Button>

          {response && (
            <div className="mt-8 p-4 bg-black border border-white/10">
              <h3 className="font-structural text-xs uppercase tracking-widest text-gray-500 mb-2">Response</h3>
              <pre className="text-sm font-mono text-wattle overflow-auto max-h-48">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
