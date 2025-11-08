/* ===== إعداد Firebase ===== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

/* 🔥 إعدادات Firebase الخاصة بك */
const firebaseConfig = {
  apiKey: "AIzaSyC8UmPkL9-AgrlPRPERwkYJ5uzTYX1fmDY",
  authDomain: "test-yourself-6afaa.firebaseapp.com",
  databaseURL: "https://test-yourself-6afaa-default-rtdb.firebaseio.com",
  projectId: "test-yourself-6afaa",
  storageBucket: "test-yourself-6afaa.firebasestorage.app",
  messagingSenderId: "886218676173",
  appId: "1:886218676173:web:6000c95948433e89d1d684",
  measurementId: "G-SXBVYN9R4R"
};

/* 🚀 التهيئة */
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* 🔹 عناصر الصفحة */
const logoContainer = document.getElementById("logoContainer");
const teachersContainer = document.getElementById("teachersContainer");
const socialsFooter = document.getElementById("footerSocials");
const siteInfoFooter = document.getElementById("siteInfo");

/* 🩺 عرض الشعار */
onValue(ref(db, "settings/logo"), (snapshot) => {
  const logoUrl = snapshot.val();
  if (logoUrl) {
    logoContainer.innerHTML = `
      <img src="${logoUrl}" alt="شعار سنتر الأطباء" class="logo-img">
      <h1 class="animated-text">سنتر الأطباء التعليمي</h1>
    `;
  } else {
    logoContainer.innerHTML = `<h1 class="animated-text">سنتر الأطباء التعليمي</h1>`;
  }
});

/* 👩‍🏫 عرض المعلمين */
onValue(ref(db, "teachers"), (snapshot) => {
  const data = snapshot.val();
  teachersContainer.innerHTML = "";
  if (data) {
    Object.entries(data).forEach(([id, teacher]) => {
      const div = document.createElement("div");
      div.classList.add("teacher-card");
      div.innerHTML = `
        <img src="${teacher.image || 'https://via.placeholder.com/200'}" alt="${teacher.name}">
        <h3>${teacher.name}</h3>
        <p>${teacher.subject}</p>
        <p>${teacher.grade}</p>
        <p class="rating">⭐ ${teacher.rating || 5}</p>
        <button onclick="window.location.href='teacher.html?id=${id}'">الملف الشخصي</button>
      `;
      teachersContainer.appendChild(div);
    });
  } else {
    teachersContainer.innerHTML = `<p>لا يوجد معلمون بعد.</p>`;
  }
});

/* 🌍 معلومات الموقع */
onValue(ref(db, "settings/siteInfo"), (snapshot) => {
  const data = snapshot.val();
  if (data) {
    siteInfoFooter.innerHTML = `
      <p>📍 ${data.location || "الموقع غير محدد"}</p>
      <p>${data.name ? `🏫 ${data.name}` : ""}</p>
    `;
  } else {
    siteInfoFooter.innerHTML = `<p>لم تتم إضافة معلومات الموقع بعد.</p>`;
  }
});

/* 🔗 روابط التواصل الاجتماعي */
onValue(ref(db, "socials"), (snapshot) => {
  const data = snapshot.val();
  socialsFooter.innerHTML = "";
  if (data) {
    Object.values(data).forEach((soc) => {
      socialsFooter.innerHTML += `
        <a href="${soc.link}" target="_blank">
          ${soc.image ? `<img src="${soc.image}" alt="${soc.name}" style="width:25px;height:25px;border-radius:50%;">` : (soc.emoji || "🔗")}
          ${soc.name}
        </a>
      `;
    });
  } else {
    socialsFooter.innerHTML = `<p>لا توجد روابط تواصل بعد.</p>`;
  }
});
