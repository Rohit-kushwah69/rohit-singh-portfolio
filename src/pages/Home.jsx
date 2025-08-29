import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp, FaTwitter } from "react-icons/fa";
import {
  ArrowRight,
  Sparkles,
  Github,
  Linkedin,
  Mail,
  Globe,
  Phone,
  Download,
  MapPin,
  Code2,
  Brush,
  Rocket,
  Star,
  ChevronRight,
  Instagram,
  Twitter,
  Youtube,
  ExternalLink,
  PlayCircle,
  Calendar,
  Award,
  Building2,
} from "lucide-react";
import API from "../services/api";


// ✅ Light theme (dark text everywhere) — Single-file React component
// No shadcn/ui. Tailwind + Framer Motion + Lucide only.

/************************** Helper UI **************************/
const SectionTitle = ({ eyebrow, title, subtitle }) => (
  <div className="mx-auto max-w-3xl text-center mb-12 px-4 sm:px-6 lg:px-8">
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-xs tracking-[0.3em] uppercase text-neutral-500"
    >
      {eyebrow}
    </motion.p>
    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-2 text-neutral-900"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-3 text-neutral-600"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-2xl border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
    <Sparkles className="w-3.5 h-3.5" /> {children}
  </span>
);


function StatCard({ icon, value, label }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-2 text-neutral-600">
        {icon} <span className="text-sm">{label}</span>
      </div>
      <div className="mt-1 text-2xl font-extrabold text-neutral-900">{value}</div>
    </div>
  );
}

/************************** Data **************************/
const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

