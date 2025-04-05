import { ArrowRight } from "lucide-react"

export default function ContactForm() {
  return (
    <section className="py-12 bg-[#f8f5ef]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <span className="text-[#ff8a3c] font-medium">CONTACT US</span>
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <form className="space-y-4">
              <input type="text" placeholder="Enter Your name" className="input-field" />
              <input type="email" placeholder="Enter Your email" className="input-field" />
              <input type="tel" placeholder="Enter Your Phone number" className="input-field" />
              <input type="text" placeholder="Enter Your Subject" className="input-field" />
              <textarea placeholder="Enter Your Message" className="input-field min-h-[150px]"></textarea>
              <button className="btn-primary inline-flex items-center">
                <span>Send Message</span>
                <ArrowRight size={16} className="ml-2" />
              </button>
            </form>
          </div>
          <div className="h-[400px] md:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986432970718!3d40.697149422113014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1648651025336!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}

