"use client";

import { useQuery } from "@tanstack/react-query";
import { recruiterService } from "@/lib/api/recruiter";
import { Loader2, CreditCard, Check, Zap, Crown, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const plans = [
  {
    id: "MONTHLY",
    name: "Monthly",
    price: "Rs 100",
    period: "/month",
    icon: Zap,
    features: [
      "Post up to 10 jobs",
      "Basic applicant tracking",
      "Email support",
      "30 days duration",
    ],
    color: "blue",
  },
  {
    id: "SIX_MONTH",
    name: "6-Month",
    price: "Rs 500",
    period: "/6 months",
    icon: Crown,
    features: [
      "Post up to 100 jobs",
      "Advanced analytics",
      "Priority support",
      "180 days duration",
    ],
    color: "purple",
    popular: true,
  },
  {
    id: "YEARLY",
    name: "Yearly",
    price: "Rs 900",
    period: "/year",
    icon: Sparkles,
    features: [
      "Unlimited job posts (9999)",
      "Full analytics suite",
      "Dedicated support",
      "365 days duration",
    ],
    color: "blue",
  },
];

export default function RecruiterSubscription() {
  const {
    data: subscription,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["recruiter-subscription"],
    queryFn: recruiterService.getSubscription,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  const currentPlanId = subscription?.planType || subscription?.planId || subscription?.plan;
  const noSubscription =
    !subscription ||
    isError ||
    subscription?.message === "No subscription found";

  const handleUpgrade = async (planId) => {
    try {
      toast.loading("Preparing payment...", { id: "payment" });
      const response = await recruiterService.createPayment(planId);
      if (response.paymentLink) {
        window.location.href = response.paymentLink;
      } else {
        toast.error("Payment link not provided by the server.", {
          id: "payment",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create payment", {
        id: "payment",
      });
      console.error("Payment creation error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
          <p className="text-gray-600">Manage your subscription plan</p>
        </div>
        <button
          onClick={() => {
            toast.promise(refetch(), {
              loading: "Refreshing...",
              success: "Subscription status updated!",
              error: "Failed to refresh.",
            });
          }}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-white"
        >
          <Zap size={16} />
          Refresh
        </button>
      </div>

      {noSubscription ? (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">No active subscription found.</span>{" "}
            Please choose a plan below to start posting jobs.
            {isError && error.response?.status === 404 && (
              <span className="ml-2 opacity-75">
                (Your recent payment might still be processing. Please wait a
                moment and refresh.)
              </span>
            )}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-800 uppercase tracking-wide">
                Active
              </span>
              <span className="text-base font-bold text-gray-900">
                {subscription.planName ||
                  (currentPlanId === "SIX_MONTH"
                    ? "6-Month Plan"
                    : currentPlanId === "MONTHLY"
                      ? "Monthly Plan"
                      : currentPlanId === "YEARLY"
                        ? "Yearly Plan"
                        : currentPlanId)}
              </span>
            </div>
            {subscription.paymentStatus && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${subscription.paymentStatus === "SUCCESS"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
                }`}>
                Payment: {subscription.paymentStatus}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
            <div className="rounded-lg bg-white border border-green-100 p-3">
              <p className="text-xs text-gray-500 mb-0.5">Start Date</p>
              <p className="font-semibold text-brand-primary-hover">
                {subscription.startDate
                  ? new Date(subscription.startDate).toLocaleDateString(
                    undefined,
                    { year: "numeric", month: "short", day: "numeric" }
                  )
                  : "—"}
              </p>
            </div>
            <div className="rounded-lg bg-white border border-green-100 p-3">
              <p className="text-xs text-gray-500 mb-0.5">Expiry Date</p>
              <p className="font-semibold text-brand-primary-hover">
                {(subscription.expiryDate || subscription.expiresAt)
                  ? new Date(
                    subscription.expiryDate || subscription.expiresAt
                  ).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                  : "—"}
              </p>
            </div>
            <div className="rounded-lg bg-white border border-green-100 p-3">
              <p className="text-xs text-gray-500 mb-0.5">Jobs Used</p>
              <p className="font-semibold text-brand-primary-hover">
                {subscription.jobsUsed ?? "—"}
                {subscription.jobLimit != null && (
                  <span className="text-gray-400 font-normal"> / {subscription.jobLimit}</span>
                )}
              </p>
            </div>
            <div className="rounded-lg bg-white border border-green-100 p-3">
              <p className="text-xs text-gray-500 mb-0.5">Jobs Remaining</p>
              <p className="font-semibold text-brand-primary-hover">
                {subscription.jobLimit != null && subscription.jobsUsed != null
                  ? subscription.jobLimit - subscription.jobsUsed
                  : "—"}
              </p>
            </div>
          </div>

          {subscription.jobLimit != null && subscription.jobsUsed != null && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Job post usage</span>
                <span>
                  {Math.round((subscription.jobsUsed / subscription.jobLimit) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      (subscription.jobsUsed / subscription.jobLimit) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = plan.id === currentPlanId;

          return (
            <div
              key={plan.id}
              className={`relative rounded-xl border p-6 ${plan.popular
                  ? "border-brand-primary bg-white shadow-lg"
                  : "border-gray-200 bg-white"
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-primary px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`rounded-lg p-2 ${plan.color === "gray"
                      ? "bg-gray-100"
                      : plan.color === "blue"
                        ? "bg-gray-200"
                        : "bg-purple-100"
                    }`}
                >
                  <Icon
                    size={24}
                    className={
                      plan.color === "gray"
                        ? "text-gray-600"
                        : plan.color === "blue"
                          ? "text-brand-primary"
                          : "text-purple-600"
                    }
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {plan.price}
                    {plan.period && (
                      <span className="text-sm font-normal text-gray-500">
                        {plan.period}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <Check size={16} className="text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                disabled={isCurrentPlan}
                onClick={() => handleUpgrade(plan.id)}
                className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isCurrentPlan
                    ? "cursor-default bg-gray-100 text-gray-500"
                    : plan.popular
                      ? "bg-brand-primary text-white hover:bg-brand-primary-hover"
                      : "bg-gray-900 text-white hover:bg-brand-primary-hover"
                  }`}
              >
                {isCurrentPlan ? "Current Plan" : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
