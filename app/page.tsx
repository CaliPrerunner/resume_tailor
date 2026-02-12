"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  FileText, 
  Briefcase, 
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Trophy,
  Target,
  ChevronDown,
  Loader2
} from "lucide-react";
import { genRecs } from "./utils/actions";
import ReactMarkdown from 'react-markdown';
import { marked } from 'marked';

type Step = "welcome" | "job-desc" | "resume" | "recommendations" | "tailored";

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeInfo, setResumeInfo] = useState("");
  const [direction, setDirection] = useState(1);
  const [llmresult, setLlmresult] = useState("");
  const [tailoredResult, setTailoredResult] = useState("");
  const [loading, setLoading] = useState(false);

  const goToStep = (nextStep: Step, dir: number = 1) => {
    setDirection(dir);
    setStep(nextStep);
  };

  const wordCount = (text: string) => text.trim() ? text.trim().split(/\s+/).length : 0;

  const copyToRichText = async (text: string) => {
    try {
      const html = await marked.parse(text);
      const blobHtml = new Blob([html], { type: 'text/html' });
      const blobText = new Blob([text], { type: 'text/plain' });
      const data = [new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText,
      })];
      await navigator.clipboard.write(data);
      alert("Copied as rich text!");
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback to plain text if rich text copy fails
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }),
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-cream">
      <div className="w-full max-w-2xl relative overflow-hidden flex items-center">
        <AnimatePresence mode="wait" custom={direction}>
          {step === "welcome" && (
            <motion.div
              key="welcome"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full text-center glass-card p-8 md:p-12 shadow-xl"
            >
              <div className="mb-6 flex justify-center">
                <div className="bg-sage-light p-4 rounded-md">
                  <Sparkles className="w-12 h-12 text-sage-dark" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-sage-deep">Resume Tailor</h1>
              <p className="text-lg text-sage-dark mb-8">
                Welcome! Let's help you tailor your resume for your next career move! This tool is aimed at tailoring your skills and experiences to align with job requirements.
              </p>
              <button
                onClick={() => goToStep("job-desc")}
                className="bg-sage-dark hover:bg-sage-deep text-white px-8 py-4 rounded-md font-semibold transition-all flex items-center gap-2 group shadow-md"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === "job-desc" && (
            <motion.div
              key="job-desc"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full glass-card p-8 md:p-10 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-6 h-6 text-sage-dark" />
                <h2 className="text-2xl font-semibold text-sage-deep">Job Description</h2>
              </div>
              <p className="text-sage-dark mb-4">Paste the full job description you're targeting below.</p>
              <div className="relative mb-6">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full h-64 p-4 rounded-md border border-sage-medium focus:ring-2 focus:ring-sage-dark focus:border-transparent outline-none transition-all resize-none bg-white/50 text-sage-deep"
                  placeholder="Paste job description here..."
                />
                <div className="absolute bottom-4 right-4 text-sm font-medium text-sage-dark bg-sage-light px-3 py-1 rounded-md border border-sage-medium">
                  {wordCount(jobDescription)} words
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => goToStep("welcome", -1)}
                  className="flex items-center gap-1 text-sage-dark hover:text-sage-deep font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => goToStep("resume")}
                  disabled={!jobDescription.trim()}
                  className="flex items-center gap-2 bg-sage-dark hover:bg-sage-deep disabled:bg-sage-medium disabled:cursor-not-allowed text-white px-6 py-3 rounded-md font-medium transition-all"
                >
                  Next Step <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === "resume" && (
            <motion.div
              key="resume"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full glass-card p-8 md:p-10 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-sage-dark" />
                <h2 className="text-2xl font-semibold text-sage-deep">Your Resume</h2>
              </div>
              <p className="text-sage-dark mb-4">Paste your current resume experiences below.</p>
              <div className="mb-6">
                <textarea
                  value={resumeInfo}
                  onChange={(e) => setResumeInfo(e.target.value)}
                  className="w-full h-64 p-4 rounded-md border border-sage-medium focus:ring-2 focus:ring-sage-dark focus:border-transparent outline-none transition-all resize-none bg-white/50 text-sage-deep"
                  placeholder="Paste resume info here..."
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => goToStep("job-desc", -1)}
                  className="flex items-center gap-1 text-sage-dark hover:text-sage-deep font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={async () =>{
                  setLoading(true);
                  const llmresult = await genRecs(jobDescription, resumeInfo, 'recommend');
                  setLlmresult(llmresult);
                  setLoading(false);
                  goToStep("recommendations");
                }
                  }
                  disabled={!resumeInfo.trim() || loading}
                  className="flex items-center gap-2 bg-sage-dark hover:bg-sage-deep disabled:bg-sage-medium disabled:cursor-not-allowed text-white px-6 py-3 rounded-md font-medium transition-all"
                >
                  {loading ? (
                    <>Processing <Loader2 className="w-5 h-5 animate-spin" /></>
                  ) : (
                    <>Analyze <CheckCircle2 className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === "recommendations" && (
            <motion.div
              key="recommendations"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full glass-card p-6 md:p-8 shadow-xl max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-sage-light p-2 rounded-md">
                  <Trophy className="w-6 h-6 text-sage-dark" />
                </div>
                <h2 className="text-2xl font-semibold text-sage-deep">Recommended Experiences</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 mb-4 custom-scrollbar relative group">
                <div className="prose prose-sage max-w-none text-sage-deep">
                  <ReactMarkdown
                    components={{
                      h2: ({ ...props }) => <h2 className="text-xl font-bold mt-6 mb-3 text-sage-deep border-b border-sage-medium pb-2" {...props} />,
                      h3: ({ ...props }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-sage-deep" {...props} />,
                      p: ({ ...props }) => <p className="mb-4 text-sage-dark leading-relaxed" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc list-outside ml-5 mb-4 space-y-2 text-sage-dark" {...props} />,
                      ol: ({ ...props }) => <ol className="list-decimal list-outside ml-5 mb-4 space-y-2 text-sage-dark" {...props} />,
                      li: ({ ...props }) => <li className="pl-1" {...props} />,
                      strong: ({ ...props }) => <strong className="font-bold text-sage-deep" {...props} />,
                      hr: () => <hr className="my-6 border-sage-medium" />,
                    }}
                  >
                    {llmresult}
                  </ReactMarkdown>
                </div>

                <div className="mt-8 p-6 bg-sage-light/40 border-2 border-dashed border-sage-medium rounded-md text-center mb-4">
                  <p className="text-md font-medium text-sage-deep mb-4">
                    Would you like us to tailor these experiences specifically to this job description?
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={async () => {
                        setLoading(true);
                        const tailored = await genRecs(jobDescription, resumeInfo, 'tailor');
                        setTailoredResult(tailored);
                        setLoading(false);
                        goToStep("tailored");
                      }}
                      disabled={loading}
                      className="px-6 py-2 bg-sage-dark hover:bg-sage-deep disabled:bg-sage-medium disabled:cursor-not-allowed text-white rounded-md transition-all flex items-center gap-2 font-medium shadow-sm active:scale-95 cursor-pointer"
                    >
                      {loading ? (
                        <>Tailoring <Loader2 className="w-4 h-4 animate-spin" /></>
                      ) : (
                        'Yes, Tailor It'
                      )}
                    </button>
                    <button
                      onClick={() => goToStep("welcome", -1)}
                      className="px-6 py-2 bg-white hover:bg-sage-light border border-sage-medium text-sage-dark rounded-md transition-all font-medium shadow-sm active:scale-95 cursor-pointer"
                    >
                      No, Thanks
                    </button>
                  </div>
                </div>

                {/* Gentle Scroll Indicator */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="sticky bottom-0 left-0 right-0 flex justify-center pb-2 pointer-events-none"
                >
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="bg-white/80 backdrop-blur-sm rounded-md p-1 border border-sage-medium text-sage-dark/50"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-sage-light">
                <div className="flex justify-start">
                  <button
                    onClick={() => goToStep("resume", -1)}
                    className="flex items-center gap-1 text-sage-dark hover:text-sage-deep font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "tailored" && (
            <motion.div
              key="tailored"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full glass-card p-8 md:p-10 shadow-xl max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-sage-deep">Tailored Experience</h2>
                <button 
                  onClick={() => copyToRichText(tailoredResult || "")}
                  disabled={!tailoredResult}
                  className="flex items-center gap-2 bg-sage-light hover:bg-sage-medium disabled:opacity-60 disabled:cursor-not-allowed text-sage-deep px-4 py-2 rounded-md transition-all text-sm font-medium"
                >
                  <Copy className="w-4 h-4" /> Copy Text
                </button>
              </div>
              
              <div className="bg-white/50 border border-sage-medium rounded-md p-6 text-sage-deep leading-relaxed mb-8 overflow-y-auto">
                {tailoredResult ? (
                  <ReactMarkdown
                    components={{
                      h2: ({ ...props }) => <h2 className="text-xl font-bold mt-4 mb-2 text-sage-deep" {...props} />,
                      h3: ({ ...props }) => <h3 className="text-lg font-semibold mt-3 mb-2 text-sage-deep" {...props} />,
                      p: ({ ...props }) => <p className="mb-3 text-sage-dark leading-relaxed" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc list-outside ml-5 mb-3 space-y-2 text-sage-dark" {...props} />,
                      ol: ({ ...props }) => <ol className="list-decimal list-outside ml-5 mb-3 space-y-2 text-sage-dark" {...props} />,
                      li: ({ ...props }) => <li className="pl-1" {...props} />,
                      strong: ({ ...props }) => <strong className="font-bold text-sage-deep" {...props} />,
                      hr: () => <hr className="my-4 border-sage-medium" />,
                    }}
                  >
                    {tailoredResult}
                  </ReactMarkdown>
                ) : (
                  <p className="text-sage-dark">Generating tailored content...</p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => goToStep("recommendations", -1)}
                  className="flex items-center gap-1 text-sage-dark hover:text-sage-deep font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => {
                    setJobDescription("");
                    setResumeInfo("");
                    goToStep("welcome", -1);
                  }}
                  className="bg-sage-dark hover:bg-sage-deep text-white px-8 py-2 rounded-md font-medium transition-all"
                >
                  Start Over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-8 flex gap-2">
        {(["welcome", "job-desc", "resume", "recommendations", "tailored"] as Step[]).map((s, i) => (
          <div 
            key={s} 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              step === s ? "w-6 bg-sage-dark" : "bg-sage-medium"
            }`} 
          />
        ))}
      </div>
    </main>
  );
}
