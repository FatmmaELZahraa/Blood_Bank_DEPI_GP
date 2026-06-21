// app/donor/request-blood/page.tsx
"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export default function RequestBloodPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    bloodType: "",
    unitsNeeded: "",
    priority: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // هنا يمكنك إضافة كود إرسال البيانات إلى الـ API الخاص بك
    alert("Blood request submitted successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-4">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 mb-5">
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Create Blood Request</h1>
        <p className="text-sm text-gray-500 mt-1">Submit a new blood request details below</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        
      

        {/* Blood Type & Units Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Type
            </label>
            <select
              name="bloodType"
              required
              value={formData.bloodType}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-red-400 focus:ring-2 focus:ring-red-100"
            >
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Units Needed
            </label>
            <input
              type="number"
              name="unitsNeeded"
              required
              min="1"
              value={formData.unitsNeeded}
              onChange={handleChange}
              placeholder="e.g. 3"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition-all focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            name="priority"
            required
            value={formData.priority}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-red-400 focus:ring-2 focus:ring-red-100"
          >
            <option value="">Select priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical (Urgent)</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Optional notes..."
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition-all focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-200 mt-2"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}