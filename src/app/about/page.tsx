"use client";

import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Professional Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="pt-20">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-20 text-center"
        >
          <div className="max-w-4xl mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-slate-800 mb-6"
            >
              About Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-slate-600 mb-8 leading-relaxed"
            >
              NYK-FIL Maritime E-Training, Inc. (NETI) is the training arm of
              NYK-Fil Ship Management, Inc. An ISO 9001:2008 certified company,
              it is engaged in maritime training using state-of-the-art
              equipment for marine officers and ratings (non-officers) and
              develops customized training courses designed to meet the specific
              requirements of Principals.
            </motion.p>
          </div>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-20 bg-gradient-to-br from-slate-50 to-blue-50"
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-slate-800 mb-6">
                  Our Vision
                </h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Preferred provider of quality maritime training.
                </p>
                <h2 className="text-4xl font-bold text-slate-800 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  We are committed to provide quality maritime training to
                  sea-farers of NYK Line and to the maritime industry and
                  provide fair return of investment to our shareholders. <br />{" "}
                  <br /> Towards the realization of our mission, we will:
                </p>
                <ul className="text-lg text-slate-600 space-y-4 list-none">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl mt-1">•</span>
                    <span>
                      Provide excellent and relevant maritime training focused
                      on technical competence, safety, and environmental
                      protection
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl mt-1">•</span>
                    <span>
                      Update our training resources and capabilities aligned
                      with the requirements of NYK Line and the maritime
                      industry
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl mt-1">•</span>
                    <span>
                      Continue to strengthen the values of discipline,
                      integrity, innovation, intensity, loyalty, respect, hard
                      work, unity, stewardship, strong sense of community and
                      flexibility among our trainees and employees
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl mt-1">•</span>
                    <span>
                      Continuously improve and innovate our internal systems and
                      processes to efficiently and effectively meet the needs of
                      our stakeholders
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl mt-1">•</span>
                    <span>
                      Participate in activities that advance the interests of
                      the Filipino seafarers and the community where we operate
                    </span>
                  </li>
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-slate-800 mb-6">
                  Quality Policy
                </h3>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  The NYK-FIL Maritime E-Training, Inc. (NETI) is comitted to
                  providing maritime related training to its clients. As we
                  exercise self-governance, impartiality, and confidentiality in
                  the conduct of our training, we focus on meeting the needs of
                  our customers thereby assuring them of competent and quality
                  training. <br /> <br /> The highest standards set by the
                  organization serve as our guide in the pursuit of continuous
                  improvement for service excellence.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
