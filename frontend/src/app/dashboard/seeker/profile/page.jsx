// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { seekerService } from "@/lib/api/seeker";
// import {
//   Loader2,
//   Save,
//   User,
//   Briefcase,
//   GraduationCap,
//   Award,
//   Pencil,
//   X,
//   Mail,
//   Phone,
//   CheckCircle,
// } from "lucide-react";
// import toast from "react-hot-toast";

// const profileSchema = z.object({
//   firstName: z.string().min(2, "First name is required"),
//   lastName: z.string().min(2, "Last name is required"),
//   contactNumber: z.string().min(10, "Valid phone number is required"),
//   skills: z.string().min(3, "Skills are required"),
//   experience: z.string().min(1, "Experience is required"),
//   qualification: z.enum(["MASTERS", "PHD", "BACHELORS", "PLUS_TWO"], {
//     required_error: "Qualification is required",
//   }),
// });

// export default function SeekerProfile() {
//   const queryClient = useQueryClient();
//   const [isEditing, setIsEditing] = useState(false);

//   const { data: profile, isLoading } = useQuery({
//     queryKey: ["seeker-profile"],
//     queryFn: seekerService.getProfile,
//     retry: false,
//   });

//   const createMutation = useMutation({
//     mutationFn: (data) => seekerService.createProfile(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["seeker-profile"]);
//       toast.success("Profile created successfully!");
//       setIsEditing(false);
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Failed to create profile");
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: (data) => seekerService.updateProfile(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["seeker-profile"]);
//       toast.success("Profile updated successfully!");
//       setIsEditing(false);
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Failed to update profile");
//     },
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: zodResolver(profileSchema),
//     values: profile || {},
//   });

//   const onSubmit = (data) => {
//     if (profile) {
//       updateMutation.mutate(data);
//     } else {
//       createMutation.mutate(data);
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     reset(profile || {});
//   };

//   const isPending = createMutation.isPending || updateMutation.isPending;
//   const hasProfile = !!profile && !profile?.message;

//   if (isLoading) {
//     return (
//       <div className="flex h-64 items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
//       </div>
//     );
//   }

//   // ─── Detail View ────────────────────────────────────────────────────
//   if (hasProfile && !isEditing) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
//             <p className="text-gray-600">Your professional information</p>
//           </div>
//           <button
//             onClick={() => setIsEditing(true)}
//             className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover transition-colors"
//           >
//             <Pencil size={15} />
//             Edit Profile
//           </button>
//         </div>

//         {/* Header Card */}
//         <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
//           <div className="flex items-center gap-5">
//             <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-light/30 text-brand-primary border border-brand-primary/10 shadow-sm">
//               <User size={40} />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 {profile.firstName} {profile.lastName}
//               </h2>
//               <div className="flex items-center gap-2 mt-1">
//                 <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 border border-green-100">
//                   <CheckCircle size={10} />
//                   Verified Seeker
//                 </span>
//                 <span className="text-sm text-gray-500">• {profile.email}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Info Grid */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <InfoCard icon={Mail} label="Email Address" value={profile.email} />
//           <InfoCard
//             icon={Phone}
//             label="Contact Number"
//             value={profile.contactNumber}
//           />
//           <InfoCard
//             icon={GraduationCap}
//             label="Qualification"
//             value={profile.qualification?.replace("_", " ")}
//           />
//           <InfoCard
//             icon={Briefcase}
//             label="Work Experience"
//             value={`${profile.experience} years`}
//           />
//         </div>

//         {/* Skills Section */}
//         <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
//           <div className="mb-4 flex items-center gap-2">
//             <Award size={18} className="text-brand-primary" />
//             <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs">
//               Professional Skills
//             </h3>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {profile.skills?.split(",").map((skill, idx) => (
//               <span
//                 key={idx}
//                 className="rounded-lg bg-brand-light/40 px-3 py-1.5 text-xs font-bold text-brand-primary border border-brand-primary/10"
//               >
//                 {skill.trim()}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ─── Create / Edit Form ──────────────────────────────────────────────
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             {hasProfile ? "Edit Profile" : "Professional Profile"}
//           </h1>
//           <p className="text-gray-600">
//             {hasProfile
//               ? "Update your professional information"
//               : "Set up your job seeker profile"}
//           </p>
//         </div>
//         {hasProfile && (
//           <button
//             onClick={handleCancelEdit}
//             className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             <X size={15} />
//             Cancel
//           </button>
//         )}
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <FormField label="First Name" error={errors.firstName}>
//               <input
//                 type="text"
//                 {...register("firstName")}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
//                 placeholder="John"
//               />
//             </FormField>

//             <FormField label="Last Name" error={errors.lastName}>
//               <input
//                 type="text"
//                 {...register("lastName")}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
//                 placeholder="Doe"
//               />
//             </FormField>

//             <FormField label="Contact Number" error={errors.contactNumber}>
//               <input
//                 type="tel"
//                 {...register("contactNumber")}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
//                 placeholder="+977 984XXXXXXX"
//               />
//             </FormField>

//             <FormField label="Qualification" error={errors.qualification}>
//               <select
//                 {...register("qualification")}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
//               >
//                 <option value="">Select Qualification</option>
//                 <option value="PLUS_TWO">Plus Two / High School</option>
//                 <option value="BACHELORS">Bachelor's Degree</option>
//                 <option value="MASTERS">Master's Degree</option>
//                 <option value="PHD">PhD</option>
//               </select>
//             </FormField>

//             <FormField label="Years of Experience" error={errors.experience}>
//               <input
//                 type="text"
//                 {...register("experience")}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
//                 placeholder="e.g. 2 years"
//               />
//             </FormField>
//           </div>

