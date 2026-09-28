"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  ExternalLink,
  Settings,
  Phone,
  RefreshCw,
  Search,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/formatters";

interface OrderLead {
  id: string;
  customer_name: string;
  phone: string;
  product: string;
  price: number;
  quantity: number;
  weight: string;
  status: "INITIATED" | "CONFIRMED" | "FULFILLED" | "CANCELLED";
  timestamp: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderLead[]>([
    {
      id: "ord-101",
      customer_name: "Aditi Sharma",
      phone: "+919876543210",
      product: "Royal Opera Gateau",
      price: 1499,
      quantity: 1,
      weight: "1kg",
      status: "INITIATED",
      timestamp: "Today, 11:20 AM",
    },
    {
      id: "ord-102",
      customer_name: "Vikram Nair",
      phone: "+919812345678",
      product: "Strawberry Shortcake",
      price: 1899,
      quantity: 1,
      weight: "1kg",
      status: "CONFIRMED",
      timestamp: "Today, 10:05 AM",
    },
    {
      id: "ord-103",
      customer_name: "Ananya Pillai",
      phone: "+919895012345",
      product: "Parisian Tiramisu Cup",
      price: 650,
      quantity: 2,
      weight: "500g",
      status: "FULFILLED",
      timestamp: "Yesterday, 04:30 PM",
    },
    {
      id: "ord-104",
      customer_name: "Rohan Varma",
      phone: "+919744112233",
      product: "Artisanal Double Dark Chocolate Cookies",
      price: 499,
      quantity: 1,
      weight: "6 pcs",
      status: "CANCELLED",
      timestamp: "Sep 25, 02:15 PM",
    },
  ]);

  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  const updateStatus = (id: string, newStatus: OrderLead["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const filtered = orders.filter((o) => {
    const matchesFilter = filter === "ALL" ? true : o.status === filter;
    const matchesSearch =
      search === "" ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D27D46]">
            Conversational Commerce
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#35063D] mt-0.5">
            WhatsApp Order Leads
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time customer inquiries received directly via WhatsApp without cart friction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors shadow-xs"
          >
            <Settings className="w-3.5 h-3.5 text-[#35063D]" />
            <span>Configure Template & Number</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search by customer, product, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-stone-200 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-[#35063D]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {["ALL", "INITIATED", "CONFIRMED", "FULFILLED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filter === st
                  ? "bg-[#35063D] text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200 border border-transparent"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF5EE] border-b border-[#EAE3D8] text-stone-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Lead ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Artisanal Creation</th>
                <th className="p-4">Portion</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Received</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Quick Chat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150/80 text-stone-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-16 text-center text-stone-400">
                    <MessageCircle className="w-8 h-8 mx-auto text-stone-300 mb-2 stroke-1" />
                    <p className="font-semibold text-stone-600">No matching order leads found</p>
                    <p className="text-[11px] mt-1">Customers requesting orders on WhatsApp will be logged here.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-stone-400">
                      #{order.id}
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-stone-900 block">{order.customer_name}</span>
                      <span className="text-[10px] text-stone-400">{order.phone}</span>
                    </td>

                    <td className="p-4 font-semibold text-[#35063D]">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{order.product}</span>
                      </div>
                    </td>

                    <td className="p-4 text-stone-500 font-medium">{order.weight}</td>

                    <td className="p-4 font-bold text-stone-800">{order.quantity}</td>

                    <td className="p-4 font-bold text-[#D27D46]">
                      {formatPrice(order.price)}
                    </td>

                    <td className="p-4 text-stone-400 text-[11px]">{order.timestamp}</td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value as OrderLead["status"])
                        }
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border focus:outline-none cursor-pointer ${
                          order.status === "FULFILLED"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : order.status === "CONFIRMED"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : order.status === "CANCELLED"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-amber-100 text-amber-900 border-amber-300"
                        }`}
                      >
                        <option value="INITIATED">INITIATED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="FULFILLED">FULFILLED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <a
                        href={`https://wa.me/${order.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
