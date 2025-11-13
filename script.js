import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// إعدادات Firebase
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

// التهيئة
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// عناصر الصفحة
const logoContainer = document.getElementById("logoContainer");
const teachersContainer = document.getElementById("teachersContainer");
const socialsFooter = document.getElementById("footerSocials");
const siteInfoFooter = document.getElementById("siteInfo");
const searchInput = document.getElementById("searchInput");

// عرض الشعار دائماً
onValue(ref(db, "settings/logo"), snapshot => {
  const logoUrl = snapshot.val();
  logoContainer.innerHTML = `
    ${logoUrl ? `<img src="${logoUrl}" alt="شعار المركز" class="logo-img">` : ""}
    <h1 class="animated-text">سنتر الأطباء التعليمي</h1>
  `;
});

// عرض المعلمين
onValue(ref(db, "teachers"), snapshot => {
  const data = snapshot.val();
  if (!teachersContainer) return;
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

// البحث
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    Array.from(teachersContainer.children).forEach(card => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      const subject = card.querySelector("p").textContent.toLowerCase();
      card.style.display = (name.includes(term) || subject.includes(term)) ? "block" : "none";
    });
  });
}

// بيانات الفوتر
onValue(ref(db, "settings/siteInfo"), snapshot => {
  const data = snapshot.val();
  if (data) {
    siteInfoFooter.innerHTML = `
      <p>📍 ${data.location || ""}</p>
      <p>${data.name || ""}</p>
    `;
  } else {
    siteInfoFooter.innerHTML = `<p>لم تتم إضافة معلومات الموقع بعد.</p>`;
  }
});

// عرض منصات التواصل على شكل كروت
onValue(ref(db, "socials"), snapshot => {
  const data = snapshot.val();
  socialsFooter.innerHTML = "";
  if (data) {
    Object.values(data).forEach(soc => {
      const a = document.createElement("a");
      a.href = soc.link;
      a.target = "_blank";
      a.classList.add("social-card");
      a.innerHTML = `
        ${soc.image ? `<img src="${soc.image}" alt="${soc.name}">` : (soc.emoji || "🔗")}
        <span>${soc.name}</span>
      `;
      socialsFooter.appendChild(a);
    });
  } else {
    socialsFooter.innerHTML = `<p>لا توجد روابط تواصل بعد.</p>`;
  }
});
