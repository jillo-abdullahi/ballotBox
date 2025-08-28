import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FaArrowRight } from "react-icons/fa";
import { Navbar } from "../components";
import DatePicker from "../components/DatePicker";
import TimePicker from "../components/TimePicker";

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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to home after successful creation
      navigate({ to: "/" });
    } catch (error) {
      console.error("Failed to create proposal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid =
    formData.title.trim() && formData.description.trim() && formData.deadline;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 bg-blue-bg px-8 py-6 rounded-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-blue-text">
            Create New Proposal
          </h1>
          <p className="text-blue-text text-lg">
            Submit your idea to the community for voting. Make sure to provide
            clear details and reasoning.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-2">
          {/* Title */}
          <div className="space-y-3">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-neutral-200"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Increase staking rewards to 8%"
              className="w-full px-5 py-4 bg-blue-bg/50 border-none text-neutral-100 placeholder-neutral-400 rounded-xl hover:bg-blue-bg/70 focus:bg-blue-bg/20 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200"
              maxLength={100}
              required
            />
            <p className="text-xs text-neutral-400">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neutral-200"
            >
              Short Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief summary of your proposal (shown in proposal lists)"
              rows={3}
              className="w-full px-5 py-4 bg-blue-bg/50 border-none text-neutral-100 placeholder-neutral-400 rounded-xl hover:bg-blue-bg/70 focus:bg-blue-bg/20 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200 resize-vertical"
              maxLength={200}
              required
            />
            <p className="text-xs text-neutral-400">
              {formData.description.length}/200 characters
            </p>
          </div>

          {/* Detailed Description */}
          <div className="space-y-3">
            <label
              htmlFor="details"
              className="block text-sm font-medium text-neutral-200"
            >
              Detailed Description
            </label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Provide comprehensive details, rationale, implementation plan, and any other relevant information..."
              rows={8}
              className="w-full px-5 py-4 bg-blue-bg/50 border-none text-neutral-100 placeholder-neutral-400 rounded-xl hover:bg-blue-bg/70 focus:bg-blue-bg/20 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200 resize-vertical"
              maxLength={2000}
            />
            <p className="text-xs text-neutral-400">
              {formData.details.length}/2000 characters
            </p>
          </div>

          {/* Deadline */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-neutral-200">
              Voting Deadline *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <DatePicker
                value={formData.deadline.split('T')[0] || ''}
                onChange={(date) => {
                  const time = formData.deadline.split('T')[1] || '12:00';
                  setFormData(prev => ({
                    ...prev,
                    deadline: date ? `${date}T${time}` : ''
                  }));
                }}
                min={new Date().toISOString().split('T')[0]}
                label="Date"
                required
              />
              <TimePicker
                value={formData.deadline.split('T')[1] || ''}
                onChange={(time) => {
                  const date = formData.deadline.split('T')[0];
                  if (date) {
                    setFormData(prev => ({
                      ...prev,
                      deadline: `${date}T${time}`
                    }));
                  }
                }}
                label="Time"
                required={!!formData.deadline.split('T')[0]}
              />
            </div>
            <p className="text-xs text-neutral-400">
              When should voting close? Choose a future date and time.
            </p>
          </div>

          {/* Preview Section */}
          {(formData.title || formData.description) && (
            <div className="">
              <h3 className="text-lg font-medium mb-4 text-neutral-200">
                Preview
              </h3>
              <div className="space-y-3">
                {formData.title && (
                  <h4 className="text-xl font-semibold text-neutral-100">
                    {formData.title}
                  </h4>
                )}
                {formData.description && (
                  <p className="text-neutral-200">{formData.description}</p>
                )}
                {formData.details && (
                  <div className="pt-3 border-t border-neutral-600/30">
                    <h5 className="text-sm uppercase tracking-wide text-neutral-400 mb-2">
                      Details
                    </h5>
                    <p className="text-neutral-200 whitespace-pre-line text-sm">
                      {formData.details}
                    </p>
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
              className="px-6 py-3 cursor-pointer bg-neutral-800 text-neutral-200 rounded-xl hover:bg-neutral-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="px-8 py-3 cursor-pointer bg-blue-text text-gray-900 rounded-xl hover:bg-blue-text disabled:opacity-80 disabled:cursor-not-allowed transition-colors font-medium flex-1 sm:flex-none flex items-center justify-center gap-2 group"
            >
              <span>{isSubmitting ? "Creating..." : "Create Proposal"}</span>
              <FaArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
