document.addEventListener("DOMContentLoaded", () => {

    const METHOD = 2; // ISNA
    const DEFAULT = { lat: 6.5244, lon: 3.3792, city: "Lagos", country: "Nigeria" };

    /* ================= GET LOCATION ================= */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => init(pos.coords.latitude, pos.coords.longitude),
            () => init(DEFAULT.lat, DEFAULT.lon)
        );
    } else {
        init(DEFAULT.lat, DEFAULT.lon);
    }

    function init(lat, lon) {
        loadPrayerTimes(lat, lon);
        loadQibla(lat, lon);
    }

    /* ================= PRAYER TIMES ================= */
    function loadPrayerTimes(lat, lon) {
        fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=${METHOD}`)
            .then(res => res.json())
            .then(data => processTimings(data.data.timings))
            .catch(err => console.error(err));
    }

    function processTimings(t) {
        const prayers = [
            { name: "Fajr", time: t.Fajr },
            { name: "Dhuhr", time: t.Dhuhr },
            { name: "Asr", time: t.Asr },
            { name: "Maghrib", time: t.Maghrib },
            { name: "Isha", time: t.Isha }
        ];

        updateTicker(prayers);
        updateFooter(prayers);
        startPrayerLogic(prayers);
    }

    /* ================= TICKER ================= */
    function updateTicker(prayers) {
        document.getElementById("prayerTicker").textContent =
            prayers.map(p => `${p.name} ${p.time}`).join(" • ");
    }

    /* ================= FOOTER ================= */
    function updateFooter(prayers) {
        const ul = document.getElementById("footerPrayerList");
        ul.innerHTML = "";
        prayers.forEach(p => {
            const li = document.createElement("li");
            li.textContent = `${p.name}: ${p.time}`;
            ul.appendChild(li);
        });
    }

    /* ================= CORE LOGIC ================= */
    function startPrayerLogic(prayers) {
        const title = document.getElementById("nextPrayerTitle");
        const countdown = document.getElementById("prayerCountdown");
        const items = document.querySelectorAll("#prayerStatusList li");

        function getDateWithTime(time) {
            const [h, m] = time.split(":");
            const d = new Date();
            d.setHours(h, m, 0, 0);
            return d;
        }

        function update() {
            const now = new Date();
            const isFriday = now.getDay() === 5;

            let current = null;
            let next = null;

            const schedule = prayers.map(p => ({
                name: p.name,
                time: getDateWithTime(p.time)
            }));

            // Handle Jum‘ah (Friday)
            if (isFriday) {
                const khutbah = getDateWithTime("13:00");
                const jumah = getDateWithTime("13:30");

                if (now < khutbah) {
                    next = { name: "Jum‘ah Khutbah", time: khutbah };
                } else if (now < jumah) {
                    current = "Jum‘ah Khutbah";
                    next = { name: "Jum‘ah Prayer", time: jumah };
                } else if (now < schedule[2].time) {
                    current = "Jum‘ah Prayer";
                    next = schedule[2];
                }
            }

            // Normal daily prayers
            if (!next) {
                for (let i = 0; i < schedule.length; i++) {
                    if (now < schedule[i].time) {
                        next = schedule[i];
                        current = schedule[i - 1]?.name || "Isha";
                        break;
                    }
                }
            }

            // After Isha → next day Fajr
            if (!next) {
                const fajr = getDateWithTime(prayers[0].time);
                fajr.setDate(fajr.getDate() + 1);
                next = { name: "Fajr", time: fajr };
                current = "Isha";
            }

            // Countdown
            const diff = next.time - now;
            const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
            const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
            const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");

            title.textContent = `Next: ${next.name}`;
            countdown.textContent = `Time Remaining: ${h}:${m}:${s}`;

            // Highlight prayers
            items.forEach(li => {
                li.classList.remove("active", "current");
                if (li.dataset.prayer === next.name) li.classList.add("active");
                if (li.dataset.prayer === current) li.classList.add("current");
            });
        }

        update();
        setInterval(update, 1000);
    }

    /* ================= QIBLA ================= */
    function loadQibla(lat, lon) {
        fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lon}`)
            .then(res => res.json())
            .then(data => {
                const angle = data.data.direction;
                document.getElementById("qiblaAngle").textContent = angle.toFixed(1);
                document.getElementById("qiblaArrow").style.transform =
                    `translateX(-50%) rotate(${angle}deg)`;
            });
    }

});