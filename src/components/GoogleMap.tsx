"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Phone, Clock } from "lucide-react";

export default function GoogleMap() {
  const address = "633H+PQJ, Knowledge Ave, Calamba, 4027 Laguna";
  const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dWnW2zPDxpQGY8&q=${encodeURIComponent(address)}`;
  
  const openInGoogleMaps = () => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
  };

  const openDirections = () => {
    window.open(`https://maps.google.com/maps/dir//${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <motion.section
      id="office"
      className="py-20 bg-gradient-to-br from-slate-50 to-blue-50"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Location Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              Visit Our Office
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              NETI Training Center
            </h2>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Address</h3>
                  <p className="text-slate-600 leading-relaxed">
                    633H+PQJ, Knowledge Ave<br />
                    Calamba, 4027 Laguna<br />
                    Philippines
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Contact</h3>
                  <p className="text-slate-600">
                    Phone: +63 (49) 545-0000<br />
                    Email: info@neti.com.ph
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Office Hours</h3>
                  <p className="text-slate-600">
                    Monday - Friday: 8:00 AM - 5:00 PM<br />
                    Saturday: 8:00 AM - 12:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openDirections}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
              >
                <Navigation className="w-5 h-5" />
                Get Directions
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openInGoogleMaps}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-slate-700 font-semibold rounded-lg border border-slate-300 transition-colors"
              >
                <MapPin className="w-5 h-5" />
                View in Maps
              </motion.button>
            </div>
          </motion.div>

          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200">
              <div className="relative h-96 w-full rounded-xl overflow-hidden">
                <iframe
                  src={googleMapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                  title="NETI Office Location"
                />
                
                {/* Map overlay for better UX */}
                <div className="absolute inset-0 bg-transparent hover:bg-blue-50/5 transition-colors rounded-xl pointer-events-none" />
              </div>
              
              {/* Map footer */}
              <div className="flex items-center justify-between p-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-slate-700">Live Location</span>
                </div>
                <button
                  onClick={openInGoogleMaps}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Open in Google Maps →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}