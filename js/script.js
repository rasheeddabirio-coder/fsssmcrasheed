/* =========================
   LANGUAGE CONTENT
========================= */
const langData = {
  en: {
    title: "Federal Site & Service Scheme Muslim Community Mosque",
    subtitle: "Unity • Faith • Community Service",
    homeTitle: "Welcome to FSSSMC Mosque",
    homeText:
      "A spiritual and community center dedicated to worship, education, and service to humanity.",
    aboutTitle: "About the Mosque",
    aboutText:
      "The Federal Site and Service Scheme Muslim Community Mosque serves as a hub for spiritual growth, Islamic education, and community development.",
    prayerTitle: "Live Prayer Times",
    eventsTitle: "Upcoming Events",
    donateTitle: "Support the Mosque",
    donateText:
      "Your donations help maintain the mosque and support community programs.",
    contactTitle: "Contact Us",
    mapTitle: "Mosque Location",
  },
  ar: {
    title: "مسجد المجتمع الإسلامي",
    subtitle: "وحدة • إيمان • خدمة المجتمع",
    homeTitle: "مرحباً بكم في مسجد المجتمع الإسلامي",
    homeText: "مركز روحي ومجتمعي مخصص للعبادة والتعليم وخدمة الإنسانية.",
    aboutTitle: "عن المسجد",
    aboutText: "يخدم المسجد المجتمع من خلال التعليم الإسلامي والتنمية الروحية.",
    prayerTitle: "مواقيت الصلاة المباشرة",
    eventsTitle: "الفعاليات القادمة",
    donateTitle: "دعم المسجد",
    donateText: "تبرعاتكم تساعد في صيانة المسجد ودعم البرامج المجتمعية.",
    contactTitle: "اتصل بنا",
    mapTitle: "موقع المسجد",
  },
};

/* =========================
   LANGUAGE SWITCHER
========================= */
function setLanguage(lang) {
  if (!langData[lang]) return;

  Object.keys(langData[lang]).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = langData[lang][id];
  });

  document.body.dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lang;
}

/* =========================
   PRAYER TIME API (ALADHAN)
========================= */
function getPrayerTimes() {
  const cityEl = document.getElementById("city");
  if (!cityEl) return;

  const city = cityEl.value;
  const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Nigeria`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response failed");
      }
      return response.json();
    })
    .then((data) => {
      const t = data.data.timings;
      document.getElementById("fajr").textContent = t.Fajr;
      document.getElementById("dhuhr").textContent = t.Dhuhr;
      document.getElementById("asr").textContent = t.Asr;
      document.getElementById("maghrib").textContent = t.Maghrib;
      document.getElementById("isha").textContent = t.Isha;
    })
    .catch(() => {
      alert(
        "Unable to load prayer times. Please check your internet connection.",
      );
    });
}

/* =========================
   DONATION (DEMO)
========================= */
function donate() {
  alert(
    "Secure donations will be processed via approved payment gateways such as Paystack or Flutterwave.",
  );
}

/* =========================
   MODAL CONTROLS
========================= */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "block";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

/* =========================
   AUTHENTICATION (DEMO)
========================= */
function login() {
  const modal = document.getElementById("loginModal");
  const inputs = modal.querySelectorAll("input");

  if (!inputs[0].value || !inputs[1].value) {
    alert("Please enter email and password.");
    return;
  }

  alert("Login successful (demo). Backend integration required.");
  closeModal("loginModal");
}

function signup() {
  const modal = document.getElementById("signupModal");
  const inputs = modal.querySelectorAll("input");

  for (let input of inputs) {
    if (!input.value) {
      alert("Please fill in all fields.");
      return;
    }
  }

  alert("Account created successfully (demo).");
  closeModal("signupModal");
}

/* =========================
   INITIAL LOAD
========================= */
document.addEventListener("DOMContentLoaded", () => {
  setLanguage("en");
  getPrayerTimes();
});

function toggleMenu() {
  document.querySelector(".menu").classList.toggle("active");
}

document.querySelectorAll('.dropdown-toggle').forEach(button => {
    button.addEventListener('click', () => {
        const section = button.parentElement;
        section.classList.toggle('active');
    });
});

