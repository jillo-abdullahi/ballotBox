import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Navbar } from "../components";

export default function CreateProposal() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    details: "",
    deadline: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual proposal creation logic
      console.log("Creating proposal:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to home after successful creation
      navigate({ to: "/" });
    } catch (error) {
      console.error("Failed to create proposal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = formData.title.trim() && formData.description.trim() && formData.deadline;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Create New Proposal</h1>
          <p className="text-neutral-400 text-lg">
            Submit your idea to the community for voting. Make sure to provide clear details and reasoning.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-neutral-200">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Increase staking rewards to 8%"
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 placeholder-neutral-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors"
              maxLength={100}
              required
            />
            <p className="text-xs text-neutral-500">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-neutral-200">
              Short Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief summary of your proposal (shown in proposal lists)"
              rows={3}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 placeholder-neutral-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors resize-vertical"
              maxLength={200}
              required
            />
            <p className="text-xs text-neutral-500">
              {formData.description.length}/200 characters
            </p>
          </div>

          {/* Detailed Description */}
          <div className="space-y-2">
            <label htmlFor="details" className="block text-sm font-medium text-neutral-200">
              Detailed Description
            </label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Provide comprehensive details, rationale, implementation plan, and any other relevant information..."
              rows={8}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 placeholder-neutral-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors resize-vertical"
              maxLength={2000}
            />
            <p className="text-xs text-neutral-500">
              {formData.details.length}/2000 characters
            </p>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <label htmlFor="deadline" className="block text-sm font-medium text-neutral-200">
              Voting Deadline *
            </label>
            <input
              type="datetime-local"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors"
              required
            />
            <p className="text-xs text-neutral-500">
              When should voting close? Choose a future date and time.
            </p>
          </div>

          {/* Preview Section */}
          {(formData.title || formData.description) && (
            <div className="border border-neutral-700 rounded-xl p-6 bg-neutral-900/50">
              <h3 className="text-lg font-medium mb-4 text-neutral-200">Preview</h3>
              <div className="space-y-3">
                {formData.title && (
                  <h4 className="text-xl font-semibold text-neutral-100">{formData.title}</h4>
                )}
                {formData.description && (
                  <p className="text-neutral-300">{formData.description}</p>
                )}
                {formData.details && (
                  <div className="pt-3 border-t border-neutral-700">
                    <h5 className="text-sm uppercase tracking-wide text-neutral-400 mb-2">Details</h5>
                    <p className="text-neutral-300 whitespace-pre-line text-sm">{formData.details}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="px-6 py-3 border border-neutral-600 text-neutral-300 rounded-xl hover:bg-neutral-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex-1 sm:flex-none"
            >
              {isSubmitting ? "Creating..." : "Create Proposal"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
