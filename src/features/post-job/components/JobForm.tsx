"use client";

import { useState } from "react";
import Surface from "@/components/common/Surface";

export default function JobForm() {
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        description: "",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting job:", formData);
        // Add submission logic here
    };

    return (
        <Surface>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    {/* Job Title */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="title"
                            className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]"
                        >
                            Job Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Senior Frontend Engineer"
                            className="w-full rounded-lg bg-white/5 p-4 text-white placeholder-white/30 transition-colors focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                            required
                        />
                    </div>

                    {/* Company */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="company"
                            className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]"
                        >
                            Company
                        </label>
                        <input
                            type="text"
                            name="company"
                            id="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="e.g. Acme Corp"
                            className="w-full rounded-lg bg-white/5 p-4 text-white placeholder-white/30 transition-colors focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Location */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="location"
                                className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]"
                            >
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                id="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Remote / NYC"
                                className="w-full rounded-lg bg-white/5 p-4 text-white placeholder-white/30 transition-colors focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                                required
                            />
                        </div>

                        {/* Type */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="type"
                                className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]"
                            >
                                Employment Type
                            </label>
                            <select
                                name="type"
                                id="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full appearance-none rounded-lg bg-white/5 p-4 text-white transition-colors focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                            >
                                <option value="Full-time" className="bg-[#121212]">
                                    Full-time
                                </option>
                                <option value="Contract" className="bg-[#121212]">
                                    Contract
                                </option>
                                <option value="Internship" className="bg-[#121212]">
                                    Internship
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="description"
                            className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]"
                        >
                            Job Description
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            rows={5}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the role, responsibilities, and requirements..."
                            className="w-full resize-none rounded-lg bg-white/5 p-4 text-white placeholder-white/30 transition-colors focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                            required
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full rounded-xl bg-white py-4 text-sm font-bold uppercase tracking-wide text-black shadow-lg transition-transform active:scale-[0.98] hover:opacity-90"
                    >
                        Publish Job
                    </button>
                </div>
            </form>
        </Surface>
    );
}
