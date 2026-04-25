import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, ChevronRight, X } from "lucide-react";
import { apiGet } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Question {
  _id: string;
  text: string;
  category: string;
  difficulty: string;
  image?: string;
}

// Define categories with display labels and keywords
const CATEGORIES = [
  {
    id: "ACR",
    label: "ACR",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-700",
    keywords: ["ACR"],
    tags: ["ACR"],
  },
  {
    id: "ANCA",
    label: "ANCA",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    borderColor: "border-purple-300 dark:border-purple-700",
    keywords: ["ANCA"],
    tags: ["ANCA"],
  },
  {
    id: "APS",
    label: "APS",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    borderColor: "border-orange-300 dark:border-orange-700",
    keywords: ["APS"],
    tags: ["APS"],
  },
  {
    id: "Ankylosing-spondylitis",
    label: "Ankylosing spondylitis",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    borderColor: "border-yellow-300 dark:border-yellow-700",
    keywords: ["Ankylosing∷spondylitis"],
    tags: ["Ankylosing∷spondylitis"],
  },
  {
    id: "Beevor",
    label: "Beevor",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    borderColor: "border-red-300 dark:border-red-700",
    keywords: ["Beevor"],
    tags: ["Beevor"],
  },
  {
    id: "Behcets",
    label: "Behcets",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    borderColor: "border-pink-300 dark:border-pink-700",
    keywords: ["Behcets"],
    tags: ["Behcets"],
  },
  {
    id: "Bisphosphonates-osteoporosis",
    label: "Bisphosphonates osteoporosis",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    borderColor: "border-teal-300 dark:border-teal-700",
    keywords: ["Bisphosphonates∷osteoporosis"],
    tags: ["Bisphosphonates∷osteoporosis"],
  },
  {
    id: "CAPS",
    label: "CAPS",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    borderColor: "border-indigo-300 dark:border-indigo-700",
    keywords: ["CAPS"],
    tags: ["CAPS"],
  },
  {
    id: "CPPD",
    label: "CPPD",
    color: "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
    borderColor: "border-stone-300 dark:border-stone-700",
    keywords: ["CPPD"],
    tags: ["CPPD"],
  },
  {
    id: "CRPS",
    label: "CRPS",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    borderColor: "border-green-300 dark:border-green-700",
    keywords: ["CRPS"],
    tags: ["CRPS"],
  },
  {
    id: "Cyclophosphamide",
    label: "Cyclophosphamide",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    borderColor: "border-cyan-300 dark:border-cyan-700",
    keywords: ["Cyclophosphamide"],
    tags: ["Cyclophosphamide"],
  },
  {
    id: "DADA2",
    label: "DADA2",
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    borderColor: "border-rose-300 dark:border-rose-700",
    keywords: ["DADA2"],
    tags: ["DADA2"],
  },
  {
    id: "Drug-induced-SLE",
    label: "Drug-induced SLE",
    color: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
    borderColor: "border-lime-300 dark:border-lime-700",
    keywords: ["Drug-induced∷SLE"],
    tags: ["Drug-induced∷SLE"],
  },
  {
    id: "EGPA",
    label: "EGPA",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    borderColor: "border-amber-300 dark:border-amber-700",
    keywords: ["EGPA"],
    tags: ["EGPA"],
  },
  {
    id: "EMG",
    label: "EMG",
    color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    borderColor: "border-violet-300 dark:border-violet-700",
    keywords: ["EMG"],
    tags: ["EMG"],
  },
  {
    id: "Fabry",
    label: "Fabry",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    borderColor: "border-emerald-300 dark:border-emerald-700",
    keywords: ["Fabry"],
    tags: ["Fabry"],
  },
  {
    id: "GCA",
    label: "GCA",
    color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    borderColor: "border-sky-300 dark:border-sky-700",
    keywords: ["GCA"],
    tags: ["GCA"],
  },
  {
    id: "GPA-MPA",
    label: "GPA / MPA",
    color: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
    borderColor: "border-fuchsia-300 dark:border-fuchsia-700",
    keywords: ["GPA/MPA"],
    tags: ["GPA/MPA"],
  },
  {
    id: "Gauchers",
    label: "Gauchers",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-700",
    keywords: ["Gaucher's"],
    tags: ["Gaucher's"],
  },
  {
    id: "HPFS",
    label: "HPFS",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    borderColor: "border-purple-300 dark:border-purple-700",
    keywords: ["HPFS"],
    tags: ["HPFS"],
  },
  {
    id: "HSP",
    label: "HSP",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    borderColor: "border-orange-300 dark:border-orange-700",
    keywords: ["HSP"],
    tags: ["HSP"],
  },
  {
    id: "Hypophosphatasia",
    label: "Hypophosphatasia",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    borderColor: "border-yellow-300 dark:border-yellow-700",
    keywords: ["Hypophosphatasia"],
    tags: ["Hypophosphatasia"],
  },
  {
    id: "ILD",
    label: "ILD",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    borderColor: "border-red-300 dark:border-red-700",
    keywords: ["ILD"],
    tags: ["ILD"],
  },
  {
    id: "INBUILD",
    label: "INBUILD",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    borderColor: "border-pink-300 dark:border-pink-700",
    keywords: ["INBUILD"],
    tags: ["INBUILD"],
  },
  {
    id: "IRIS",
    label: "IRIS",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    borderColor: "border-teal-300 dark:border-teal-700",
    keywords: ["IRIS"],
    tags: ["IRIS"],
  },
  {
    id: "IgG4-histology",
    label: "IgG4 histology",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    borderColor: "border-indigo-300 dark:border-indigo-700",
    keywords: ["IgG4∷histology"],
    tags: ["IgG4∷histology"],
  },
  {
    id: "Immunocompromised-infection",
    label: "Immunocompromised infection",
    color: "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
    borderColor: "border-stone-300 dark:border-stone-700",
    keywords: ["Immunocompromised∷infection"],
    tags: ["Immunocompromised∷infection"],
  },
  {
    id: "JIA",
    label: "JIA",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    borderColor: "border-green-300 dark:border-green-700",
    keywords: ["JIA"],
    tags: ["JIA"],
  },
  {
    id: "Kawasaki",
    label: "Kawasaki",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    borderColor: "border-cyan-300 dark:border-cyan-700",
    keywords: ["Kawasaki"],
    tags: ["Kawasaki"],
  },
  {
    id: "LCV",
    label: "LCV",
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    borderColor: "border-rose-300 dark:border-rose-700",
    keywords: ["LCV"],
    tags: ["LCV"],
  },
  {
    id: "LCV-IgA",
    label: "LCV IgA",
    color: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
    borderColor: "border-lime-300 dark:border-lime-700",
    keywords: ["LCV∷IgA"],
    tags: ["LCV∷IgA"],
  },
  {
    id: "Lyme",
    label: "Lyme",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    borderColor: "border-amber-300 dark:border-amber-700",
    keywords: ["Lyme"],
    tags: ["Lyme"],
  },
  {
    id: "MCTD",
    label: "MCTD",
    color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    borderColor: "border-violet-300 dark:border-violet-700",
    keywords: ["MCTD"],
    tags: ["MCTD"],
  },
  {
    id: "MRH",
    label: "MRH",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    borderColor: "border-emerald-300 dark:border-emerald-700",
    keywords: ["MRH"],
    tags: ["MRH"],
  },
  {
    id: "MSK",
    label: "MSK",
    color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    borderColor: "border-sky-300 dark:border-sky-700",
    keywords: ["MSK"],
    tags: ["MSK"],
  },
  {
    id: "MSK-neuropathy",
    label: "MSK neuropathy",
    color: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
    borderColor: "border-fuchsia-300 dark:border-fuchsia-700",
    keywords: ["MSK∷neuropathy"],
    tags: ["MSK∷neuropathy"],
  },
  {
    id: "MMF",
    label: "MMF",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-700",
    keywords: ["MMF"],
    tags: ["MMF"],
  },
  {
    id: "Medication",
    label: "Medication",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    borderColor: "border-purple-300 dark:border-purple-700",
    keywords: ["Medication"],
    tags: ["Medication"],
  },
  {
    id: "Methotrexate",
    label: "Methotrexate",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    borderColor: "border-orange-300 dark:border-orange-700",
    keywords: ["Methotrexate"],
    tags: ["Methotrexate"],
  },
  {
    id: "NCV-EMG-mulitple-sclerosis",
    label: "NCV / EMG mulitple sclerosis",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    borderColor: "border-yellow-300 dark:border-yellow-700",
    keywords: ["NCV/EMG∷mulitple∷sclerosis"],
    tags: ["NCV/EMG∷mulitple∷sclerosis"],
  },
  {
    id: "Ophthalmology",
    label: "Ophthalmology",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    borderColor: "border-red-300 dark:border-red-700",
    keywords: ["Ophthalmology"],
    tags: ["Ophthalmology"],
  },
  {
    id: "PAN",
    label: "PAN",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    borderColor: "border-pink-300 dark:border-pink-700",
    keywords: ["PAN"],
    tags: ["PAN"],
  },
  {
    id: "PMR",
    label: "PMR",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    borderColor: "border-teal-300 dark:border-teal-700",
    keywords: ["PMR"],
    tags: ["PMR"],
  },
  {
    id: "Parvovirus",
    label: "Parvovirus",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    borderColor: "border-indigo-300 dark:border-indigo-700",
    keywords: ["Parvovirus"],
    tags: ["Parvovirus"],
  },
  {
    id: "RCVS",
    label: "RCVS",
    color: "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
    borderColor: "border-stone-300 dark:border-stone-700",
    keywords: ["RCVS"],
    tags: ["RCVS"],
  },
  {
    id: "RTA",
    label: "RTA",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    borderColor: "border-green-300 dark:border-green-700",
    keywords: ["RTA"],
    tags: ["RTA"],
  },
  {
    id: "Relapsing-polychondritis",
    label: "Relapsing polychondritis",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    borderColor: "border-cyan-300 dark:border-cyan-700",
    keywords: ["Relapsing∷polychondritis"],
    tags: ["Relapsing∷polychondritis"],
  },
  {
    id: "Rheumatoid-arthritis",
    label: "Rheumatoid arthritis",
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    borderColor: "border-rose-300 dark:border-rose-700",
    keywords: ["Rheumatoid∷arthritis"],
    tags: ["Rheumatoid∷arthritis"],
  },
  {
    id: "Rituximab",
    label: "Rituximab",
    color: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
    borderColor: "border-lime-300 dark:border-lime-700",
    keywords: ["Rituximab"],
    tags: ["Rituximab"],
  },
  {
    id: "SLE",
    label: "SLE",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    borderColor: "border-amber-300 dark:border-amber-700",
    keywords: ["SLE"],
    tags: ["SLE"],
  },
  {
    id: "SONK-knee-pain",
    label: "SONK knee pain",
    color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    borderColor: "border-violet-300 dark:border-violet-700",
    keywords: ["SONK∷knee∷pain"],
    tags: ["SONK∷knee∷pain"],
  },
  {
    id: "Sjogrens",
    label: "Sjogrens",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    borderColor: "border-emerald-300 dark:border-emerald-700",
    keywords: ["Sjogren's"],
    tags: ["Sjogren's"],
  },
  {
    id: "TNFi-neurology",
    label: "TNFi neurology",
    color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    borderColor: "border-sky-300 dark:border-sky-700",
    keywords: ["TNFi∷neurology"],
    tags: ["TNFi∷neurology"],
  },
  {
    id: "Thyroid",
    label: "Thyroid",
    color: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
    borderColor: "border-fuchsia-300 dark:border-fuchsia-700",
    keywords: ["Thyroid"],
    tags: ["Thyroid"],
  },
  {
    id: "VEXAS",
    label: "VEXAS",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-700",
    keywords: ["VEXAS"],
    tags: ["VEXAS"],
  },
  {
    id: "Anemia",
    label: "Anemia",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    borderColor: "border-purple-300 dark:border-purple-700",
    keywords: ["anemia"],
    tags: ["anemia"],
  },
  {
    id: "Arthritis",
    label: "Arthritis",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    borderColor: "border-orange-300 dark:border-orange-700",
    keywords: ["arthritis"],
    tags: ["arthritis"],
  },
  {
    id: "Autoinflammatory",
    label: "Autoinflammatory",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    borderColor: "border-yellow-300 dark:border-yellow-700",
    keywords: ["autoinflammatory"],
    tags: ["autoinflammatory"],
  },
  {
    id: "Biologic",
    label: "Biologic",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    borderColor: "border-red-300 dark:border-red-700",
    keywords: ["biologic"],
    tags: ["biologic"],
  },
  {
    id: "Chilblains",
    label: "Chilblains",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    borderColor: "border-pink-300 dark:border-pink-700",
    keywords: ["chilblains"],
    tags: ["chilblains"],
  },
  {
    id: "Crystal-tag",
    label: "Crystal",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    borderColor: "border-teal-300 dark:border-teal-700",
    keywords: ["crystal"],
    tags: ["crystal"],
  },
  {
    id: "Diabetes",
    label: "Diabetes",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    borderColor: "border-indigo-300 dark:border-indigo-700",
    keywords: ["diabetes"],
    tags: ["diabetes"],
  },
  {
    id: "Gene",
    label: "Gene",
    color: "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
    borderColor: "border-stone-300 dark:border-stone-700",
    keywords: ["gene"],
    tags: ["gene"],
  },
  {
    id: "Glycogen-storage-disease",
    label: "Glycogen storage disease",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    borderColor: "border-green-300 dark:border-green-700",
    keywords: ["glycogen∷storage∷disease"],
    tags: ["glycogen∷storage∷disease"],
  },
  {
    id: "Gout-tag",
    label: "Gout",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    borderColor: "border-cyan-300 dark:border-cyan-700",
    keywords: ["gout"],
    tags: ["gout"],
  },
  {
    id: "Hematology",
    label: "Hematology",
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    borderColor: "border-rose-300 dark:border-rose-700",
    keywords: ["hematology"],
    tags: ["hematology"],
  },
  {
    id: "Histology-tag",
    label: "Histology",
    color: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
    borderColor: "border-lime-300 dark:border-lime-700",
    keywords: ["histology"],
    tags: ["histology"],
  },
  {
    id: "Hyperparathyroidism",
    label: "Hyperparathyroidism",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    borderColor: "border-amber-300 dark:border-amber-700",
    keywords: ["hyperparathyroidism"],
    tags: ["hyperparathyroidism"],
  },
  {
    id: "Hyperparathyroidism-osteoporosis",
    label: "Hyperparathyroidism osteoporosis",
    color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    borderColor: "border-violet-300 dark:border-violet-700",
    keywords: ["hyperparathyroidism∷osteoporosis"],
    tags: ["hyperparathyroidism∷osteoporosis"],
  },
  {
    id: "Iliopsoas",
    label: "Iliopsoas",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    borderColor: "border-emerald-300 dark:border-emerald-700",
    keywords: ["iliopsoas"],
    tags: ["iliopsoas"],
  },
  {
    id: "Immunology-tag",
    label: "Immunology",
    color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    borderColor: "border-sky-300 dark:border-sky-700",
    keywords: ["immunology"],
    tags: ["immunology"],
  },
  {
    id: "Infection-tag",
    label: "Infection",
    color: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
    borderColor: "border-fuchsia-300 dark:border-fuchsia-700",
    keywords: ["infection"],
    tags: ["infection"],
  },
  {
    id: "Inflammation-tag",
    label: "Inflammation",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-700",
    keywords: ["inflammation"],
    tags: ["inflammation"],
  },
  {
    id: "Knee-pain",
    label: "Knee pain",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    borderColor: "border-purple-300 dark:border-purple-700",
    keywords: ["knee∷pain"],
    tags: ["knee∷pain"],
  },
  {
    id: "Maneuvers-tag",
    label: "Maneuvers",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    borderColor: "border-orange-300 dark:border-orange-700",
    keywords: ["maneuvers"],
    tags: ["maneuvers"],
  },
  {
    id: "Metabolic-tag",
    label: "Metabolic",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    borderColor: "border-yellow-300 dark:border-yellow-700",
    keywords: ["metabolic"],
    tags: ["metabolic"],
  },
  {
    id: "Miscellaneous-tag",
    label: "Miscellaneous",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    borderColor: "border-red-300 dark:border-red-700",
    keywords: ["miscellaneous"],
    tags: ["miscellaneous"],
  },
  {
    id: "Myopathy-tag",
    label: "Myopathy",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    borderColor: "border-pink-300 dark:border-pink-700",
    keywords: ["myopathy"],
    tags: ["myopathy"],
  },
  {
    id: "Myositis-tag",
    label: "Myositis",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    borderColor: "border-teal-300 dark:border-teal-700",
    keywords: ["myositis"],
    tags: ["myositis"],
  },
  {
    id: "Neurology-tag",
    label: "Neurology",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    borderColor: "border-indigo-300 dark:border-indigo-700",
    keywords: ["neurology"],
    tags: ["neurology"],
  },
  {
    id: "Neuropathy-tag",
    label: "Neuropathy",
    color: "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
    borderColor: "border-stone-300 dark:border-stone-700",
    keywords: ["neurology"],
    tags: ["neuropathy"],
  },
  {
    id: "Orthopedic",
    label: "Orthopedic",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    borderColor: "border-green-300 dark:border-green-700",
    keywords: ["orthopedic"],
    tags: ["orthopedic"],
  },
  {
    id: "Osteoarthritis-tag",
    label: "Osteoarthritis",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    borderColor: "border-cyan-300 dark:border-cyan-700",
    keywords: ["osteoarthritis"],
    tags: ["osteoarthritis"],
  },
  {
    id: "Osteomalacia-tag",
    label: "Osteomalacia",
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    borderColor: "border-rose-300 dark:border-rose-700",
    keywords: ["osteomalacia"],
    tags: ["osteomalacia"],
  },
  {
    id: "Osteoporosis-tag",
    label: "Osteoporosis",
    color: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
    borderColor: "border-lime-300 dark:border-lime-700",
    keywords: ["osteoporosis"],
    tags: ["osteoporosis"],
  },
  {
    id: "Panniculitis-tag",
    label: "Panniculitis",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    borderColor: "border-amber-300 dark:border-amber-700",
    keywords: ["panniculitis"],
    tags: ["panniculitis"],
  },
  {
    id: "Pediatric-tag",
    label: "Pediatric",
    color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    borderColor: "border-violet-300 dark:border-violet-700",
    keywords: ["pediatric"],
    tags: ["pediatric"],
  },
  {
    id: "Piriformis-tag",
    label: "Piriformis",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    borderColor: "border-emerald-300 dark:border-emerald-700",
    keywords: ["piriformis"],
    tags: ["piriformis"],
  },
  {
    id: "Pregnancy-tag",
    label: "Pregnancy",
    color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    borderColor: "border-sky-300 dark:border-sky-700",
    keywords: ["pregnancy"],
    tags: ["pregnancy"],
  },
  {
    id: "Radiology-tag",
    label: "Radiology",
    color: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
    borderColor: "border-fuchsia-300 dark:border-fuchsia-700",
    keywords: ["radiology"],
    tags: ["radiology"],
  },
  {
    id: "Sarcoidosis-tag",
    label: "Sarcoidosis",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-700",
    keywords: ["sarcoidosis"],
    tags: ["sarcoidosis"],
  },
  {
    id: "Scleroderma-tag",
    label: "Scleroderma",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    borderColor: "border-purple-300 dark:border-purple-700",
    keywords: ["scleroderma"],
    tags: ["scleroderma"],
  },
  {
    id: "Scleroderma-mimic",
    label: "Scleroderma mimic",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    borderColor: "border-orange-300 dark:border-orange-700",
    keywords: ["scleroderma∷mimic"],
    tags: ["scleroderma∷mimic"],
  },
  {
    id: "Septic-arthritis",
    label: "Septic arthritis",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    borderColor: "border-yellow-300 dark:border-yellow-700",
    keywords: ["septic∷arthritis"],
    tags: ["septic∷arthritis"],
  },
  {
    id: "Skin-tag",
    label: "Skin",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    borderColor: "border-red-300 dark:border-red-700",
    keywords: ["skin"],
    tags: ["skin"],
  },
  {
    id: "Spondyloarthropathy-tag",
    label: "Spondyloarthropathy",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    borderColor: "border-pink-300 dark:border-pink-700",
    keywords: ["spondyloarthropathy"],
    tags: ["spondyloarthropathy"],
  },
  {
    id: "Tendinopathy-tag",
    label: "Tendinopathy",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    borderColor: "border-teal-300 dark:border-teal-700",
    keywords: ["tendinopathy"],
    tags: ["tendinopathy"],
  },
  {
    id: "Tuberculosis-tag",
    label: "Tuberculosis",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    borderColor: "border-indigo-300 dark:border-indigo-700",
    keywords: ["tuberculosis"],
    tags: ["tuberculosis"],
  },
  {
    id: "Vasculitis-tag",
    label: "Vasculitis",
    color: "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
    borderColor: "border-stone-300 dark:border-stone-700",
    keywords: ["vasculitis"],
    tags: ["vasculitis"],
  },
  {
    id: "Virus-tag",
    label: "Virus",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    borderColor: "border-green-300 dark:border-green-700",
    keywords: ["virus"],
    tags: ["virus"],
  },
];