//           <div className="mt-4">
//             <FormField label="Skills (comma separated)" error={errors.skills}>
//               <textarea
//                 {...register("skills")}
//                 rows={3}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
//                 placeholder="React, JavaScript, CSS, Node.js..."
//               />
//             </FormField>
//           </div>
//         </div>

//         <div className="flex justify-end gap-3">
//           <button
//             type="submit"
//             disabled={isPending}
//             className="flex items-center gap-2 rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-primary-hover disabled:opacity-50 transition-all shadow-lg shadow-brand-primary/20 active:scale-95"
//           >
//             {isPending ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <Save size={16} />
//             )}
//             {hasProfile ? "Update Profile" : "Create Profile"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// function InfoCard({ icon: Icon, label, value }) {
//   return (
//     <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
//       <div className="rounded-lg bg-brand-light/40 p-2 shrink-0">
//         <Icon size={16} className="text-brand-primary" />
//       </div>
//       <div className="min-w-0">
//         <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
//           {label}
//         </p>
//         <p className="mt-0.5 text-sm font-bold text-slate-700 break-words">
//           {value || "—"}
//         </p>
//       </div>
//     </div>
//   );
// }

// function FormField({ label, error, children }) {
//   return (
//     <div>
//       <label className="mb-1.5 block text-sm font-bold text-gray-700">
//         {label}
//       </label>
//       {children}
//       {error && (
//         <p className="mt-1 text-sm text-red-500 font-medium">{error.message}</p>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { seekerService } from "@/lib/api/seeker";
import {
  Loader2,
  Save,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Pencil,
  X,
  Mail,
  Phone,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  contactNumber: z.string().min(10, "Valid phone number is required"),
  skills: z.string().min(3, "Skills are required"),
  experience: z.string().min(1, "Experience is required"),
  qualification: z.enum(["MASTERS", "PHD", "BACHELORS", "PLUS_TWO"], {
    required_error: "Qualification is required",
  }),
});

export default function SeekerProfile() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["seeker-profile"],
    queryFn: seekerService.getProfile,
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: (data) =>
      profile
        ? seekerService.updateProfile(data)
        : seekerService.createProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["seeker-profile"]);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Action failed"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    values: profile || {},
  });

  if (isLoading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
      </div>
    );

  const hasProfile = !!profile && !profile?.message;

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Professional Profile
          </h1>
          <p className="text-sm text-gray-500">
            Manage how you appear to recruiters
          </p>
        </div>
        {!isEditing && hasProfile && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-primary-hover transition-all active:scale-95"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {hasProfile && !isEditing ? (
        /* DETAIL VIEW */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary font-bold text-2xl">
                  {profile.firstName[0]}
                  {profile.lastName[0]}
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h2>
                <span className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                  <CheckCircle size={14} className="text-green-500" /> Verified
                  Seeker
                </span>
              </div>
              <div className="mt-8 space-y-4 border-t border-gray-50 pt-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" /> {profile.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={16} className="text-gray-400" />{" "}
                  {profile.contactNumber}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                <Sparkles size={16} className="text-brand-primary" /> Career
                Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DetailRow
                  icon={GraduationCap}
                  label="Qualification"
                  value={profile.qualification?.replace("_", " ")}
                />
                <DetailRow
                  icon={Briefcase}
                  label="Experience"
                  value={`${profile.experience} Years`}
                />
              </div>

              <div className="mt-10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
                  Top Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.split(",").map((s, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* FORM VIEW */
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <form
            onSubmit={handleSubmit((d) => updateMutation.mutate(d))}
            className="p-6 md:p-8 space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="First Name" error={errors.firstName}>
                <input
                  {...register("firstName")}
                  className="modern-input"
                  placeholder="John"
                />
              </InputGroup>
              <InputGroup label="Last Name" error={errors.lastName}>
                <input
                  {...register("lastName")}
                  className="modern-input"
                  placeholder="Doe"
                />
              </InputGroup>
              <InputGroup label="Contact Number" error={errors.contactNumber}>
                <input
                  {...register("contactNumber")}
                  className="modern-input"
                  placeholder="98XXXXXXXX"
                />
              </InputGroup>
              <InputGroup
                label="Highest Qualification"
                error={errors.qualification}
              >
                <select {...register("qualification")} className="modern-input">
                  <option value="PLUS_TWO">Plus Two</option>
                  <option value="BACHELORS">Bachelor's</option>
                  <option value="MASTERS">Master's</option>
                  <option value="PHD">PhD</option>
                </select>
              </InputGroup>
              <InputGroup label="Years of Experience" error={errors.experience}>
                <input
                  type="number"
                  {...register("experience")}
                  className="modern-input"
                  placeholder="2"
                />
              </InputGroup>
              <div className="md:col-span-2">
                <InputGroup
                  label="Skills (Comma separated)"
                  error={errors.skills}
                >
                  <textarea
                    {...register("skills")}
                    className="modern-input h-24 resize-none"
                    placeholder="React, Node.js..."
                  />
                </InputGroup>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
              {hasProfile && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800"
                >
                  Cancel
                </button>
              )}
              <button
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-brand-primary px-8 py-2.5 text-sm font-bold text-white shadow-md hover:bg-brand-primary-hover transition-all"
              >
                {updateMutation.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-brand-primary border border-gray-100">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
          {label}
        </p>
        <p className="text-base font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function InputGroup({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
      {children}
      {error && (
        <p className="text-xs font-bold text-red-500 ml-1 mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
}
