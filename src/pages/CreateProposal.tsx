import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { FaArrowRight } from "react-icons/fa";
import { CustomConnectButton } from "../components";
import ContractTransactionModal from "../components/ContractTransactionModal";
import DatePicker from "../components/DatePicker";
import TimePicker from "../components/TimePicker";
import { useCreateProposal } from "../hooks/useCreateProposal";

export default function CreateProposal() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  // Contract interaction hook
  const {
    createProposal,
    isPending,
    isConfirming,
    isConfirmed,
    error: contractError,
    hash,
  } = useCreateProposal();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    details: "",
    deadline: "",
  });

  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Show validation errors if form is invalid
    if (!isFormValid) {
      setShowValidationErrors(true);
      return;
    }

    if (isPending || isConfirming) return;

    // Show transaction modal instead of directly submitting
    setShowTransactionModal(true);
  };

  const handleTransactionConfirm = async () => {
    try {
      // Call the actual contract function
      await createProposal({
        title: formData.title,
        description: formData.description,
        details: formData.details,
        deadline: formData.deadline,
      });
    } catch (error) {
      console.error("Failed to create proposal:", error);
      throw error; // Re-throw to let modal handle the error state
    }
  };

  const handleViewProposals = () => {
    navigate({ to: "/" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation errors when user starts typing
    if (showValidationErrors) {
      setShowValidationErrors(false);
    }
  };

  // Validation helpers
  const getFieldError = (fieldName: string) => {
    if (!showValidationErrors) return "";

    switch (fieldName) {
      case "title":
        return !formData.title.trim() ? "Title is required" : "";
      case "description":
        return !formData.description.trim()
          ? "Short description is required"
          : "";
      case "deadline":
        return !formData.deadline ? "Voting deadline is required" : "";
      default:
        return "";
    }
  };

  const getAllErrors = () => {
    if (!showValidationErrors) return [];

    const errors = [];
    if (!formData.title.trim()) errors.push("Title is required");
    if (!formData.description.trim())
      errors.push("Short description is required");
    if (!formData.deadline) errors.push("Voting deadline is required");

    return errors;
  };

  const isFormValid =
    formData.title.trim() && formData.description.trim() && formData.deadline;

  // If wallet is not connected, show connection prompt
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-8 bg-blue-bg px-8 py-6 rounded-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-blue-text">
              Create New Proposal
            </h1>
            <p className="text-blue-text text-lg">
              Submit your idea to the community for voting. Make sure to provide
              clear details and reasoning.
            </p>
          </div>

          {/* Wallet Connection Prompt */}
          <div className="max-w-lg mx-auto text-center py-6">
            <div className="bg-blue-bg/50 rounded-3xl p-8 border border-blue-text/10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-text/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-text"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-blue-text">
                Connect Your Wallet
              </h2>

              <p className="text-neutral-300 mb-8 leading-relaxed">
                You need to connect your wallet to create proposals. This
                ensures that only verified users can submit proposals to the
                community.
              </p>

              <div className="flex justify-center">
                <CustomConnectButton />
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-700/50">
                <button
                  onClick={() => navigate({ to: "/" })}
                  className="cursor-pointer text-neutral-400 hover:text-neutral-200 transition-colors text-sm"
                >
                  ← Back to proposals
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto max-w-6xl px-4 py-8">
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
              className={`w-full px-5 py-4 bg-blue-bg/50 border text-neutral-100 placeholder-neutral-400 rounded-xl hover:bg-blue-bg/70 focus:bg-blue-bg/20 focus:ring-2 focus:outline-none transition-all duration-200 ${
                getFieldError("title")
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-blue-bg/50 focus:ring-blue-text/20"
              }`}
              maxLength={100}
            />
            <p className="text-xs text-neutral-400">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label
              htmlFor="description"
              className="block text-md font-medium text-neutral-200"
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
              className={`w-full px-5 py-4 bg-blue-bg/50 border text-neutral-100 placeholder-neutral-400 rounded-xl hover:bg-blue-bg/70 focus:bg-blue-bg/20 focus:ring-2 focus:outline-none transition-all duration-200 resize-vertical ${
                getFieldError("description")
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-blue-bg/50 focus:ring-blue-text/20"
              }`}
              maxLength={200}
            />
            <p className="text-xs text-neutral-400">
              {formData.description.length}/200 characters
            </p>
          </div>

          {/* Detailed Description */}
          <div className="space-y-3">
            <label
              htmlFor="details"
              className="block text-md font-medium text-neutral-200"
            >
              Detailed Description
            </label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Provide comprehensive details, rationale, implementation plan, and any other relevant information"
              rows={8}
              className="w-full px-5 py-4 bg-blue-bg/50 border border-blue-bg/50 text-neutral-100 placeholder-neutral-400 rounded-xl hover:bg-blue-bg/70 focus:bg-blue-bg/20 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200 resize-vertical"
              maxLength={2000}
            />
            <p className="text-xs text-neutral-400">
              {formData.details.length}/2000 characters
            </p>
          </div>

          {/* Deadline */}
          <div className="space-y-3">
            <label className="block text-md font-medium text-neutral-200">
              Voting Deadline *
            </label>
            <div
              className={`grid grid-cols-2 gap-3 p-3 rounded-xl border transition-all duration-200 ${
                getFieldError("deadline")
                  ? "border-red-500 bg-red-500/5"
                  : "border-transparent"
              }`}
            >
              <DatePicker
                value={
                  formData.deadline ? formData.deadline.split("T")[0] || "" : ""
                }
                onChange={(date) => {
                  const timePart = formData.deadline
                    ? formData.deadline.split("T")[1] || "12:00"
                    : "12:00";
                  setFormData((prev) => ({
                    ...prev,
                    deadline: date ? `${date}T${timePart}` : "",
                  }));
                  // Clear validation errors when user selects a date
                  if (showValidationErrors && date) {
                    setShowValidationErrors(false);
                  }
                }}
                min={new Date().toISOString().split("T")[0]}
                label="Date"
              />
              <TimePicker
                value={
                  formData.deadline ? formData.deadline.split("T")[1] || "" : ""
                }
                onChange={(time) => {
                  const datePart = formData.deadline
                    ? formData.deadline.split("T")[0]
                    : "";
                  if (datePart) {
                    setFormData((prev) => ({
                      ...prev,
                      deadline: `${datePart}T${time}`,
                    }));
                  } else {
                    // If no date is set, we need a date first
                    const today = new Date().toISOString().split("T")[0];
                    setFormData((prev) => ({
                      ...prev,
                      deadline: `${today}T${time}`,
                    }));
                  }
                }}
                label="Time"
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

          {/* Error Messages List */}
          {showValidationErrors && getAllErrors().length > 0 && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Please fix the following issues:
              </h4>
              <ul className="space-y-1">
                {getAllErrors().map((error, index) => (
                  <li
                    key={index}
                    className="text-red-300 text-sm flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="px-6 py-3 cursor-pointer bg-neutral-900 text-neutral-200 rounded-xl hover:bg-neutral-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || isConfirming}
              className="px-8 py-3 cursor-pointer bg-blue-text text-gray-900 rounded-xl hover:bg-blue-text disabled:opacity-80 disabled:cursor-not-allowed transition-colors font-medium flex-1 sm:flex-none flex items-center justify-center gap-2 group"
            >
              <span>
                {isPending || isConfirming ? "Creating..." : "Create Proposal"}
              </span>
              <FaArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </form>

        {/* Contract Transaction Modal */}
        <ContractTransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          onConfirm={handleTransactionConfirm}
          title="Create Proposal"
          description="You're about to create a new proposal. This will require a transaction to be confirmed in your wallet."
          isPending={isPending}
          isConfirming={isConfirming}
          isConfirmed={isConfirmed}
          error={contractError}
          transactionHash={hash}
          proposalTitle={formData.title}
          onViewProposals={handleViewProposals}
        />
      </main>
    </div>
  );
}