// Assign a category id to a question based on DB category tag OR keyword matching
const assignCategory = (text: string, dbCategory?: string): string => {
  // First try: match by DB-stored category tag
  if (dbCategory) {
    for (const cat of CATEGORIES) {
      if (cat.tags && cat.tags.map(t => t.toLowerCase()).includes(dbCategory.toLowerCase())) {
        return cat.id;
      }
    }
    // If dbCategory itself matches a category id directly
    if (CATEGORIES.find(c => c.id.toLowerCase() === dbCategory.toLowerCase())) {
      return CATEGORIES.find(c => c.id.toLowerCase() === dbCategory.toLowerCase())!.id;
    }
  }
  // Second try: keyword matching on question text
  const lower = text.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return cat.id;
    }
  }
  return "Other";
};

const Stats = () => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await apiGet<{ questions: Question[] }>("/questions?limit=10000");
        if (res.success && res.data) {
          setAllQuestions(res.data.questions);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load questions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [toast]);

  // Categorize questions
  const categorized = allQuestions.map((q) => ({
    ...q,
    computedCategory: assignCategory(q.text, q.category),
  }));

  const categoryCounts: Record<string, number> = {};
  for (const q of categorized) {
    categoryCounts[q.computedCategory] = (categoryCounts[q.computedCategory] || 0) + 1;
  }

  // Filter questions by search or selected category
  const filteredQuestions = categorized.filter((q) => {
    const matchesSearch = searchQuery
      ? q.text.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = selectedCategory ? q.computedCategory === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const showingFiltered = !!searchQuery || !!selectedCategory;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1">
          <div className="border-b border-border">
            <div className="flex items-center h-16 px-6">
              <SidebarTrigger />
            </div>
          </div>

          <div className="p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6">Question Bank</h1>

            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                className="pl-10 pr-10 text-base h-12 rounded-xl border-border/60"
                placeholder="Search any question..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) setSelectedCategory(null);
                }}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {loading ? (
              <p className="text-muted-foreground">Loading questions...</p>
            ) : (
              <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">

                {/* LEFT: Stats + Category List */}
                <div className="space-y-6">
                  {/* Total Questions */}
                  <Card className="border-border/60 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold text-muted-foreground uppercase tracking-wider">
                        Total Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-6xl font-bold text-primary">{allQuestions.length}</p>
                      <p className="text-sm text-muted-foreground mt-1">across all categories</p>
                    </CardContent>
                  </Card>

                  {/* Categories */}
                  <Card className="border-border/60 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">Browse by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="divide-y divide-border/40">
                        {CATEGORIES.map((cat) => {
                          const count = categoryCounts[cat.id] || 0;
                          if (count === 0) return null;
                          return (
                            <li key={cat.id}>
                              <button
                                className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors hover:bg-muted/50 ${selectedCategory === cat.id ? "bg-primary/5 border-l-2 border-primary" : ""
                                  }`}
                                onClick={() => {
                                  setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                                  setSearchQuery("");
                                }}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-sm font-medium truncate">{cat.label}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                  <Badge variant="secondary" className="text-xs font-semibold">
                                    {count}
                                  </Badge>
                                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                </div>
                              </button>
                            </li>
                          );
                        })}
                        {(categoryCounts["Other"] || 0) > 0 && (
                          <li>
                            <button
                              className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors hover:bg-muted/50 ${selectedCategory === "Other" ? "bg-primary/5 border-l-2 border-primary" : ""
                                }`}
                              onClick={() => {
                                setSelectedCategory(selectedCategory === "Other" ? null : "Other");
                                setSearchQuery("");
                              }}
                            >
                              <span className="text-sm font-medium">Other / General</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs font-semibold">
                                  {categoryCounts["Other"]}
                                </Badge>
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                            </button>
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* RIGHT: Questions List */}
                <div className="space-y-4">
                  {/* Header row for filter context */}
                  {showingFiltered && (
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">
                        {filteredQuestions.length} question{filteredQuestions.length !== 1 ? "s" : ""}{" "}
                        {selectedCategory
                          ? `in "${CATEGORIES.find((c) => c.id === selectedCategory)?.label || selectedCategory}"`
                          : `matching "${searchQuery}"`}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(null);
                          setSearchQuery("");
                        }}
                      >
                        <X className="w-4 h-4 mr-1" /> Clear filter
                      </Button>
                    </div>
                  )}

                  {!showingFiltered && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Select a category from the left or search above to view specific questions.
                    </p>
                  )}

                  {/* Questions */}
                  {showingFiltered && filteredQuestions.length === 0 && (
                    <Card className="border-dashed border-border/60">
                      <CardContent className="text-center py-12 text-muted-foreground">
                        <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No questions found</p>
                        <p className="text-sm mt-1">Try a different search or category</p>
                      </CardContent>
                    </Card>
                  )}

                  {showingFiltered && filteredQuestions.length > 0 &&
                    filteredQuestions.map((q, idx) => {
                      const catMeta = CATEGORIES.find((c) => c.id === q.computedCategory);
                      return (
                        <Card
                          key={q._id}
                          className="border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
                          onClick={() => navigate(`/exam?categoryFilter=${q.computedCategory}&startId=${q._id}`)}
                        >
                          <CardContent className="p-4 flex items-start gap-4">
                            <span className="text-2xl font-bold text-muted-foreground/30 leading-none pt-0.5 w-8 shrink-0">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground/90 leading-relaxed line-clamp-3 group-hover:text-foreground transition-colors">
                                {q.text}
                              </p>
                              <div className="mt-2 flex items-center gap-2 flex-wrap">
                                {catMeta && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catMeta.color}`}>
                                    {catMeta.label}
                                  </span>
                                )}
                                {q.image && (
                                  <span className="text-xs text-muted-foreground">📷 Image answer</span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Stats;
