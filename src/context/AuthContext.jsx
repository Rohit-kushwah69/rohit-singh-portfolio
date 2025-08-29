import { createContext, useEffect, useState } from "react";
import API from "../services/api";

// Context create
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Public Data States
  const [hero, setHero] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [skills, setSkills] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [about, setAbout] = useState([]);
  const [contactInfo, setContactInfo] = useState([]);
  const [social, setSocial] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // ✅ Profile check (auth)
        const profileRes = await API.get("/");
        if (profileRes.data.success) {
          setUser(profileRes.data.user);
        } else {
          setUser(null);
        }

        // ✅ Public Data parallel fetch
        const [
          heroRes,
          projectRes,
          serviceRes,
          skillRes,
          testimonialRes,
          aboutRes,
          contactInfoRes,
          socialRes,
        ] = await Promise.all([
          API.get("/heroGet"),
          API.get("/display"),
          API.get("/serviceDisplay"),
          API.get("/skillDisplay"),
          API.get("/testimonialDisplay"),
          API.get("/aboutDisplay"),
          API.get("/contactInfoDisplay"),
          API.get("/socialDisplay"),
        ]);

        setHero(heroRes.data);
        setProjects(projectRes.data);
        setServices(serviceRes.data);
        setSkills(skillRes.data);
        setTestimonials(testimonialRes.data);
        setAbout(aboutRes.data);
        setContactInfo(contactInfoRes.data);
        setSocial(socialRes.data);

      } catch (err) {
        console.error("AuthContext Fetch Error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        hero,
        projects,
        services,
        skills,
        testimonials,
        about,
        contactInfo,
        social,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
