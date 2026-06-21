"use client";

import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BloodRequest {
  requestId: number;
  bloodType: string;
  quantity: number;
  priority: string;
  status: string;
  requestDate: string;
  notes?: string;
  userID: number;
  hospital?: { userID: number; name: string };
}

export default function RequestBloodPage() {
  const [bloodType, setBloodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [priority, setPriority] = useState("");
  const [notes, setNotes] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5004";
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  function getUserId(): number | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("userId");
    const id = Number(raw);
    return id > 0 ? id : null;
  }

  function getToken() {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
  }

  // دالة موحدة للتعامل مع الـ Fetch وإضافة الـ Token تلقائياً
  async function apiFetch(path: string, options: RequestInit = {}) {
    const token = getToken();
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "حدث خطأ ما أثناء معالجة الطلب.");
    }

    return res.status === 204 ? null : res.json();
  }

  // جلب الطلبات السابقة للمستشفى الحالي عند تحميل الصفحة
  async function fetchRequests() {
    try {
      setLoading(true);
      setError("");
      const userId = getUserId();
      if (!userId) {
        window.location.href = "/login";
        return;
      }

      const params = new URLSearchParams({ UserID: String(userId) });
      const data = await apiFetch(`/api/blood-requests?${params}`);
      setRequests(data ?? []);
    } catch (e: any) {
      setError(e.message);
    } {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  // دالة الإرسال مصلحة بالكامل لتتوافق مع الـ DTO الخاص بالخلفية
  async function onSubmitHandler(e: React.FormEvent) {
    e.preventDefault(); // منع المتصفح من إعادة تحميل الصفحة

    if (!bloodType || !quantity || !priority) {
      setSubmitError("جميع الحقول الأساسية مطلوبة.");
      return;
    }

    const userID = getUserId();
    if (!userID) {
      window.location.href = "/login";
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      // إرسال البيانات لتطابق الـ CreateBloodRequestDto في السيرفر
      await apiFetch("/api/blood-requests", {
        method: "POST",
        body: JSON.stringify({
          bloodType: bloodType,
          quantity: Number(quantity),
          priority: priority, // تطابق الكابيتال والسمول مع الـ DTO الخاص بك
          userID: userID,
          notes: notes || null,
        }),
      });

      setSubmitted(true);
      setBloodType("");
      setQuantity("");
      setPriority("");
      setNotes("");

      // إخفاء رسالة النجاح بعد ثانيتين وتحديث الجدول
      setTimeout(() => setSubmitted(false), 2000);
      fetchRequests();
    } catch (e: any) {
      setSubmitError(e.message);
    } {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-100 pb-4 mb-5">
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Create Blood Request</h1>
          <p className="text-sm text-gray-500 mt-1">Submit a new blood request details below</p>
        </div>

        {/* Error Messages */}
        {submitError && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Success Message */}
        {submitted && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 text-green-600 rounded-xl text-sm">
            <CheckCircle2 className="h-4 w-4" />
            <span>Blood request submitted successfully!</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="space-y-4">
          {/* Blood Type & Units Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Blood Type</Label>
              <Select value={bloodType} onValueChange={setBloodType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Units Needed</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 3"
                min="1"
                required
              />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-1">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !bloodType || !quantity || !priority}
            className="w-full rounded-xl bg-red-500 py-3 font-semibold text-white transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 mt-2 flex items-center justify-center disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </button>
        </form>
      </div>

      {/* جدول إضافي اختياري لعرض طلبات المستشفى السابقة المتصلة بالخلفية */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 font-serif mb-4">Your Recent Requests</h2>
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-gray-500">No requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Units</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.requestId} className="border-b">
                    <td className="px-4 py-3">#{r.requestId}</td>
                    <td className="px-4 py-3 font-bold">{r.bloodType}</td>
                    <td className="px-4 py-3">{r.quantity}</td>
                    <td className="px-4 py-3">{r.priority}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        r.status === "Approved" ? "bg-green-100 text-green-800" :
                        r.status === "Pending" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}