const Home = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  const [hero, setHero] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [aboutCards, setAboutCards] = useState([]);
  // ✅ socials as an object for fixed links, now including X
  const [socials, setSocials] = useState({
    github: "",
    linkedin: "",
    instagram: "",
    whatsapp: "",
    x: "", // ✅ added X
  });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          heroRes,
          skillsRes,
          projectsRes,
          servicesRes,
          expRes,
          testimonialsRes,
          socRes,
          contactInfoRes,
          aboutRes,
        ] = await Promise.all([
          API.get("/heroGet"),
          API.get("/skillDisplay"),
          API.get("/display"),
          API.get("/serviceDisplay"),
          API.get("/experienceDisplay"),
          API.get("/testimonialDisplay"),
          API.get("/socialDisplay"),
          API.get("/contactInfoDisplay"),
          API.get("/aboutDisplay"),
        ]);

        if (heroRes.data.success) setHero(heroRes.data.hero || null);
        if (skillsRes.data.success) setSkills(skillsRes.data.skills || []);
        if (projectsRes.data.success) setProjects(projectsRes.data.projects || []);
        if (servicesRes.data.success) setServices(servicesRes.data.services || []);
        if (expRes.data.success) setExperiences(expRes.data.experiences || []);
        if (testimonialsRes.data.success) setTestimonials(testimonialsRes.data.testimonials || []);
        if (contactInfoRes.data.success) {
          setContacts(contactInfoRes.data.data[0] || null); // ek hi record store karo
        }
        if (aboutRes.data.success) setAboutCards(aboutRes.data.aboutCards || []);

        // ✅ Set socials object, now including X
        if (socRes.data.success) {
          const socialData = socRes.data.socials || {};
          setSocials({
            github: socialData.github || "",
            linkedin: socialData.linkedin || "",
            instagram: socialData.instagram || "",
            whatsapp: socialData.whatsapp || "",
            x: socialData.x || "", // ✅ added X
          });
          // Debugging (dekho backend kya bhej raha hai)
          console.log("Hero:", heroRes.data);
          console.log("Skills:", skillsRes.data);
          console.log("Projects:", projectsRes.data);
          console.log("Services:", servicesRes.data);
          console.log("Experiences:", expRes.data);
          console.log("Testimonials:", testimonialsRes.data);
          console.log("Socials:", socRes.data);
          console.log("Contact:", contactInfoRes.data);
          console.log("About:", aboutRes.data);
        }
      } catch (err) {
        console.error("Error fetching home data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  ////////////////// Contact  /////////////////////////////

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    rating: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("Sending...");

    try {
      const { data } = await API.post("/contactCreate", formData);
      setStatus(data.message || "Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "", rating: "" });
    } catch (err) {
      setStatus(err.response?.data?.message || "Error sending message.");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);
  if (loading) return <div className="p-6 text-center">⏳ Loading...</div>;

  // Static icons array in the same order as aboutCards
  const icons = [
    <MapPin className="w-5 h-5 text-indigo-500" />,
    <Calendar className="w-5 h-5 text-indigo-500" />,
    <Award className="w-5 h-5 text-indigo-500" />,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white text-neutral-900">
      {/* Top soft glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        aria-hidden>
        <div className="absolute -top-24 left-1/2 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-blue-200 blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-neutral-200">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wide text-neutral-900 cursor-pointer">Rohit Singh</span>
          </div>

          <ul className="hidden md:flex items-center gap-4 lg:gap-5 text-sm text-neutral-700">
            {navItems.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => scrollTo(n.id)}
                  className="hover:text-blue-700 transition cursor-pointer"
                >
                  {n.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {socials &&
              Object.entries(socials).map(([key, link]) => {
                if (!link) return null;

                let Icon, iconHoverColor, visibilityClass;

                switch (key) {
                  case "github":
                    Icon = FaGithub;
                    iconHoverColor = "group-hover:text-gray-800";
                    visibilityClass = "hidden lg:inline-flex"; // hidden <1024px
                    break;
                  case "linkedin":
                    Icon = FaLinkedin;
                    iconHoverColor = "group-hover:text-blue-700";
                    visibilityClass = "inline-flex"; // always visible
                    break;
                  case "instagram":
                    Icon = FaInstagram;
                    iconHoverColor = "group-hover:text-pink-500";
                    visibilityClass = "inline-flex"; // always visible
                    break;
                  case "whatsapp":
                    Icon = FaWhatsapp;
                    iconHoverColor = "group-hover:text-green-500";
                    visibilityClass = "inline-flex"; // always visible
                    break;
                  case "x":
                    Icon = FaTwitter;
                    iconHoverColor = "group-hover:text-blue-400";
                    visibilityClass = "hidden lg:inline-flex"; // hidden <1024px
                    break;
                  default:
                    return null;
                }

                return (
                  <a
                    key={key}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group ${visibilityClass} items-center justify-center rounded-full border border-neutral-200 bg-white h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 transition-all duration-300 cursor-pointer`} // cursor-pointer added
                  >
                    <Icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black transition-colors duration-300 ${iconHoverColor}`}
                    />
                  </a>
                );
              })}
          </div>
        </nav>
      </header>


      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 grid md:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="block text-amber-600">Hi, I'm</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-600 to-blue-800">
                {hero?.name || ""}
              </span>
              <span className="block mt-2 text-xl sm:text-2xl lg:text-3xl font-semibold text-neutral-800">
                {hero?.title || ""}
              </span>
            </h1>

            <p className="mt-4 text-neutral-600 max-w-xl">{hero?.description || ""}</p>

            {/* Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollTo("projects")}
                className="rounded-2xl px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white inline-flex items-center gap-2"
              >
                View Projects <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo("contact")}
                className="rounded-2xl px-5 py-2 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-900"
              >
                Hire Me
              </button>

              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900"
              >
                <PlayCircle className="w-4 h-4" /> Watch demo
              </a>
            </div>

            {/* Skills Badges */}
            <div className="mt-8 flex flex-wrap gap-3 text-xs">
              {hero?.skills?.map((tech, i) => (
                <Badge key={i}>{tech}</Badge>
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            {/* Profile Image */}
            <div className="max-w-sm sm:max-w-md lg:max-w-lg mx-auto overflow-hidden">
              <img
                src={hero?.image?.url || "https://via.placeholder.com/800"}
                alt="Profile"
                className="w-full h-auto object-cover rounded-b-[50%]"
              />
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              {hero?.stats?.map((s, i) => (
                <StatCard
                  key={i}
                  icon={
                    i === 0 ? (
                      <Star className="w-4 h-4" />
                    ) : i === 1 ? (
                      <Award className="w-4 h-4" />
                    ) : (
                      <Building2 className="w-4 h-4" />
                    )
                  }
                  label={s.label}
                  value={s.value}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <SectionTitle
          eyebrow="About"
          title="A blend of design, code & craft"
          subtitle="I deliver premium web experiences that look expensive and feel effortless."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aboutCards.map((card, index) => (
            <div key={card.title} className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
              {/* Icon + Title */}
              <div className="flex items-center gap-2 font-semibold text-neutral-900">
                {icons[index]} {card.title}
              </div>
              {/* Text */}
              <p className="mt-2 text-neutral-600">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <SectionTitle eyebrow="Services" title="What I do at" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div key={s.title || i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <div className="h-full rounded-2xl bg-white border border-neutral-200 hover:shadow-md transition-all p-5">
                <div className="flex items-center gap-2 font-semibold text-neutral-900">
                  {/* Fallback icon to ensure consistent UI from API data */}
                  <Code2 className="w-5 h-5" /> {s.title}
                </div>
                <p className="mt-2 text-neutral-600">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <SectionTitle eyebrow="Skills" title="Elite stack & tooling" />
        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((sk) => (
            <div key={sk.name} className="p-5 rounded-2xl bg-white border border-neutral-200">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-neutral-900">{sk.name}</span>
                <span className="text-sm text-neutral-600">{sk.level}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-200">
                <div className="h-2 rounded-full bg-gradient-to-r from-blue-700 to-sky-500" style={{ width: `${sk.level}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <SectionTitle eyebrow="Work" title="Featured projects" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div key={p.title || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group">
              <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${p.image?.url})` }} />
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-neutral-900">{p.title}</h3>
                    <span className="text-xs text-neutral-600">{p.tagline}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-700">
                    {p.tags?.map((t) => (
                      <span key={t} className="rounded-full border border-neutral-200 bg-white px-2 py-1">{t}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <a href={p.link} className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline">
                      Live <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a href={p.repo} className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline">
                      Code <Github className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <SectionTitle eyebrow="Experience" title="Journey & impact" />
        <div className="relative">
          {/* Switch to 2-column timeline only on desktop (≥1024px) */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-transparent lg:left-1/2" />
          <div className="space-y-8">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.role || idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`lg:grid lg:grid-cols-2 lg:gap-8 items-start ${idx % 2 === 0 ? "lg:pr-10" : "lg:pl-10 lg:col-start-2"}`}
              >
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-neutral-900">{exp.role}</h3>
                    <span className="text-xs text-neutral-600">{exp.period}</span>
                  </div>
                  <p className="mt-1 text-neutral-700 flex items-center gap-2"><Building2 className="w-4 h-4" /> {exp.company}</p>
                  <ul className="mt-3 space-y-2 text-neutral-700 text-sm">
                    {exp.points?.map((pt, i2) => (
                      <li key={pt + i2} className="flex items-start gap-2"><ChevronRight className="w-4 h-4 mt-0.5" />{pt}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <SectionTitle eyebrow="Love" title="What clients say" />
        <div className="grid sm:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={t._id || i} className="bg-white border border-neutral-200 rounded-2xl shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={t.image?.url || "/fallback.jpg"}
                    alt={t.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-neutral-900">{t.name}</p>
                    <p className="text-sm text-neutral-600">{t.title}</p>
                  </div>
                </div>
                <p className="mt-4 text-neutral-700">“{t.quote}”</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <SectionTitle eyebrow="Contact" title="Let’s build your dream" subtitle="Quick response. Clear scope." />
        <div className="grid gap-6 lg:grid-cols-5">
          {contacts && (
            <div className="lg:col-span-2 space-y-4">
              {/* Email */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-neutral-600">Email</p>
                    <a href={`mailto:${contacts.email}`} className="font-semibold hover:underline">
                      {contacts.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-neutral-600">Phone</p>
                    <a href={`tel:${contacts.phone}`} className="font-semibold hover:underline">
                      {contacts.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-neutral-600">Location</p>
                    <span className="font-semibold">{contacts.location}</span>
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="flex items-center gap-2">
                <a
                  href={contacts.resume} // backend se full URL aayega
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="rounded-2xl px-4 py-2 border border-neutral-300 bg-white hover:bg-neutral-50 inline-flex items-center gap-2 text-neutral-900"
                >
                  <Download className="mr-1 w-4 h-4" /> Download CV
                </a>
                <button className="rounded-2xl px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white">
                  Schedule a Call
                </button>
              </div>

            </div>
          )}

          <div className="lg:col-span-3 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="bg-white border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-600"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="bg-white border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="bg-white border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-600"
                required
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project"
                className="bg-white border rounded-lg px-3 py-2 w-full min-h-[140px] focus:ring-2 focus:ring-blue-600"
                required
              />

              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="bg-white border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Select Rating</option>
                {[
                  { value: 1, label: "1 – Poor" },
                  { value: 2, label: "2 – Fair" },
                  { value: 3, label: "3 – Good" },
                  { value: 4, label: "4 – Very Good" },
                  { value: 5, label: "5 – Excellent" },
                ].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>


              <button
                type="submit"
                disabled={isSubmitting}
                className={`rounded-2xl px-5 py-2 text-white w-40 ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
                  }`}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {status && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-3 rounded-md text-white fixed bottom-5 right-5 shadow-lg ${status.toLowerCase().includes("sending")
                    ? "bg-red-600"
                    : status.toLowerCase().includes("success")
                      ? "bg-red-600"
                      : "bg-green-600"
                    }`}
                >
                  {status}
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-600">
          <p>© {new Date().getFullYear()} Rohit Singh — All rights reserved.</p>

          <div className="flex items-center gap-3">
            {socials &&
              Object.entries(socials).map(([key, link]) => {
                if (!link) return null;

                // Hide GitHub/X on small screens (mobile/tablet)
                const isHiddenOnMobile = (key === "github" || key === "x") ? "hidden sm:inline-flex" : "";

                let Icon, iconHoverColor;
                switch (key) {
                  case "github":
                    Icon = FaGithub;
                    iconHoverColor = "group-hover:text-gray-800";
                    break;
                  case "linkedin":
                    Icon = FaLinkedin;
                    iconHoverColor = "group-hover:text-blue-700";
                    break;
                  case "instagram":
                    Icon = FaInstagram;
                    iconHoverColor = "group-hover:text-pink-500";
                    break;
                  case "whatsapp":
                    Icon = FaWhatsapp;
                    iconHoverColor = "group-hover:text-green-500";
                    break;
                  case "x":
                    Icon = FaTwitter; // Placeholder for X
                    iconHoverColor = "group-hover:text-blue-400";
                    break;
                  default:
                    return null;
                }

                return (
                  <a
                    key={key}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
            group
            ${isHiddenOnMobile}
            inline-flex items-center justify-center
            rounded-full border border-neutral-200
            bg-white
            h-8 w-8
            sm:h-10 sm:w-10
            md:h-12 md:w-12
            transition-all duration-300
          `}
                  >
                    <Icon
                      className={`
              w-4 h-4
              sm:w-5 sm:h-5
              md:w-6 md:h-6
              text-black
              transition-colors duration-300
              ${iconHoverColor}
            `}
                    />
                  </a>
                );
              })}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
